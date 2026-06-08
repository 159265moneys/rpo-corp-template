#!/usr/bin/env python3
"""旧トラックSVGロゴを Mマーク+赤ドット の新ロゴに置換"""
import re
from pathlib import Path

ROOT = Path('/Users/t.y/Desktop/建築クン')

OLD_BLOCK = re.compile(
    r'<path d="M9 22 L9 14 L19 14 L19 18 L24 18 L27 22 L27 24 L25 24 A2 2 0 0 1 21 24 L15 24 A2 2 0 0 1 11 24 L9 24 Z" fill="#C8102E"/>\s*'
    r'<circle cx="13" cy="24" r="2" fill="(#fff|#0F2A4A)"/>\s*'
    r'<circle cx="23" cy="24" r="2" fill="(#fff|#0F2A4A)"/>'
)

def repl(m):
    stroke = m.group(1)  # header → #fff, footer → #0F2A4A
    return (
        f'<path d="M9 26 L9 10 L13 10 L18 18 L23 10 L27 10 L27 26" '
        f'stroke="{stroke}" stroke-width="2.6" stroke-linejoin="round" '
        f'stroke-linecap="round" fill="none"/>'
        f'<circle cx="29.5" cy="11.5" r="2.6" fill="#C8102E"/>'
    )

total = 0
for html in sorted(ROOT.glob('*.html')):
    s = html.read_text()
    new_s, n = OLD_BLOCK.subn(repl, s)
    if n:
        html.write_text(new_s)
        total += n
        print(f'✓ {html.name}  {n} 箇所置換')

print(f'\n合計 {total} 箇所のトラックロゴをMマークに置換')
