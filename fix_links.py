import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace href="anything" with href="#" for ALL <a> tags
text = re.sub(r'(?i)(<a[^>]*?href=)[\'"][^\'"]*[\'"]', r'\1"#"', text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
