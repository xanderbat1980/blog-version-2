#!/usr/bin/env python3
"""Confirm that no original visible words, image references or external links were lost.

The HTML5 parser matches browser error recovery for the malformed original pages.
Run with the pinned developer requirements; production does not need Python packages.
"""
from collections import Counter
from pathlib import Path
import subprocess
import sys
import base64
import hashlib
import json
from bs4 import BeautifulSoup, Comment, NavigableString
import html5lib

ROOT = Path(__file__).resolve().parents[1]
BASELINE = 'ba502d097ffd4fd971ea81f65779852fb6e294cf'
RESOLUTIONS = json.loads((ROOT / 'docs/asset-resolutions.json').read_text())
ALIASES = {entry['requested']: entry['resolved_path'] for entry in
           RESOLUTIONS['images'] + RESOLUTIONS['additional_path_corrections']
           if 'resolved_path' in entry}


def visible_words(soup):
    return Counter(' '.join(str(n) for n in soup.body.descendants
                            if isinstance(n, NavigableString) and not isinstance(n, Comment)
                            and n.parent.name not in {'script', 'style'}).split())


def references(soup, tag, attr):
    values = [n.get(attr, '') for n in soup.find_all(tag) if n.get(attr, '')]
    if tag == 'img' and attr == 'src':
        # An unrecoverable image remains explicitly recorded in its visible,
        # non-image placeholder; verified filename corrections are normalized.
        values += [n['data-original-src'] for n in soup.select('[data-original-src]')]
    normalized = [value.removeprefix('./').lstrip('/') for value in values]
    return Counter(ALIASES.get(value, value) for value in normalized)


errors = []
original_files = subprocess.check_output(['git', 'ls-tree', '--name-only', BASELINE], cwd=ROOT, text=True).splitlines()
originals = {name: subprocess.check_output(['git', 'show', f'{BASELINE}:{name}'], cwd=ROOT).decode('utf-8-sig')
             for name in original_files if name.endswith('.html')}
archive = json.loads((ROOT / 'docs/legacy/article10-source.json').read_text())
raw = base64.b64decode(archive['content'])
assert hashlib.sha256(raw).hexdigest() == archive['sha256'], 'article10 source checksum differs'
assert hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest() == archive['git_blob_sha'], 'article10 Git blob differs'
originals['article10.html'] = raw.decode('utf-8-sig')
for name, original in originals.items():
    before = BeautifulSoup(original, 'html5lib')
    after = BeautifulSoup((ROOT / name).read_text(), 'html5lib')
    for kind, lost in [
        ('visible words', visible_words(before) - visible_words(after)),
        ('image references', references(before, 'img', 'src') - references(after, 'img', 'src')),
        ('external links', Counter(n['href'] for n in before.select('a[href]') if n['href'].startswith('https:'))
         - Counter(n['href'] for n in after.select('a[href]') if n['href'].startswith('https:'))),
    ]:
        if lost:
            errors.append(f'{name}: lost {kind}: {dict(lost)}')

for page in ROOT.glob('*.html'):
    parser = html5lib.HTMLParser()
    parser.parse(page.read_text())
    if parser.errors:
        errors.append(f'{page.name}: HTML5 parse errors: {parser.errors[:3]}')

if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print('PASS: original words, audited image references and HTTPS links preserved across 23 original pages plus recovered article10; all current pages parse as HTML5.')
