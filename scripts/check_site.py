#!/usr/bin/env python3
"""Check a static project site without network access or third-party packages."""
import argparse
from collections import Counter
from html.parser import HTMLParser
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://xanderbat1980.github.io/blog-version-2/'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def find(self, tag):
        return [attrs for name, attrs in self.tags if name == tag]


def check(strict_assets=False):
    errors = []
    manifest = json.loads((ROOT / 'docs/missing-assets.json').read_text())
    pages = {p.name: Page(p.read_text()) for p in ROOT.glob('*.html')}
    missing = Counter()
    page_refs = {}
    unconfigured = 0
    empty_images = 0
    titles = []
    descriptions = []

    for name, page in pages.items():
        text = (ROOT / name).read_text()
        def fail(message):
            errors.append(f'{name}: {message}')
        if len(page.find('title')) != 1 or len(page.find('h1')) != 1:
            fail('expected one title and one h1')
        title = re.search(r'<title>(.*?)</title>', text, re.S)
        if title:
            titles.append(title.group(1).strip())
        meta = {a.get('name'): a.get('content') for a in page.find('meta')}
        if meta.get('viewport') != 'width=device-width, initial-scale=1.0':
            fail('invalid viewport')
        if not meta.get('description'):
            fail('missing description')
        else:
            descriptions.append(meta['description'])
        canonical = [a.get('href', '') for a in page.find('link') if a.get('rel') == 'canonical']
        if len(canonical) != 1 or not canonical[0].startswith(BASE):
            fail('canonical must point to the version-2 project')
        ids = [a['id'] for _, a in page.tags if 'id' in a]
        if len(ids) != len(set(ids)):
            fail('duplicate ids')
        if not any(a.get('id') == 'site-main' for a in page.find('main')):
            fail('missing main landmark')
        for tag, attrs in page.tags:
            if 'data-unavailable-link' in attrs:
                unconfigured += 1
            if tag == 'button' and 'toggle-button' in attrs.get('class', ''):
                if not attrs.get('aria-label') or attrs.get('aria-expanded') not in {'true', 'false'}:
                    fail('menu button needs an accessible name/state')
                for control in attrs.get('aria-controls', '').split():
                    if control not in ids:
                        fail(f'unknown controlled panel {control}')
            if tag == 'img' and not attrs.get('alt'):
                fail('image needs an honest text alternative')
            if tag == 'img' and not attrs.get('src'):
                empty_images += 1
            for key in ('href', 'src', 'action'):
                value = attrs.get(key)
                if value is None:
                    continue
                url = urlsplit(value)
                if url.scheme or url.netloc:
                    if url.scheme.lower() in {'javascript', 'http'}:
                        fail(f'unsafe URL {value}')
                    continue
                if value.startswith('/'):
                    if not (tag == 'base' and value == '/blog-version-2/'):
                        fail(f'root-relative URL breaks project hosting: {value}')
                    continue
                target = unquote(url.path).removeprefix('./') or name
                if not (ROOT / target).is_file():
                    if tag == 'img' and target in manifest and 'data-missing-asset' in attrs:
                        missing[target] += 1
                        page_refs.setdefault(target, set()).add(name)
                        continue
                    fail(f'missing local target {value!r}')
                elif url.fragment and target.endswith('.html'):
                    target_ids = {a.get('id') for _, a in pages[target].tags}
                    if unquote(url.fragment) not in target_ids:
                        fail(f'missing fragment: {value}')
        for raw in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', text, re.S):
            try:
                schema = json.loads(raw)
                if not schema.get('url', '').startswith(BASE):
                    fail('structured data points outside version 2')
            except ValueError:
                fail('invalid structured data JSON')

    for label, values in [('titles', titles), ('descriptions', descriptions)]:
        if len(values) != len(set(values)):
            errors.append(f'duplicate page {label}')
    for asset, info in manifest.items():
        if (ROOT / asset).exists():
            continue  # Restoring a real asset is allowed; strict mode recognizes it.
        if missing[asset] != info['references'] or page_refs.get(asset, set()) != set(info['pages']):
            errors.append(f'missing-asset inventory out of date: {asset}')

    # Check local CSS resources (fonts, backgrounds, imports) as well as HTML.
    for css in [*ROOT.glob('*.css'), *ROOT.glob('vendor/**/*.css')]:
        for raw in re.findall(r'url\(([^)]+)\)', css.read_text()):
            value = raw.strip(' \t\n\'"')
            if urlsplit(value).scheme or value.startswith('#'):
                continue
            if not (css.parent / unquote(value)).is_file():
                errors.append(f'{css.relative_to(ROOT)}: missing CSS resource {value}')

    sources = json.loads((ROOT / 'vendor/sources.json').read_text())
    for path, info in sources.items():
        digest = hashlib.sha256((ROOT / 'vendor' / path).read_bytes()).hexdigest()
        if digest != info.get('distributed_sha256', info['sha256']):
            errors.append(f'vendored dependency checksum mismatch: {path}')
    sitemap = ET.parse(ROOT / 'sitemap.xml')
    for loc in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
        if not loc.text.startswith(BASE):
            errors.append('sitemap points outside version 2')
            continue
        target = unquote(loc.text[len(BASE):])
        if target not in pages:
            errors.append(f'sitemap target is missing: {target}')
        elif any(a.get('name') == 'robots' and 'noindex' in a.get('content', '') for a in pages[target].find('meta')):
            errors.append(f'sitemap includes a noindex page: {target}')
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    print(f'PASS: {len(pages)} pages; local links, fragments, metadata, image inventory, CSS resources and vendor checksums.')
    print(f'KNOWN LIMITATION: {len(missing)} absent image paths ({sum(missing.values())} references); article 10 absent.')
    print(f'KNOWN LIMITATION: {empty_images} image slot(s) without a source URL.')
    print(f'INFO: {unconfigured} unconfigured links are explicitly disabled, not routed to error pages.')
    if strict_assets and (missing or empty_images):
        print('PUBLICATION BLOCKED: restore the documented images before claiming visual completeness.', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--strict-assets', action='store_true')
    sys.exit(check(parser.parse_args().strict_assets))
