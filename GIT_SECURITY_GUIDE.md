# 🔒 Руководство по Безопасности Git - Очистка Истории от Паролей

## ⚠️ КРИТИЧЕСКИ ВАЖНО

Если пароли или ключи API попали в Git историю, они считаются **скомпрометированными**. Даже после удаления из истории, необходимо:

1. **Немедленно сменить ВСЕ утекшие пароли и ключи**
2. Пересоздать API токены
3. Обновить секреты в production окружении
4. Проверить логи доступа на предмет подозрительной активности

---

## 🚀 Быстрый Старт

### Метод 1: Использование скрипта (Рекомендуется)

```bash
# Сделать скрипт исполняемым
chmod +x clean-git-history.sh

# Запустить скрипт
./clean-git-history.sh
```

Скрипт предложит несколько вариантов:
- **Опция 1**: Удалить конкретные файлы
- **Опция 2**: Заменить конкретные строки/пароли
- **Опция 3**: Удалить все .env файлы
- **Опция 4**: Комплексная очистка (рекомендуется)

### Метод 2: Ручная очистка

#### Установка git-filter-repo

```bash
# macOS
brew install git-filter-repo

# Linux/macOS через pip
pip3 install git-filter-repo
```

#### Удаление конкретного файла

```bash
# Удалить .env из всей истории
git filter-repo --path .env --invert-paths --force

# Удалить несколько файлов
git filter-repo --path .env --path secrets.txt --invert-paths --force
```

#### Замена конкретных строк

Создайте файл `replacements.txt`:
```
my_secret_password==>REMOVED
sk-1234567890abcdef==>REMOVED
postgres://user:pass@host==>postgres://user:REMOVED@host
```

Затем выполните:
```bash
git filter-repo --replace-text replacements.txt --force
```

---

## 📋 Пошаговая Инструкция

### Шаг 1: Создание резервной копии

```bash
# Создать резервную копию всего репозитория
cd /path/to/your/repo
cd ..
cp -r your-repo your-repo-backup
```

### Шаг 2: Очистка истории

Используйте скрипт `clean-git-history.sh` или выполните команды вручную (см. выше).

### Шаг 3: Очистка локальных ссылок

```bash
# Удалить все локальные ссылки на старые коммиты
git reflog expire --expire=now --all

# Запустить сборку мусора
git gc --prune=now --aggressive
```

### Шаг 4: Проверка результата

```bash
# Проверить историю
git log --all --oneline

# Поиск утекших данных в истории
git log -S "ваш_пароль" --all
git grep "api_key" $(git rev-list --all)
```

### Шаг 5: Отправка в удаленный репозиторий

```bash
# Принудительно обновить все ветки
git push origin --force --all

# Принудительно обновить все теги
git push origin --force --tags
```

### Шаг 6: Оповещение команды

**⚠️ КРИТИЧЕСКИ ВАЖНО**: Все члены команды должны:

1. Удалить свои локальные копии репозитория
2. Сделать свежий клон:
   ```bash
   git clone https://github.com/username/repo.git
   ```
3. **НЕ использовать старые клоны или делать pull** - это вернет старую историю!

---

## 🛡️ Предотвращение Будущих Утечек

### 1. Установите git-secrets

```bash
# macOS
brew install git-secrets

# Инициализация в репозитории
cd /path/to/your/repo
git secrets --install

# Добавить правила для AWS
git secrets --register-aws

# Добавить кастомные правила
git secrets --add 'password\s*=\s*.+'
git secrets --add 'api[_-]?key\s*=\s*.+'
git secrets --add '[0-9a-zA-Z]{32,}'
```

### 2. Настройте pre-commit хуки

Создайте файл `.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Проверка на наличие .env файлов
if git diff --cached --name-only | grep -E '\.env$|\.env\..*'; then
    echo "❌ Попытка закоммитить .env файл!"
    echo "Добавьте его в .gitignore"
    exit 1
fi

# Проверка на наличие паролей в коммите
if git diff --cached | grep -iE 'password|api[_-]?key|secret|token'; then
    echo "⚠️  Обнаружены подозрительные строки в коммите!"
    echo "Проверьте, не коммитите ли вы чувствительные данные"
    read -p "Продолжить? (yes/no): " choice
    if [ "$choice" != "yes" ]; then
        exit 1
    fi
fi
```

Сделайте хук исполняемым:
```bash
chmod +x .git/hooks/pre-commit
```

