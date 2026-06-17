```md
# MERN To-Do App with JWT Authentication

A full-stack MERN application that combines a protected To-Do task manager with user authentication. Users can register, log in, access a protected dashboard, manage their own tasks, reset forgotten passwords through an email reset code, and log out securely.

## Features

### Authentication
- User registration with name, email, and password
- Password hashing using bcryptjs
- User login with JWT token generation
- JWT stored in browser localStorage
- Protected profile/dashboard route
- Logout functionality
- Forgot password flow using email reset code
- Reset code expires after 10 minutes

### Task Management
- Add tasks
- View logged-in user’s tasks
- Edit task text
- Mark tasks as completed/pending
- Delete tasks
- Tasks are protected and linked to the logged-in user

## Tech Stack

### Frontend
- React.js
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- JSON Web Token
- Nodemailer
- dotenv
- CORS

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
|   |-- utils/
|   |   `-- sendEmail.js
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- public/
|   |   `-- index.html
|   |-- src/
|   |   |-- App.css
|   |   |-- App.js
|   |   `-- index.js
|   |-- package.json
`-- README.md
```

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_long_jwt_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com
```

Note: `EMAIL_PASS` must be a Gmail App Password, not your normal Gmail password.

## Backend Setup

```bash
cd backend
npm install
npm start
```

The backend runs on:

```text
http://localhost:5000
```

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The frontend runs on:

```text
http://localhost:3000
```

## API Routes

### Authentication Routes

Register a new user:

```text
POST /register
```

Request body:

```json
{
  "name": "Ashu Begum",
  "email": "ashu@example.com",
  "password": "password123"
}
```

Login user:

```text
POST /login
```

Request body:

```json
{
  "email": "ashu@example.com",
  "password": "password123"
}
```

Get protected profile:

```text
GET /profile
```

Headers:

```text
Authorization: Bearer <token>
```

Request password reset code:

```text
POST /forgot-password
```

Request body:

```json
{
  "email": "ashu@example.com"
}
```

Reset password:

```text
POST /reset-password
```

Request body:

```json
{
  "email": "ashu@example.com",
  "code": "123456",
  "password": "newpassword123"
}
```

### Task Routes

Add task:

```text
POST /add
```

Headers:

```text
Authorization: Bearer <token>
```

Request body:

```json
{
  "text": "Complete task"
}
```

Fetch user tasks:

```text
GET /tasks
```

Headers:

```text
Authorization: Bearer <token>
```

Update task:

```text
PUT /update/:id
```

Headers:

```text
Authorization: Bearer <token>
```

Request body:

```json
{
  "text": "Updated task text",
  "completed": true
}
```

Delete task:

```text
DELETE /delete/:id
```

Headers:

```text
Authorization: Bearer <token>
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Add your current IP address in Network Access.
5. Copy the MongoDB connection string.
6. Paste it in `backend/.env` as `MONGO_URI`.

If the backend cannot connect to MongoDB, check:
- MongoDB URI is correct
- Database username and password are correct
- Current IP address is added in Atlas Network Access

## Gmail App Password Setup

To send password reset emails:

1. Open your Google Account.
2. Go to Security.
3. Enable 2-Step Verification.
4. Create an App Password for Mail.
5. Copy the 16-character app password.
6. Paste it into `EMAIL_PASS` in `backend/.env`.

Use the app password without spaces.

## How It Works

1. User registers with name, email, and password.
2. Backend hashes the password and stores the user in MongoDB.
3. User logs in with email and password.
4. Backend verifies credentials and returns a JWT token.
5. Frontend stores the token in localStorage.
6. Protected routes use the token in the Authorization header.
7. User can access their dashboard and manage only their own tasks.
8. User can reset password using an email reset code.

## Run Commands

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
cd frontend
npm start
```

## Build Frontend

```bash
cd frontend
npm run build
```

## Security Notes

- Passwords are hashed before storing in MongoDB.
- JWT is required for protected routes.
- Each task is linked to the logged-in user.
- Users cannot access another user’s tasks.
- Password reset codes are hashed and expire after 10 minutes.
- Sensitive values are stored in `.env` and should not be pushed to GitHub.

## Author

Ashu Begum
```