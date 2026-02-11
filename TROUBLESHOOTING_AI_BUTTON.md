# Troubleshooting: AI Button Not Showing

## Проблема
На продакшене настройка `AI_FEATURE_ENABLED=true`, но кнопка AI не появляется.

## Возможные причины и решения

### 1. ✅ Проверка серверной настройки

**На сервере выполните:**
```bash
# Проверьте, что переменная установлена
cat .env | grep AI_FEATURE_ENABLED
# Должно быть: AI_FEATURE_ENABLED=true
```

**Проверьте через API:**
```bash
# На сервере или с вашего компьютера
curl http://your-domain.com/api/ai-status
# Должно вернуть: {"enabled":true}
```

---

### 2. 🔄 PM2 не подхватил новые переменные

PM2 кэширует переменные окружения! Простой `pm2 restart` НЕ перезагружает `.env`.

**Решение:**
```bash
# Остановите PM2 полностью
pm2 stop pm-tools

# Удалите процесс
pm2 delete pm-tools

# Запустите заново (это перечитает .env)
pm2 start ecosystem.config.cjs

# Сохраните конфигурацию
pm2 save
```

---

### 3. 📦 Приложение не пересобрано

Новый код в `SettingsContext.tsx` и других файлах не попадет в прод без сборки!

**Решение:**
```bash
# Сборка клиента (React)
npm run build:client

# Сборка сервера (Node/Express) 
npm run build

# Перезапуск PM2
pm2 restart pm-tools
```

---

### 4. 🌐 Браузер использует старый кэш

После деплоя браузер может показывать старую версию фронтенда.

**Решение:**
```
1. Откройте DevTools (F12)
2. Зайдите на вкладку Network
3. Поставьте галочку "Disable cache"
4. Перезагрузите страницу (Ctrl+F5 / Cmd+Shift+R)
```

Или:
```
1. Очистите кэш браузера полностью
2. Или откройте в режиме инкогнито
```

---

### 5. 💾 localStorage содержит старое значение

Даже если сервер говорит `enabled: true`, пользовательская настройка может быть отключена.

**Проверка в браузере:**
```javascript
// Откройте Console в DevTools
localStorage.getItem('settings:aiEnabled')
// Должно быть: "true"
```

**Исправление:**
```javascript
// В Console выполните:
localStorage.setItem('settings:aiEnabled', 'true')
// Перезагрузите страницу
location.reload()
```

---

## 🔍 Полная диагностика (пошагово)

### Шаг 1: Проверка сервера
```bash
ssh pmtools@178.88.115.40
cd /path/to/pm-tools

# Проверьте .env
cat .env | grep AI_FEATURE_ENABLED

# Проверьте API напрямую
curl http://localhost:3000/api/ai-status
```

### Шаг 2: Пересборка и перезапуск
```bash
# Если API возвращает {"enabled":false}, измените .env:
nano .env
# Установите: AI_FEATURE_ENABLED=true

# Полная пересборка:
npm run build:client
npm run build

# Полный перезапуск PM2:
pm2 stop pm-tools
pm2 delete pm-tools
pm2 start ecosystem.config.cjs
pm2 save

# Проверьте статус:
pm2 status
pm2 logs pm-tools --lines 50
```

### Шаг 3: Проверка в браузере
```
1. Откройте сайт
2. F12 → Console
3. Выполните:
   fetch('/api/ai-status').then(r => r.json()).then(console.log)
   
4. Должно вывести: {enabled: true}

5. Проверьте localStorage:
   localStorage.getItem('settings:aiEnabled')
   
6. Если "false", установите:
   localStorage.setItem('settings:aiEnabled', 'true')
   location.reload()
```

---

## ✅ Быстрое решение (всё сразу)

```bash
# На сервере:
cd /path/to/pm-tools

# 1. Проверьте/установите переменную
echo "AI_FEATURE_ENABLED=true" >> .env

# 2. Пересоберите всё
npm run build:client && npm run build

# 3. Полностью перезапустите PM2
pm2 stop pm-tools && pm2 delete pm-tools && pm2 start ecosystem.config.cjs && pm2 save

# 4. Проверьте логи
pm2 logs pm-tools --lines 20
```

**В браузере:**
- Ctrl+Shift+R (очистка кэша + перезагрузка)
- F12 → Console → `localStorage.setItem('settings:aiEnabled', 'true')` → `location.reload()`

---

## 📝 Логика работы

AI кнопка показывается только если **ВСЕ 3 условия** выполнены:

1. ✅ `AI_FEATURE_ENABLED=true` в `.env` (серверная настройка)
2. ✅ `localStorage.settings:aiEnabled = "true"` (пользовательская настройка)
3. ✅ Приложение пересобрано с новым кодом

**Проверка всех условий:**
```javascript
// В Console браузера:
Promise.all([
  fetch('/api/ai-status').then(r => r.json()),
  Promise.resolve(localStorage.getItem('settings:aiEnabled'))
]).then(([server, local]) => {
  console.log('Server AI enabled:', server.enabled);
  console.log('User AI enabled:', local === 'true');
  console.log('Button should show:', server.enabled && local === 'true');
});
```
