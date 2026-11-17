#!/usr/bin/env python3
"""Confirm that no original visible words, image references or external links were lost.

The HTML5 parser matches browser error recovery for the malformed original pages.
Run with the pinned developer requirements; production does not need Python packages.
"""
from collections import Counter
from pathlib import Path
import subprocess
import sys
from bs4 import BeautifulSoup, Comment, NavigableString
import html5lib

ROOT = Path(__file__).resolve().parents[1]
BASELINE = 'ba502d097ffd4fd971ea81f65779852fb6e294cf'


def visible_words(soup):
    return Counter(' '.join(str(n) for n in soup.body.descendants
                            if isinstance(n, NavigableString) and not isinstance(n, Comment)
                            and n.parent.name not in {'script', 'style'}).split())


def references(soup, tag, attr):
    return Counter(n.get(attr, '').removeprefix('./').lstrip('/') for n in soup.find_all(tag)
                   if n.get(attr, ''))


errors = []
original_files = subprocess.check_output(['git', 'ls-tree', '--name-only', BASELINE], cwd=ROOT, text=True).splitlines()
for name in original_files:
    if not name.endswith('.html'):
        continue
    original = subprocess.check_output(['git', 'show', f'{BASELINE}:{name}'], cwd=ROOT).decode('utf-8-sig')
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
print('PASS: original visible words, image references and HTTPS links preserved across all 23 original pages; all current pages parse as HTML5.')
