# Expense Tracker Pro

A professional full-stack Expense Tracker application built with MERN Stack + TypeScript.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Password Validation

### Expense Management

* Add Expense
* Update Expense
* Delete Expense
* Expense Filtering
* Expense Search
* Pagination
* Sorting

### Budget Management

* Monthly Budget Setup
* Budget Tracking
* Remaining Balance
* Warning Alerts

### Analytics & Reports

* Monthly Reports
* Yearly Reports
* Expense Trends
* Category Summary
* Charts & Analytics

### Export

* Export Expenses to CSV
* Export Expenses to JSON

### Security

* Helmet
* Rate Limiting
* JWT Protection
* Zod Validation
* Error Handling

### Documentation

* Swagger API Docs

---

# Tech Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* React Query
* React Hook Form
* Recharts
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* TypeScript
* JWT
* Zod
* Swagger

---

# Folder Structure

## Frontend

```bash
src/
 ├── api/
 ├── hooks/
 ├── components/
 ├── services/
 ├── pages/
 ├── context/
 └── utils/
```

## Backend

```bash
src/
 ├── config/
 ├── controllers/
 ├── middlewares/
 ├── models/
 ├── routes/
 ├── validators/
 ├── utils/
 ├── types/
 └── server.ts
```

---

# Installation

## Clone Repository

```bash
git clone <repo-url>
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

# Environment Variables

## Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# API Documentation

Swagger Docs:

```bash
http://localhost:5000/api/doc
```

---

# Main API Routes

## Auth

```bash
POST /api/auth/register
POST /api/auth/login
```

## Expenses

```bash
GET /api/expenses
POST /api/expenses
PUT /api/expenses/:id
DELETE /api/expenses/:id
```

## Budget

```bash
GET /api/budget
POST /api/budget
```

## Reports

```bash
GET /api/reports/monthly
GET /api/reports/yearly
GET /api/reports/trend
```

---

# Future Improvements

* Refresh Tokens
* Dark Mode
* Docker Support
* Unit Testing
* CI/CD Pipeline
* Email Verification
* Mobile Responsive Improvements

---

# Author

Developed by Love Ku

