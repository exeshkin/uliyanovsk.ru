import re

with open('uliyanovsk.ru/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

original_size = len(css)

# Удаляем .button-to-top,.error-fzf -> .button-to-top
css = css.replace('.button-to-top,.error-fzf{display:flex;align-items:center}', '.button-to-top{display:flex;align-items:center}')

# Удаляем все классы .error-fzf
patterns = [
    r'\.error-fzf\{flex-direction:column;justify-content:space-around;flex-grow:1;padding:15px 0\}',
    r'\.error-fzf__btn,\.error-fzf__info\{display:flex;justify-content:center;align-items:center\}',
    r'\.error-fzf__info\{flex-direction:column;font-size:14px;line-height:14px\}',
    r'\.error-fzf img\{display:block;width:80%\}',
    r'\.error-fzf p\{padding:0 0 20px\}',
    r'\.error-fzf__btn\{display:block;width:200px;border:1px solid rgba\(52,50,50,\.5\);padding:7px 43px;margin-bottom:7px;font-size:11px;line-height:11px;color:#263952;transition:all 300ms\}',
    r'\.error-fzf__btn:last-child\{margin-bottom:0\}',
    r'\.error-fzf__btn:hover\{transform:scale\(1\.05\);background:rgba\(162,163,169,\.5\)\}',
    r'\.error-fzf\{padding:15px 0\}',
    r'\.error-fzf\{padding:20px 0\}',
    r'\.error-fzf\{padding:25px 0\}',
    r'\.error-fzf__info\{font-size:15px;line-height:15px\}',
    r'\.error-fzf__info\{font-size:16px;line-height:16px\}',
    r'\.error-fzf__info\{font-size:17px;line-height:17px\}',
    r'\.error-fzf__info\{font-size:18px;line-height:18px\}',
    r'\.error-fzf__info\{font-size:19px;line-height:19px\}',
    r'\.error-fzf__info\{font-size:20px;line-height:20px\}',
    r'\.error-fzf__info\{font-size:22px;line-height:22px\}',
    r'\.error-fzf__btn\{width:230px;font-size:14px;line-height:14px\}',
    r'\.error-fzf__btn\{width:250px\}',
    r'\.error-fzf__btn\{width:260px\}',
    r'\.error-fzf__btn\{width:270px\}',
    r'\.error-fzf__btn\{width:290px;padding:10px 50px\}',
]

for pattern in patterns:
    css = re.sub(pattern, '', css)

with open('uliyanovsk.ru/css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

new_size = len(css)
print(f'Готово! {original_size} -> {new_size} bytes ({original_size - new_size} bytes удалено)')
