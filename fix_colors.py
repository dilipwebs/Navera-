import sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(':root{--primary:#693481;', ':root{--primary:#693481;--primary-light:#d4a3fa;')

# Lighter translucent colors for borders/shadows against dark backgrounds
content = content.replace('105,52,129', '154,89,184')

# Typography and UI lines
content = content.replace('color:var(--primary)', 'color:var(--primary-light)')
content = content.replace('background:var(--primary)', 'background:var(--primary-light)')
content = content.replace('border-color:var(--primary)', 'border-color:var(--primary-light)')
content = content.replace('border:1px solid var(--primary)', 'border:1px solid var(--primary-light)')
content = content.replace('border-right:1px solid var(--primary)', 'border-right:1px solid var(--primary-light)')
content = content.replace('border-bottom:1px solid var(--primary)', 'border-bottom:1px solid var(--primary-light)')
content = content.replace('transparent,var(--primary),transparent', 'transparent,var(--primary-light),transparent')

# Gradients for glowing text
content = content.replace('linear-gradient(90deg,var(--primary),var(--primary2),var(--primary))', 'linear-gradient(90deg,var(--primary-light),var(--primary2),var(--primary-light))')
content = content.replace('#693481 0%,#9a59b8 30%,#693481 60%,#8b4a5a 80%,#693481 100%', '#d4a3fa 0%,#9a59b8 30%,#d4a3fa 60%,#8b4a5a 80%,#d4a3fa 100%')
content = content.replace('linear-gradient(90deg,var(--rose),var(--primary))', 'linear-gradient(90deg,var(--rose),var(--primary-light))')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
