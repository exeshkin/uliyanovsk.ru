import re
import os
import sys

# Устанавливаем UTF-8 для вывода
sys.stdout.reconfigure(encoding='utf-8')

print("Начало обновления версий...")

for filepath in sorted(os.listdir('uliyanovsk.ru')):
    if not filepath.endswith('.html'):
        continue
    
    full_path = os.path.join('uliyanovsk.ru', filepath)
    if not os.path.isfile(full_path):
        continue
    
    # СНАЧАЛА читаем
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Проверяем, что файл не пустой
    if not content:
        print(f"ERROR: {filepath} пустой! Пропускаем.")
        continue

    original_size = len(content)

    # Делаем замену
    content = re.sub(r'\?v=202603\d+', '?v=20260325', content)

    # ПОТОМ записываем
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

    # Проверяем размер после записи
    new_size = os.path.getsize(full_path)
    if new_size == 0:
        print(f"CRITICAL ERROR: {filepath} стал пустым после записи!")
        continue

    print(f"OK: {filepath} ({original_size} -> {new_size} bytes)")

print("\nГотово! Все версии обновлены на v=20260325")
