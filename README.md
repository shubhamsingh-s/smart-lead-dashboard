# Smart Leads Dashboard

A scalable Lead Management Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) featuring strict TypeScript, secure JWT authentication, and a modern responsive SaaS-style UI.

## Features
- **Authentication**: JWT-based secure login/register with Role-Based Access Control (Admin vs Sales).
- **Lead Management**: Full CRUD operations with optimistic UI updates.
- **Advanced Filtering**: Combine status, source, sorting, and debounced text search simultaneously.
- **Pagination**: Backend-driven pagination for handling large datasets efficiently.
- **CSV Export**: Export filtered leads data seamlessly to CSV.
- **Modern UI**: Built with Tailwind CSS offering responsive layouts, dark mode, loading skeletons, and interactive toast notifications.
- **Docker Ready**: One-click local deployment using Docker Compose.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Zustand, React Hook Form, Axios.
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs.
- **Deployment**: Docker, Vercel/Netlify (Frontend), Render/Railway (Backend).

## Folder Structure
- `/backend`: Node.js Express server.
- `/frontend`: React frontend application.

## Setup Instructions

### Local Development (Without Docker)

**Backend Setup**
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` inside `backend/` and set your credentials.
4. `npm run dev` (Runs on http://localhost:5000)

**Frontend Setup**
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env` inside `frontend/` (set `VITE_API_URL=http://localhost:5000/api`).
4. `npm run dev` (Runs on http://localhost:3000)

### Running with Docker
1. Ensure Docker Desktop is running.
2. In the root directory, run `docker-compose up --build`
3. The app will be available at http://localhost:3000 and the API at http://localhost:5000.

## Environment Variables
See `.env.example` for details.

## API Documentation
Postman Collection or Swagger docs can be generated based on the backend routes. Core routes include:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/leads`
- `POST /api/leads`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`
