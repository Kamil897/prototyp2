# APS Wild Card — Full Stack

React (Vite + TypeScript) frontend + Node.js (Express + TypeScript) backend.

---

## Структура

```
aps-wildcard/
├── frontend/   # React + Vite + TypeScript → деплой на Vercel
└── backend/    # Express + TypeScript      → деплой на Railway
```

---

## Локальный запуск

### Бэкенд
```bash
cd backend
npm install
cp .env.example .env
npm run dev          # порт 4000
```

### Фронтенд
```bash
cd frontend
npm install
cp .env.example .env  # VITE_API_URL оставить пустым — Vite проксирует на :4000
npm run dev           # порт 5173
```

Открыть: http://localhost:5173

---

## Деплой бэкенда — Railway

1. Зайти на [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Выбрать папку `backend` как Root Directory
3. Railway сам определит TypeScript — Build Command: `npm run build`, Start Command: `npm start`
4. В разделе Variables добавить:
   - `FRONTEND_URL` = (URL вашего Vercel-сайта, добавить после)
5. После деплоя Railway даст URL вида `https://aps-backend-xxxx.railway.app`

---

## Деплой фронтенда — Vercel

1. Зайти на [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Root Directory: `frontend`
3. Framework Preset: Vite
4. Environment Variables:
   - `VITE_API_URL` = `https://aps-backend-xxxx.railway.app/api`
5. Deploy → получить URL `https://aps-wildcard.vercel.app`

6. Вернуться в Railway → Variables → обновить `FRONTEND_URL` на URL Vercel

---

## API эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/health` | Проверка сервера |
| GET | `/api/products` | Все товары |
| GET | `/api/products/:id` | Один товар |
| POST | `/api/orders` | Создать заявку |

### POST /api/orders
```json
{
  "name": "Алишер",
  "phone": "+998 90 000 00 00",
  "product": "Доска обрезная 25×150×6000",
  "volume": "20 м³",
  "comment": "..."
}
```

---

## Следующие шаги (по мере готовности)

- [ ] Подключить PostgreSQL / Prisma для хранения заявок
- [ ] Telegram-бот: уведомления при новой заявке
- [ ] Панель администратора для просмотра заявок
- [ ] SEO мета-теги
