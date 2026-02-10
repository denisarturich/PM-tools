#!/bin/bash

# Скрипт для установки Git хуков для предотвращения утечки секретов
# Устанавливает pre-commit хук, который проверяет коммиты на наличие чувствительных данных

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  УСТАНОВКА GIT HOOKS ДЛЯ ЗАЩИТЫ ОТ УТЕЧКИ СЕКРЕТОВ        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Проверка что мы в Git репозитории
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Ошибка: Не Git репозиторий!${NC}"
    exit 1
fi

GIT_DIR=$(git rev-parse --git-dir)
HOOKS_DIR="${GIT_DIR}/hooks"
PRE_COMMIT_HOOK="${HOOKS_DIR}/pre-commit"

# Создать директорию hooks если не существует
mkdir -p "${HOOKS_DIR}"

# Проверить существующий pre-commit хук
if [ -f "${PRE_COMMIT_HOOK}" ]; then
    echo -e "${YELLOW}Pre-commit хук уже существует!${NC}"
    echo -e "${YELLOW}Путь: ${PRE_COMMIT_HOOK}${NC}"
    read -p "Создать резервную копию и перезаписать? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp "${PRE_COMMIT_HOOK}" "${PRE_COMMIT_HOOK}.backup.$(date +%Y%m%d_%H%M%S)"
        echo -e "${GREEN}✓ Резервная копия создана${NC}"
    else
        echo "Отменено."
        exit 0
    fi
fi

# Создать pre-commit хук
cat > "${PRE_COMMIT_HOOK}" << 'EOF'
#!/bin/bash

# Pre-commit hook для предотвращения утечки секретов в Git

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка на .env файлы
echo "🔍 Проверка на .env файлы..."
if git diff --cached --name-only | grep -E '\.env$|\.env\.local$|\.env\..*\.local$'; then
    echo -e "${RED}❌ ОШИБКА: Попытка закоммитить .env файл!${NC}"
    echo -e "${RED}   .env файлы содержат чувствительные данные и не должны быть в Git${NC}"
    echo ""
    echo "Добавьте файл в .gitignore:"
    echo "  echo '.env' >> .gitignore"
    echo "  git add .gitignore"
    exit 1
fi

# Проверка на приватные ключи
echo "🔍 Проверка на приватные ключи..."
if git diff --cached --name-only | grep -E '\.pem$|\.key$|\.p12$|\.pfx$|id_rsa$|id_ed25519$'; then
    echo -e "${RED}❌ ОШИБКА: Попытка закоммитить приватный ключ!${NC}"
    echo -e "${RED}   Приватные ключи никогда не должны быть в Git${NC}"
    exit 1
fi

# Проверка содержимого на подозрительные паттерны
echo "🔍 Проверка содержимого на чувствительные данные..."

# Паттерны для поиска
declare -a SENSITIVE_PATTERNS=(
    "password\s*=\s*['\"][^'\"]{3,}['\"]"
    "PASSWORD\s*=\s*['\"][^'\"]{3,}['\"]"
    "api[_-]?key\s*=\s*['\"][^'\"]{10,}['\"]"
    "API[_-]?KEY\s*=\s*['\"][^'\"]{10,}['\"]"
    "secret\s*=\s*['\"][^'\"]{10,}['\"]"
    "SECRET\s*=\s*['\"][^'\"]{10,}['\"]"
    "token\s*=\s*['\"][^'\"]{10,}['\"]"
    "TOKEN\s*=\s*['\"][^'\"]{10,}['\"]"
    "private[_-]?key\s*=\s*['\"][^'\"]{10,}['\"]"
    "PRIVATE[_-]?KEY\s*=\s*['\"][^'\"]{10,}['\"]"
    "sk_live_[0-9a-zA-Z]{24,}"
    "sk_test_[0-9a-zA-Z]{24,}"
    "AKIA[0-9A-Z]{16}"
    "ghp_[0-9a-zA-Z]{36}"
    "postgres://[^:]+:[^@]+@"
    "mongodb://[^:]+:[^@]+@"
    "mysql://[^:]+:[^@]+@"
)

FOUND_ISSUES=0
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if git diff --cached | grep -iE "$pattern" > /dev/null; then
        if [ $FOUND_ISSUES -eq 0 ]; then
            echo -e "${YELLOW}⚠️  ПРЕДУПРЕЖДЕНИЕ: Обнаружены подозрительные строки в коммите!${NC}"
            echo ""
        fi
        FOUND_ISSUES=1
    fi
done

if [ $FOUND_ISSUES -eq 1 ]; then
    echo -e "${YELLOW}Найдены паттерны, похожие на пароли, API ключи или другие секреты.${NC}"
    echo ""
    echo "Проверьте ваш коммит на наличие чувствительных данных!"
    echo ""
    echo "Чтобы увидеть изменения:"
    echo "  git diff --cached"
    echo ""
    read -p "Вы уверены, что хотите продолжить? (yes/no): " choice
    if [ "$choice" != "yes" ]; then
        echo -e "${RED}Коммит отменён.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Проверка завершена успешно${NC}"
exit 0
EOF

# Сделать хук исполняемым
chmod +x "${PRE_COMMIT_HOOK}"

echo ""
echo -e "${GREEN}✓ Pre-commit хук успешно установлен!${NC}"
echo -e "${GREEN}  Путь: ${PRE_COMMIT_HOOK}${NC}"
echo ""
echo -e "${YELLOW}Хук будет автоматически проверять каждый коммит на:${NC}"
echo "  • Наличие .env файлов"
echo "  • Наличие приватных ключей (.pem, .key, id_rsa и т.д.)"
echo "  • Подозрительные паттерны в содержимом (пароли, API ключи, токены)"
echo ""
echo -e "${YELLOW}Дополнительная защита: git-secrets${NC}"
echo "Для более надёжной защиты установите git-secrets:"
echo "  brew install git-secrets"
echo "  git secrets --install"
echo "  git secrets --register-aws"
echo ""
echo -e "${GREEN}Готово! Теперь Git будет предупреждать вас об утечках секретов.${NC}"
