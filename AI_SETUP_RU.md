# 🤖 Настройка AI Assistant - Пошаговая Инструкция

## 1️⃣ Получение API ключа

1. Перейдите на сайт Anthropic: https://console.anthropic.com/
2. Зарегистрируйтесь или войдите в аккаунт
3. Перейдите в раздел "API Keys"
4. Нажмите "Create Key"
5. Скопируйте ключ (он начинается с `sk-ant-api03-...`)

⚠️ **Важно**: Сохраните ключ в безопасном месте, он показывается только один раз!

## 2️⃣ Добавление API ключа в проект

1. Откройте файл `.env` в корневой папке проекта `/Users/denisnikolaev/Desktop/PM-tools/.env`

2. Найдите секцию `🤖 AI ASSISTANT НАСТРОЙКА`

3. В строке:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
   ```
   Замените только `YOUR_KEY_HERE` на ваш реальный ключ

4. Сохраните файл (Ctrl+S или Cmd+S)

5. **Перезапустите сервер** (обязательно!)

**Пример правильной настройки `.env`:**
```env
# Database Configuration
DATABASE_URL="postgresql://pmtools:***REMOVED***@localhost:5433/pmtools?schema=public"

# Server Configuration
NODE_ENV="development"
PORT=3000
HOST="127.0.0.1"

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-abc123xyz789...  # <-- Ваш ключ здесь
ANTHROPIC_MODEL=claude-sonnet-4-20250514
ANTHROPIC_MAX_TOKENS=2000

# Feature Flags
AI_FEATURE_ENABLED=true  # <-- Убедитесь что true
```

## 3️⃣ Тестирование подключения

После добавления ключа, проверьте работу AI:

```bash
cd server
npx tsx scripts/testAI.ts
```

Если все настроено правильно, вы увидите:
```
🤖 Testing Claude API connection...

✅ Success! Claude responded:
AI is working!

🎉 AI integration is working correctly!
```

## 4️⃣ Где найти настройку включения/выключения AI бота

### В интерфейсе приложения:

1. **Запустите приложение**:
   ```bash
   # В одном терминале (backend):
   npm run dev
   
   # В другом терминале (frontend):
   cd client && npm run dev
   ```

2. **Откройте браузер** и перейдите на http://localhost:5173

3. **Найдите кнопку Settings**:
   - В правом верхнем углу хедера (шапки) сайта
   - Иконка шестеренки ⚙️ 
   - Рядом с кнопками "Prompts" и "Risk Management"

4. **Откройте настройки**:
   - Нажмите на иконку шестеренки
   - Откроется диалог "Settings"

5. **Переключатель AI Assistant**:
   - В диалоге увидите переключатель (switch)
   - Название: "AI Assistant"
   - Описание: "Enable AI-powered risk analysis and suggestions"
   - **Включите переключатель** (он должен стать синим)

### Визуально это выглядит так:

```
┌─────────────────────────────────────────────┐
│  Settings                                 × │
├─────────────────────────────────────────────┤
│  Configure your PM-Tools preferences        │
│                                             │
│  AI Assistant                      [ON] ●─  │
│  Enable AI-powered risk analysis            │
│  and suggestions                            │
│                                             │
│  💡 AI features are enabled                 │
└─────────────────────────────────────────────┘
```

## 5️⃣ Использование AI бота

После включения AI Assistant:

1. Перейдите на страницу **"Risk Management"**
2. В правом нижнем углу появится **круглая кнопка с иконкой чата** 💬
3. Нажмите на нее - откроется AI чат
4. Выберите действие:
   - ✨ **Generate Risks** - создать риски для проекта
   - 🔍 **Analyze Risks** - проанализировать существующие риски
   - 💡 **Suggest Mitigation** - предложить план снижения рисков
   - 💬 **Free Chat** - свободный чат с AI

## 🔧 Если AI бот не появляется

Проверьте:

1. ✅ API ключ добавлен в `.env` файл
2. ✅ Сервер перезапущен после добавления ключа
3. ✅ В Settings включен переключатель "AI Assistant"
4. ✅ Вы находитесь на странице "Risk Management"
5. ✅ В файле `.env` установлено `AI_FEATURE_ENABLED=true`

## 📋 Быстрая проверка

**Файл**: `/Users/denisnikolaev/Desktop/PM-tools/.env`
```env
ANTHROPIC_API_KEY=sk-ant-api03-...  # Ваш ключ
AI_FEATURE_ENABLED=true              # Должно быть true
```

**Интерфейс**: 
- Кнопка Settings (⚙️) в хедере → Переключатель "AI Assistant" → Включен (ON)

**Страница**: Risk Management → Кнопка чата (💬) в правом нижнем углу

## 💰 Стоимость использования

- Claude Sonnet 4: ~$3 за миллион входных токенов, ~$15 за миллион выходных
- Средний запрос: $0.01-0.02
- Для тестирования достаточно $5-10

## 🆘 Поддержка

Если что-то не работает:
1. Проверьте консоль браузера (F12) на ошибки
2. Проверьте логи сервера в терминале
3. Запустите тест: `cd server && npx tsx scripts/testAI.ts`
