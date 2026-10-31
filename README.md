# Task Manager Application

A full-stack Task Manager Application developed using React.js, Node.js, Express.js, and MongoDB. It allows users to register, log in, and manage their personal tasks securely.

## Features

- User registration and login
- JWT-based authentication
- Secure password hashing using bcryptjs
- Create new tasks
- View all personal tasks
- Edit and update tasks
- Delete tasks
- Filter tasks by status
- Add task descriptions and due dates
- User-specific task management

## Technologies Used

### Frontend
- React.js
- Vite
- Axios
- React Router DOM
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

## Project Structure

```text
task-manager-app/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── components/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sandhya-Raman/task-manager-app.git
cd task-manager-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

### 3. Frontend Setup

Open another terminal in the project folder and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |

### Task Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks?status=Pending` | Filter tasks by status |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Task management endpoints require JWT authentication.

## Task Status

- Pending
- In Progress
- Completed

## Author

Sandhya R

## License

This project was developed as part of an internship assignment.