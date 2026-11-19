#!/usr/bin/env python3
"""Build a static Pages artifact without publishing or copying development files."""
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(ROOT / 'scripts/check_site.py')], check=True)
output = ROOT / '_site'
if output.exists():
    shutil.rmtree(output)
output.mkdir()
for pattern in ('*.html', '*.css', '*.js', 'sitemap.xml', '.nojekyll'):
    for path in ROOT.glob(pattern):
        shutil.copy2(path, output / path.name)
for directory in ('vendor', 'Assets', 'assets'):
    if (ROOT / directory).is_dir():
        shutil.copytree(ROOT / directory, output / directory)
print('Prepared _site/ locally. No push, deployment or publication performed.')
