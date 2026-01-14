# Task Management System

## Overview

TaskFlow Pro is a fullstack web-based Task Management System that allows users to securely register, log in, and manage their personal tasks. The application supports creating, updating, categorizing, prioritizing, and tracking tasks through an intuitive and responsive user interface. Tasks are persisted using a backend API with database storage and are isolated per user using JWT-based authentication.

The project demonstrates fullstack development skills, including frontend–backend integration, authentication, RESTful API design, and data persistence.

---

## Live Demo

- **Frontend:** <YOUR_FRONTEND_DEPLOYMENT_LINK>
- **Backend API:** <YOUR_BACKEND_DEPLOYMENT_LINK>

> Note: The backend is deployed on a free hosting tier and may take a few seconds to respond on the first request due to cold start.

---

## Tech Stack

### Frontend
- React.js
- HTML5, CSS3, JavaScript (ES6+)
- Custom CSS for styling
- Lucide Icons

### Backend
- Node.js
- Express.js
- JWT-based authentication

### Database
- MongoDB
- Mongoose ODM

### Deployment
- Frontend: Vercel / Netlify
- Backend: Render
- Database: MongoDB Atlas

---

## Features Implemented

### Authentication
- User registration and login
- JWT-based authentication
- Protected backend routes
- User-specific task isolation

### Task Management
- Create, read, update, and delete tasks
- Task categories
- Priority levels (High, Medium, Low)
- Task status (Pending, In Progress, Completed)
- Due date support

### Dashboard
- Task statistics overview
- Filter tasks by status, priority, and category
- Responsive and user-friendly layout

### UI/UX
- Responsive design for desktop and mobile
- Form validation and error handling
- Instant UI updates for task actions

---

## Backend API Endpoints

### Authentication
POST /api/auth/register Register a new user
POST /api/auth/login Login user
GET /api/auth/profile Get authenticated user profile (protected)


### Tasks
GET /api/tasks Get all tasks for authenticated user
POST /api/tasks Create a new task
GET /api/tasks/:id Get a specific task
PUT /api/tasks/:id Update a task
DELETE /api/tasks/:id Delete a task


---

## Database Schema (Task)

```json
{
  "id": "unique_id",
  "title": "string",
  "description": "string",
  "category": "string",
  "priority": "High | Medium | Low",
  "status": "Pending | In Progress | Completed",
  "dueDate": "ISO date",
  "createdAt": "ISO date",
  "updatedAt": "ISO date",
  "userId": "user_id"
}

Setup Instructions
Backend Setup

Clone the repository

git clone <repo-link>
cd backend


Install dependencies

npm install


Create a .env file

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Start the server

node index.js

Frontend Setup

Navigate to frontend directory

cd frontend


Install dependencies

npm install


Configure API base URL in frontend

const API_BASE_URL = "http://localhost:5000/api";


Start development server

npm start

Challenges and Solutions
Challenge 1: Data Persistence Issues

Initially, task data was stored in-memory on the backend, which caused data loss on server restarts and inconsistencies across deployments.

Solution:
Migrated task storage to MongoDB using Mongoose and implemented persistent CRUD operations with proper schema validation.

Challenge 2: Authentication and User Isolation

Ensuring that each user could only access their own tasks required secure authentication and proper request handling.

Solution:
Implemented JWT-based authentication and protected backend routes using middleware. Tasks are queried using the authenticated user’s ID, ensuring strict user-level data isolation.

Future Enhancements

Advanced search functionality

Task reminders and notifications

Role-based access control

Pagination for large task lists

Video Demo

///LINK HERE///

User authentication

Task creation and updates

Data persistence on refresh

Dashboard statistics

(Video link to be added)

API Documentation

Swagger documentation is provided for testing and exploring API endpoints.

///(Swagger link to be added)///

Submission Notes

JWT-based authentication and protected routes are implemented as bonus features

Backend uses persistent database storage

Application is responsive and user-friendly
