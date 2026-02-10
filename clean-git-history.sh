#!/bin/bash

# Скрипт для очистки истории Git от случайно утекших паролей
# ВНИМАНИЕ: Этот скрипт перезаписывает историю Git!
# Используйте с осторожностью и сделайте резервную копию перед запуском.

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║  ОЧИСТКА ИСТОРИИ GIT ОТ ЧУВСТВИТЕЛЬНЫХ ДАННЫХ             ║${NC}"
echo -e "${RED}║  ВНИМАНИЕ: Этот скрипт изменит историю репозитория!       ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Проверка что мы в Git репозитории
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Ошибка: Не Git репозиторий!${NC}"
    exit 1
fi

# Проверка наличия git-filter-repo
if ! command -v git-filter-repo &> /dev/null; then
    echo -e "${YELLOW}git-filter-repo не установлен. Установка...${NC}"
    echo ""
    echo "Для macOS используйте:"
    echo "  brew install git-filter-repo"
    echo ""
    echo "Для Linux используйте:"
    echo "  pip3 install git-filter-repo"
    echo ""
    read -p "Хотите попробовать установить через pip3? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        pip3 install git-filter-repo
    else
        echo -e "${RED}Установите git-filter-repo и запустите скрипт снова.${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}Текущая ветка:${NC} $(git branch --show-current)"
echo -e "${YELLOW}Последний коммит:${NC} $(git log -1 --oneline)"
echo ""

# Создание резервной копии
echo -e "${GREEN}Шаг 1: Создание резервной копии...${NC}"
CURRENT_DIR=$(pwd)
DIR_NAME=$(basename "$CURRENT_DIR")
BACKUP_DIR="../${DIR_NAME}_backup_$(date +%Y%m%d_%H%M%S)"
read -p "Создать резервную копию в ${BACKUP_DIR}? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Создание резервной копии..."
    cp -r "$CURRENT_DIR" "$BACKUP_DIR"
    echo -e "${GREEN}✓ Резервная копия создана: ${BACKUP_DIR}${NC}"
fi

echo ""
echo -e "${YELLOW}Шаг 2: Выбор метода очистки${NC}"
echo "1) Удалить конкретные файлы из истории"
echo "2) Заменить конкретные строки/пароли во всех файлах"
echo "3) Удалить .env файлы из истории"
echo "4) Комплексная очистка (рекомендуется)"
read -p "Выберите опцию (1-4): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}Введите имена файлов для удаления (через пробел):${NC}"
        echo "Пример: .env secrets.txt passwords.yml"
        read -r files_to_remove
        
        echo ""
        echo -e "${RED}Это удалит следующие файлы из всей истории: ${files_to_remove}${NC}"
        read -p "Продолжить? (yes/no): " confirm
        
        if [ "$confirm" = "yes" ]; then
            for file in $files_to_remove; do
                echo -e "${GREEN}Удаление ${file} из истории...${NC}"
                git filter-repo --path "$file" --invert-paths --force
            done
            echo -e "${GREEN}✓ Файлы удалены из истории${NC}"
        fi
        ;;
        
    2)
        echo ""
        echo -e "${YELLOW}Создайте файл замен (replacements.txt) в формате:${NC}"
        echo "старый_пароль==>REMOVED"
        echo "secret_key_123==>REMOVED"
        echo ""
        read -p "Путь к файлу замен (по умолчанию: ./replacements.txt): " replace_file
        replace_file=${replace_file:-./replacements.txt}
        
        if [ ! -f "$replace_file" ]; then
            echo -e "${RED}Файл не найден. Создайте файл ${replace_file}${NC}"
            exit 1
        fi
        
        echo -e "${RED}Это заменит указанные строки во всей истории${NC}"
        read -p "Продолжить? (yes/no): " confirm
        
        if [ "$confirm" = "yes" ]; then
            git filter-repo --replace-text "$replace_file" --force
            echo -e "${GREEN}✓ Строки заменены в истории${NC}"
        fi
        ;;
        
    3)
        echo ""
        echo -e "${RED}Это удалит все .env файлы из истории${NC}"
        read -p "Продолжить? (yes/no): " confirm
        
        if [ "$confirm" = "yes" ]; then
            git filter-repo --path '.env' --invert-paths --force
            git filter-repo --path '**/.env' --invert-paths --force
            git filter-repo --path 'client/.env' --invert-paths --force
            echo -e "${GREEN}✓ .env файлы удалены из истории${NC}"
        fi
        ;;
        
    4)
        echo ""
        echo -e "${YELLOW}Комплексная очистка удалит из истории:${NC}"
        echo "  - Все .env файлы"
        echo "  - .env.local, .env.*.local"
        echo "  - Файлы с паролями и секретами"
        echo "  - Ключи API"
        echo ""
        read -p "Продолжить? (yes/no): " confirm
        
        if [ "$confirm" = "yes" ]; then
            echo -e "${GREEN}Удаление чувствительных файлов...${NC}"
            
            # Список файлов для удаления
            sensitive_patterns=(
                ".env"
                ".env.local"
                ".env.*.local"
                "*.pem"
                "*.key"
                "*.p12"
                "*.pfx"
                "*password*"
                "*secret*"
                "credentials.json"
                "secrets.yml"
                "secrets.yaml"
            )
            
            for pattern in "${sensitive_patterns[@]}"; do
                echo "  Удаление: $pattern"
                git filter-repo --path-glob "$pattern" --invert-paths --force 2>/dev/null || true
            done
            
            echo -e "${GREEN}✓ Комплексная очистка завершена${NC}"
        fi
        ;;
        
    *)
        echo -e "${RED}Неверный выбор${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Шаг 3: Очистка reflog и сборка мусора${NC}"
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ОЧИСТКА ЗАВЕРШЕНА                                         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}ВАЖНО: Следующие шаги:${NC}"
echo ""
echo "1. Проверьте историю:"
echo "   git log --all --oneline"
echo ""
echo "2. Принудительно отправьте изменения в удаленный репозиторий:"
echo "   git push origin --force --all"
echo "   git push origin --force --tags"
echo ""
echo "3. ${RED}КРИТИЧЕСКИ ВАЖНО:${NC} Все разработчики должны:"
echo "   - Удалить свои локальные копии"
echo "   - Сделать свежий клон: git clone <repository-url>"
echo ""
echo "4. Смените ВСЕ утекшие пароли и ключи API!"
echo ""
echo -e "${YELLOW}5. Рассмотрите возможность использования git-secrets для предотвращения будущих утечек:${NC}"
echo "   brew install git-secrets"
echo "   git secrets --install"
echo "   git secrets --register-aws"
echo ""
echo -e "${RED}Не забудьте сменить все утекшие пароли!${NC}"
