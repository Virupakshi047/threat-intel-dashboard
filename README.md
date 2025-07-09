# Threat Intel Dashboard

A full-stack web application for visualizing and analyzing cyber threat intelligence data.

## Project Structure

- `frontend/` – React, Vite, TypeScript, Tailwind CSS, shadcn-ui
  - `src/components/` – UI, dashboard, layout, and threat-related components
  - `src/pages/` – Main app pages (Dashboard, Analysis, Threats, etc.)
  - `src/hooks/`, `src/lib/`, `src/types/` – Custom hooks, utilities, and type definitions
- `backend/` – Node.js, TypeScript, Express, Prisma ORM
  - `src/controllers/` – API controllers
  - `src/routes/` – Express route definitions
  - `src/services/` – Business logic and data ingestion
  - `prisma/` – Prisma schema, migrations, and client
  - `data/` – Source data (e.g., `cyber_threat_data.csv`)
  - `ml/` – (Reserved for machine learning scripts/models)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone <YOUR_GIT_URL>
cd threat-intel-dashboard
```

### 2. Install Dependencies

#### Backend
```sh
cd backend
npm install
```

#### Frontend
```sh
cd ../frontend
npm install
```

---

## Ingest Data into database

Before running the backend, you can ingest the threat data into your database:

```sh
cd backend
npm run ingest
```
- This command reads from `data/cyber_threat_data.csv` and populates your database using Prisma.

---

## Running the Application (Development)

### 1. Start the Backend

```sh
cd backend
npm run backend
```
- The backend server will start (default: http://localhost:3000 or as configured).
- The backend uses data from `backend/data/cyber_threat_data.csv` and connects to a database via Prisma (see Environment Variables below).

### 2. Start the Frontend

Open a new terminal window/tab:

```sh
cd frontend
npm run frontend
```
- The frontend will start (default: http://localhost:5173 or as configured by Vite).

---

## Environment Variables (Backend)

- If your backend requires environment variables (e.g., database connection), create a `.env` file in `backend/`.
- Example:
  ```env
  DATABASE_URL=your_database_url_here
  PORT=3000
  ```
- Check `backend/prisma/schema.prisma` for database details.
- To set up the database, run:
  ```sh
  cd backend
  npx prisma migrate dev
  ```

---

## Build for Production

### Backend
```sh
cd backend
npm run build
```

### Frontend
```sh
cd frontend
npm run build
```
- Production build will be in `frontend/dist/`.

---

## Technologies Used
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- **Backend:** Node.js, Express, TypeScript, Prisma ORM

---

## Troubleshooting
- Ensure Node.js and npm are installed and up to date.
- If ports are in use, change them in the respective config files or `.env`.
- For database issues, check your `.env` and Prisma setup in `backend/prisma/`.
- If you modify the Prisma schema, run `npx prisma generate` in `backend/`.

---

## Additional Resources
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
