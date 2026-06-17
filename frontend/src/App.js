import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", code: "" });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const getAuthConfig = (savedToken = token) => ({
    headers: {
      Authorization: `Bearer ${savedToken}`,
    },
  });

  useEffect(() => {
    if (token) {
      loadProfile(token);
      fetchTasks();
    }
  }, [token]);

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (authMode === "forgot") {
      try {
        setLoading(true);
        const res = await axios.post(`${API_URL}/forgot-password`, {
          email: authForm.email,
        });

        setMessage(res.data.message);
        setAuthMode("reset");
        setAuthForm({ name: "", email: authForm.email, password: "", code: "" });
      } catch (err) {
        setMessage(err.response?.data?.message || "Could not create reset code");
      } finally {
        setLoading(false);
      }

      return;
    }

    if (authMode === "reset") {
      try {
        setLoading(true);
        const res = await axios.post(`${API_URL}/reset-password`, {
          email: authForm.email,
          code: authForm.code,
          password: authForm.password,
        });

        setMessage(res.data.message);
        setAuthMode("login");
        setAuthForm({ name: "", email: authForm.email, password: "", code: "" });
      } catch (err) {
        setMessage(err.response?.data?.message || "Could not reset password");
      } finally {
        setLoading(false);
      }

      return;
    }

    const endpoint = authMode === "register" ? "/register" : "/login";
    const payload =
      authMode === "register"
        ? authForm
        : { email: authForm.email, password: authForm.password };

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}${endpoint}`, payload);

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setAuthForm({ name: "", email: "", password: "", code: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (savedToken) => {
    try {
      const res = await axios.get(`${API_URL}/profile`, getAuthConfig(savedToken));
      setUser(res.data.user);
    } catch (err) {
      logout();
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`, getAuthConfig());
      setTasks(res.data);
    } catch (err) {
      setMessage("Could not load tasks. Make sure backend and MongoDB are running.");
    }
  };

  const addTask = async () => {
    if (!text.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/add`, { text }, getAuthConfig());
      setTasks([res.data, ...tasks]);
      setText("");
    } catch (err) {
      setMessage("Could not add task.");
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await axios.put(
        `${API_URL}/update/${task._id}`,
        {
          text: task.text,
          completed: !task.completed,
        },
        getAuthConfig()
      );

      setTasks(tasks.map((item) => (item._id === task._id ? res.data : item)));
    } catch (err) {
      setMessage("Could not update task.");
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditingText(task.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveTask = async (task) => {
    if (!editingText.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    try {
      const res = await axios.put(
        `${API_URL}/update/${task._id}`,
        {
          text: editingText,
          completed: task.completed,
        },
        getAuthConfig()
      );

      setTasks(tasks.map((item) => (item._id === task._id ? res.data : item)));
      cancelEditing();
    } catch (err) {
      setMessage("Could not edit task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`, getAuthConfig());
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setMessage("Could not delete task.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setTasks([]);
    setMessage("");
  };

  if (!token) {
    return (
      <main className="page">
        <section className="auth-card">
          <p className="date-label">MERN Authentication</p>
          <h1>
            {authMode === "register"
              ? "Create account"
              : authMode === "forgot"
              ? "Forgot password"
              : authMode === "reset"
              ? "Enter reset code"
              : "Welcome back"}
          </h1>
          <p className="helper-text">
            {authMode === "register"
              ? "Register to get a JWT token and access the dashboard."
              : authMode === "forgot"
              ? "Enter your email to generate a reset code."
              : authMode === "reset"
              ? "Use the code from your email and choose a new password."
              : "Login to access your protected dashboard."}
          </p>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <input
                name="name"
                value={authForm.name}
                onChange={handleAuthChange}
                placeholder="Name"
              />
            )}
            <input
              name="email"
              type="email"
              value={authForm.email}
              onChange={handleAuthChange}
              placeholder="Email"
            />
            {authMode === "reset" && (
              <input
                name="code"
                value={authForm.code}
                onChange={handleAuthChange}
                placeholder="Reset code"
              />
            )}
            {authMode !== "forgot" && (
              <input
                name="password"
                type="password"
                value={authForm.password}
                onChange={handleAuthChange}
                placeholder={authMode === "reset" ? "New password" : "Password"}
              />
            )}
            <button type="submit" disabled={loading}>
              {loading
                ? "Please wait"
                : authMode === "register"
                ? "Register"
                : authMode === "forgot"
                ? "Send Reset Code"
                : authMode === "reset"
                ? "Reset Password"
                : "Login"}
            </button>
          </form>

          {message && (
            <p className={message.includes("successfully") ? "message success" : "message error"}>
              {message}
            </p>
          )}

          <button
            className="link-button"
            onClick={() => {
              setMessage("");
              setAuthMode(authMode === "register" ? "login" : "register");
            }}
          >
            {authMode === "register"
              ? "Already have an account? Login"
              : authMode === "forgot" || authMode === "reset"
              ? "Back to login"
              : "New user? Create an account"}
          </button>

          {authMode === "login" && (
            <button
              className="link-button small-link"
              onClick={() => {
                setMessage("");
                setAuthMode("forgot");
              }}
            >
              Forgot password?
            </button>
          )}

        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="todo-app">
        <div className="header">
          <div>
            <p className="date-label">Protected Dashboard</p>
            <h1>Hello, {user?.name || "User"}</h1>
            <p className="helper-text">{user?.email}</p>
          </div>
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="dashboard-grid">
          <div>
            <strong>{tasks.length}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{pendingCount}</strong>
            <span>Pending</span>
          </div>
          <div>
            <strong>{completedCount}</strong>
            <span>Done</span>
          </div>
        </div>

        <div className="add-row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
            placeholder="Enter a new task"
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        {message && <p className="message error">{message}</p>}

        {tasks.length === 0 ? (
          <p className="message">No tasks yet. Add your first one above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className={task.completed ? "task completed" : "task"}>
                {editingId === task._id ? (
                  <div className="edit-row">
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveTask(task);
                        if (e.key === "Escape") cancelEditing();
                      }}
                    />
                    <button onClick={() => saveTask(task)}>Save</button>
                    <button className="secondary-button" onClick={cancelEditing}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task)}
                      />
                      <span className="task-text">{task.text}</span>
                    </label>
                    <button className="edit-button" onClick={() => startEditing(task)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => deleteTask(task._id)}>
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
