# Digital Book Shelf (MERN)

Monorepo with `server/` (Express, MongoDB) and `client/` (React + Vite + Tailwind).

## Setup

1) Server

```
cd server
cp .env.example .env  # create and fill values
npm i
npm run dev
```

2) Client

```
cd client
cp .env.example .env  # add VITE_GOOGLE_BOOKS_KEY
npm i
npm run dev
```

Open client dev server URL. Update `VITE_API_BASE` if backend runs elsewhere.

## Features (MVP)

- Home with trending and recommendations
- Search via Google Books API
- Book details with preview and buy/add-to-cart actions
- Auth (JWT), Profile, Vlogs/Shorts, Progress tracking (TBD)
- Mock checkout (TBD) with Stripe-ready integration hooks
- AI chatbot stub in UI (backend endpoint TBD)