### 3. Проверьте .gitignore

Убедитесь, что `.gitignore` включает:

```gitignore
# Файлы с окружением
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local

# Ключи и сертификаты
*.pem
*.key
*.p12
*.pfx
*.cer
*.crt

# Файлы с секретами
secrets.yml
secrets.yaml
credentials.json
*secret*
*password*

# AWS
.aws/credentials

# SSH ключи
id_rsa
id_ed25519
*.ppk
```

### 4. Используйте переменные окружения

**Плохо:**
```javascript
const apiKey = "sk-1234567890abcdef";
const password = "myPassword123";
```

**Хорошо:**
```javascript
const apiKey = process.env.API_KEY;
const password = process.env.DATABASE_PASSWORD;
```

### 5. Используйте менеджеры секретов

- **Для разработки**: [dotenv](https://www.npmjs.com/package/dotenv)
- **Для production**: 
  - AWS Secrets Manager
  - HashiCorp Vault
  - Azure Key Vault
  - Google Cloud Secret Manager

---

## 🔍 Проверка репозитория на утечки

### Поиск чувствительных данных

```bash
# Поиск строк с password в истории
git log -S "password" --all

# Поиск API ключей
git grep -i "api.key" $(git rev-list --all)

# Поиск токенов
git grep -E '[0-9a-zA-Z]{32,}' $(git rev-list --all)

# Использование специализированных инструментов
# Установка truffleHog
pip3 install truffleHog

# Сканирование репозитория
trufflehog --regex --entropy=True .
```

### Использование GitHub Secret Scanning

GitHub автоматически сканирует публичные репозитории на наличие известных типов секретов. Для приватных репозиториев:

1. Перейдите в Settings → Security → Code security and analysis
2. Включите "Secret scanning"

---

## 📱 Что делать после утечки

### Контрольный список

- [ ] Найти и зафиксировать все утекшие секреты
- [ ] Очистить историю Git (используя этот скрипт)
- [ ] **СМЕНИТЬ ВСЕ СКОМПРОМЕТИРОВАННЫЕ ПАРОЛИ**
- [ ] Пересоздать API ключи и токены
- [ ] Обновить секреты в CI/CD пайплайнах
- [ ] Обновить секреты в production окружении
- [ ] Проверить логи доступа на подозрительную активность
- [ ] Оповестить команду о необходимости переклонировать репозиторий
- [ ] Настроить pre-commit хуки для предотвращения будущих утечек
- [ ] Внедрить использование менеджера секретов
- [ ] Провести обучение команды по безопасности

### Проверка логов

```bash
# Проверить последние коммиты в репозиторий
git log --all --since="2 weeks ago" --author=".*"

# Проверить кто мог склонировать репозиторий
# (если это GitHub, проверьте Insights → Traffic)
```

---

## 🆘 Альтернативные методы

### Использование BFG Repo-Cleaner (legacy)

```bash
# Установка
brew install bfg

# Удалить файл
bfg --delete-files .env

# Заменить строки
bfg --replace-text replacements.txt

# Очистка
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Использование встроенного git filter-branch (не рекомендуется - медленно)

```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 📚 Дополнительные ресурсы

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [git-filter-repo documentation](https://github.com/newren/git-filter-repo)
- [OWASP: Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [12 Factor App: Config](https://12factor.net/config)

---

## ❓ FAQ

**Q: Достаточно ли просто удалить файл из последнего коммита?**  
A: НЕТ! Файл остается в истории Git и доступен в предыдущих коммитах.

**Q: Можно ли восстановить удаленную историю?**  
A: Технически да, если кто-то сохранил копию до очистки. Поэтому важно сменить все пароли!

**Q: Нужно ли оповещать всю команду?**  
A: Да, абсолютно! Все должны переклонировать репозиторий.

**Q: Как проверить, что очистка прошла успешно?**  
A: Используйте `git log -S "ваш_пароль" --all` - не должно быть результатов.

**Q: Что если репозиторий публичный?**  
A: Считайте, что секреты полностью скомпрометированы. Смените их немедленно!

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте, что у вас установлен `git-filter-repo`
2. Убедитесь, что создали резервную копию
3. Прочитайте сообщения об ошибках - они обычно информативны
4. При необходимости откатитесь к резервной копии

---

**Помните: Лучшая защита - это предотвращение. Никогда не коммитьте секреты!** 🔒
