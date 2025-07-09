# Threat Intel Dashboard

A full-stack web application for visualizing and analyzing cyber threat intelligence data, featuring real-time updates, machine learning-based threat analysis, and interactive dashboards.

---

## Features
- **Real-time threat analysis updates** via WebSockets
- **Recent analysis dashboard** with live notifications
- **Threat ingestion** from CSV to PostgreSQL
- **ML-powered threat category prediction** (Python, scikit-learn)
- **Modern UI** with React, Vite, Tailwind CSS, and shadcn-ui
- **Containerized stack** for easy deployment

---

## Technology Stack & Justification
- **Frontend:** React + Vite + TypeScript + Tailwind CSS + shadcn-ui
  - *Why:* Fast development, modern UI, type safety, and great developer experience.
- **Backend:** Node.js + Express + TypeScript + Prisma ORM
  - *Why:* Robust API, type safety, and easy database integration.
- **Database:** PostgreSQL
  - *Why:* Reliable, open-source, and well-supported by Prisma.
- **Machine Learning:** Python (scikit-learn)
  - *Why:* Easy integration for ML models and predictions.
- **Containerization:** Docker & Docker Compose
  - *Why:* Consistent, reproducible, and easy to deploy anywhere.

---

##  Quick Start: Docker Setup (Recommended)

### 1. Clone the Repository
```sh
git clone <YOUR_GIT_URL>
cd threat-intel-dashboard
```

### 2. Build and Start All Services
```sh
docker-compose up --build
```
- This will build and start the backend, frontend, and PostgreSQL database.
- The first build may take a few minutes.

### 3. Access the Application
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Postgres:** localhost:5432 (user: `postgres`, password: `postgres`, db: `threatintel`)

### 4. Run Database Migrations (First Time Only)
In a new terminal:
```sh
docker-compose exec backend npx prisma migrate deploy
```

### 5. Ingest Threat Data
```sh
docker-compose exec backend npm run ingest
```
- This will populate the database from `backend/data/cyber_threat_data.csv`.

### 6. Stopping and Cleaning Up
```sh
docker-compose down -v
```
- Stops all containers and removes volumes (including database data).

---



## Non-Docker Setup

### 1. Install Dependencies
#### Backend
```sh
cd backend
npm install
```
#### Frontend
```sh
cd frontend
npm install
```

### 2. Set Up Environment Variables
- Create `backend/.env` with your database connection string.
- inside .env add `DATABASE_URL=postgresql://<username>:<password>@db:5432/<dbname>`

### 3. Run Database Migrations
```sh
cd backend
npx prisma migrate dev
```

### 4. Ingest Data
```sh
npm run ingest
```

### 5. Start Servers
#### Backend
```sh
npm run backend
```
#### Frontend
```sh
cd ../frontend
npm run frontend
```

---

## Additional Resources
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---