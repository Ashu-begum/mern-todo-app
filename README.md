# MERN To-Do List Application

A beginner-friendly MERN stack to-do app built with React, Axios, Node.js, Express, MongoDB Atlas, and Mongoose.

## Folder Structure

```text
mern-todo-app/
|-- backend/
|   |-- models/
|   |   `-- Task.js
|   |-- routes/
|   |   `-- taskRoutes.js
|   |-- .env
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- public/
|   |   `-- index.html
|   |-- src/
|   |   |-- components/
|   |   |-- App.css
|   |   |-- App.js
|   |   `-- index.js
`-- README.md
```

## Features

- Add new tasks from a React form
- Mark tasks as completed or pending
- Delete tasks
- Fetch and display all tasks from the Express API
- Save tasks in a MongoDB Atlas collection
- Empty input alert
- Loading and error states
- Responsive light/dark modern card UI
- Axios API communication
- Beginner-friendly comments and clean async/await code

## Backend Setup

1. Open a terminal in the backend folder:

```bash
cd backend
npm install
```

2. Create `backend/.env` using `backend/.env.example` as a guide:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/mern-todo-app?retryWrites=true&w=majority
PORT=5000
```

3. Start the Express server:

```bash
npm start
```

The backend runs at `http://localhost:5000`.

## Backend API

```text
POST http://localhost:5000/add
Body: { "text": "Learn MERN" }
```

```text
GET http://localhost:5000/tasks
```

```text
PATCH http://localhost:5000/tasks/:id
Body: { "completed": true }
```

```text
DELETE http://localhost:5000/tasks/:id
```

## Frontend Setup

Open a second terminal in the frontend folder:

```bash
cd frontend
npm install
npm start
```

The React app runs at `http://localhost:3000`.

## MongoDB Atlas Notes

Create a MongoDB Atlas cluster, add a database user, allow your IP address in Network Access, and place the connection string in `backend/.env` as `MONGO_URI`.

## Run The Project

Start both apps in separate terminals:

```bash
cd backend
npm start
```

```bash
cd frontend
npm start
```
