# NovaTech E-commerce Frontend

React + TypeScript + Vite frontend for an Express API.

## Setup

1. Install Node.js if needed.
2. Open this folder in VS Code.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Set `VITE_API_URL` to the deployed Render **backend web-service URL**, not the PostgreSQL connection string. The frontend adds the backend's `/api` prefix automatically, whether or not it is already included in the URL.
6. Run `npm run dev`.

## Expected backend endpoints

This project assumes:
- `POST /auth/register` -> `{ token, user }`
- `POST /auth/login` -> `{ token, user }`
- `GET /auth/profile` -> `{ user }`
- `GET /auth/users` -> `{ users: [...] }` (admin only)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /products` -> `{ products: [...] }`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Important integration notes

- Product fields expected: `name`, `description`, `price`, `category`; optional `image` / `imageUrl` for display.
- The admin role is checked in the UI, but the backend must also enforce `authenticate` + `authorize("admin")` on create/update/delete routes.
- Public registration must not accept a role from the request body. Your backend already comments that role is not accepted.
- Create an admin account securely by changing the role of a trusted account directly in the database. Never add a public "register as admin" option.
- This UI cart is temporary and does not create orders or process payments.
- The frontend expects the backend profile endpoint to return the role on `req.user`.
- Brevo remains a backend service; its API key must never be placed in the frontend `.env`.
- The backend allows the deployed Vercel and Render origins and `http://localhost:5173` by default. For a different frontend domain, set `FRONTEND_URL` on the backend service to its exact origin (or a comma-separated list of origins), without a path.
- This frontend does not use the PostgreSQL connection string directly. Only the backend connects to the database.
