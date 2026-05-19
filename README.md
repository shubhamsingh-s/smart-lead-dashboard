# Smart Leads Dashboard

An enterprise-grade, production-ready CRM Lead Management Dashboard built on the MERN stack (MongoDB, Express, React, Node.js). The project implements strict TypeScript configurations, robust JWT authentication, role-based access control, and a fully-responsive SaaS-style user interface built with Tailwind CSS.

---

## 🚀 Key Features

*   **Secure Authentication**: JWT-based user login & registration with Bcrypt hashing.
*   **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin` (full CRUD, including delete) and `Sales` roles (read/write/update, deletion disabled).
*   **Advanced Lead Management**: Complete CRUD operations with optimistic UI updates via Zustand for instant feedback.
*   **Advanced Filters & Search**: Simultaneous backend-driven filtering by status, lead source, text search (debounced), and chronological sorting.
*   **Scalable Pagination**: Backend-driven pagination handling large datasets seamlessly.
*   **CSV Export**: One-click local export of currently filtered leads.
*   **Modern Visual Identity**: Stunning responsive design, sleek glassmorphism panels, system-synced Dark Mode, loading skeleton states, and custom toast notifications.
*   **Docker Containerization**: Instant setup with single-command deployment via Docker Compose.

---

## 🛠️ Tech Stack & Architecture

### Frontend
*   **Framework**: React (Vite template)
*   **Language**: TypeScript (strict mode)
*   **State Management**: Zustand
*   **Styling**: Tailwind CSS
*   **Forms & Validation**: React Hook Form + Zod
*   **HTTP Client**: Axios (configured with request/response interceptors)
*   **Icons**: Lucide React

### Backend
*   **Runtime/Framework**: Node.js & Express
*   **Language**: TypeScript (compiled to CommonJS in production)
*   **Database**: MongoDB & Mongoose
*   **Security**: Helmet, CORS (configured with credential allowance), BCryptJS
*   **Tokenization**: JSON Web Tokens (JWT)

---

## ⚙️ Environment Variables

Copy the `.env.example` templates to `.env` inside their respective directories to configure the system.

### Backend Configurations (`backend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Local port the backend listens on | `5000` |
| `MONGO_URI` | Connection URI for MongoDB Atlas / Local | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key used for signing authentication tokens | `supersecretkey` |
| `JWT_EXPIRES_IN` | Validity duration of the signed JWT | `7d` |
| `CLIENT_URL` | Frontend client origin (crucial for CORS allowance) | `http://localhost:3000` |

### Frontend Configurations (`frontend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base API target URL for frontend HTTP requests | `http://localhost:5000/api` |

---

## 📦 Directory Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # API request route handlers
│   │   ├── middlewares/    # Auth and error middleware
│   │   ├── models/         # Mongoose schemas & TypeScript interfaces
│   │   ├── routes/         # Express router configurations
│   │   ├── utils/          # Token generation and utilities
│   │   └── app.ts          # Express Application bootstrap
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API client setup
│   │   ├── components/     # Reusable layout and modal components
│   │   ├── hooks/          # React hooks (debounce, etc)
│   │   ├── pages/          # Auth and Dashboard page views
│   │   ├── store/          # Zustand global states (Auth, Leads)
│   │   └── index.css       # Design System CSS
│   ├── Dockerfile
│   ├── index.html
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 💻 Installation & Local Setup

Make sure you have [Node.js v20+](https://nodejs.org/) and [Docker](https://www.docker.com/) installed.

### Option A: Using Docker (Recommended for instant setup)
1. Ensure your MongoDB Atlas IP Access List is set up correctly (or have a local MongoDB daemon running).
2. In the root directory, run:
    ```bash
    docker-compose up --build
    ```
3. Open your browser and navigate to:
    - Frontend: `http://localhost:3000`
    - Backend Health Check: `http://localhost:5000/health`

### Option B: Manual Setup (Local Development)

**1. Database & Backend Configuration**
```bash
cd backend
npm install
cp .env.example .env
# Open .env and fill in your MONGO_URI, JWT_SECRET, and CLIENT_URL
npm run dev
```

**2. Frontend Configuration**
```bash
cd ../frontend
npm install
cp .env.example .env
# Open .env and make sure VITE_API_URL is pointing to your backend
npm run dev
```

---

## 📄 API Documentation

All requests and responses should use the `Content-Type: application/json` header. Protected routes require a valid Bearer token passed in the `Authorization` header.

### Authentication Endpoints

#### 1. Register User
*   **Route**: `POST /api/auth/register`
*   **Access**: Public
*   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!",
      "role": "Sales" 
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f5311236168a109ca",
        "email": "user@example.com",
        "role": "Sales",
        "token": "eyJhbGciOiJIUzI1Ni..."
      }
    }
    ```

#### 2. Log In User
*   **Route**: `POST /api/auth/login`
*   **Access**: Public
*   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "Password123!"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f5311236168a109ca",
        "email": "user@example.com",
        "role": "Sales",
        "token": "eyJhbGciOiJIUzI1Ni..."
      }
    }
    ```

#### 3. Get Current User Profile
*   **Route**: `GET /api/auth/profile`
*   **Access**: Private (Bearer Token Required)
*   **Headers**: `Authorization: Bearer <your_jwt_token>`
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d0fe4f5311236168a109ca",
        "email": "user@example.com",
        "role": "Sales"
      }
    }
    ```

---

### Lead Management Endpoints

#### 1. Fetch Filtered Leads List (with Pagination)
*   **Route**: `GET /api/leads`
*   **Access**: Private (Bearer Token Required)
*   **Query Parameters**:
    *   `search` (string, optional) - Filters leads matching name/email.
    *   `status` (string, optional) - `New`, `Contacted`, `Qualified`, `Lost`.
    *   `source` (string, optional) - `Website`, `Instagram`, `Referral`.
    *   `sort` (string, optional) - `Latest` or `Oldest`. Defaults to `Latest`.
    *   `page` (number, optional) - Current pagination page. Defaults to `1`.
    *   `limit` (number, optional) - Maximum records per page. Defaults to `10`.
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "60d1000f5311236168a109cb",
          "name": "Jane Doe",
          "email": "jane@example.com",
          "status": "New",
          "source": "Website",
          "createdAt": "2026-05-19T09:30:00.000Z"
        }
      ],
      "pagination": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1
      }
    }
    ```

#### 2. Create New Lead
*   **Route**: `POST /api/leads`
*   **Access**: Private (Bearer Token Required)
*   **Request Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "status": "New",
      "source": "Website"
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d1000f5311236168a109cb",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "status": "New",
        "source": "Website",
        "createdAt": "2026-05-19T09:30:00.000Z"
      }
    }
    ```

#### 3. Update Existing Lead
*   **Route**: `PUT /api/leads/:id`
*   **Access**: Private (Bearer Token Required)
*   **Request Body**: *(All fields optional for updates)*
    ```json
    {
      "status": "Contacted"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d1000f5311236168a109cb",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "status": "Contacted",
        "source": "Website",
        "createdAt": "2026-05-19T09:30:00.000Z"
      }
    }
    ```

#### 4. Delete Lead
*   **Route**: `DELETE /api/leads/:id`
*   **Access**: Private (Admin Only)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Lead removed successfully"
    }
    ```
