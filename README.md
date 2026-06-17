# MERN To-Do List App With JWT Authentication

A beginner-friendly MERN stack app using React, Axios, Node.js, Express, MongoDB Atlas, Mongoose, bcryptjs, and JSON Web Tokens.

## Features

- Register a new user account
- Hash passwords with bcryptjs
- Login and receive a JWT token
- Reset forgotten password using an email-based reset code flow
- Store token in localStorage
- Access a protected `/profile` dashboard route
- Access protected task CRUD routes with a valid token
- Keep each user's tasks private
- Logout and clear token
- Add, view, edit, complete, and delete tasks
- Responsive modern UI

## Folder Structure

```text
mern-todo-app/
|-- backend/
|   |-- middleware/
|   |   `-- authMiddleware.js
|   |-- models/
|   |   |-- Task.js
|   |   `-- User.js
|   |-- routes/
|   |   |-- authRoutes.js
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

## Backend Setup

```bash
cd backend
npm install
npm start
```

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/mern-todo-app?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=replace_this_with_a_long_random_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`.
Backend runs at `http://localhost:5000`.

## Authentication API

```text
POST /register
Body: { "name": "Ashu", "email": "ashu@example.com", "password": "password123" }
```

```text
POST /login
Body: { "email": "ashu@example.com", "password": "password123" }
```

```text
POST /forgot-password
Body: { "email": "ashu@example.com" }
```

The reset code is sent to the user's email. For Gmail, use a Gmail App Password, not your normal Gmail password.

```text
POST /reset-password
Body: { "email": "ashu@example.com", "code": "123456", "password": "newpassword123" }
```

```text
GET /profile
Header: Authorization: Bearer <token>
```

## Task API

```text
POST /add
Header: Authorization: Bearer <token>
Body: { "text": "Learn MERN" }
```

```text
GET /tasks
Header: Authorization: Bearer <token>
```

```text
PUT /update/:id
Header: Authorization: Bearer <token>
Body: { "text": "Updated task", "completed": true }
```

```text
DELETE /delete/:id
Header: Authorization: Bearer <token>
```

## MongoDB Atlas Notes

If the backend cannot connect to MongoDB Atlas, open Atlas and go to **Security -> Network Access**, then add your current IP address.
