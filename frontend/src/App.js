import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [apiOnline, setApiOnline] = useState(false);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      // Axios asks the Express backend for every task stored in MongoDB.
      const res = await axios.get(`${API_URL}/tasks`);
      setTasks(res.data);
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      setError("Could not load tasks. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!text.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    try {
      setAdding(true);
      setError("");

      // Send the new task to Express, then add the saved MongoDB task to the UI.
      const res = await axios.post(`${API_URL}/add`, {
        text,
      });

      setTasks([res.data, ...tasks]);
      setText("");
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      setError("Could not add task. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      setError("");

      const res = await axios.put(`${API_URL}/update/${task._id}`, {
        completed: !task.completed,
      });

      setTasks(
        tasks.map((item) => (item._id === task._id ? res.data : item))
      );
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      setError("Could not update task. Please try again.");
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");
      await axios.delete(`${API_URL}/delete/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      setError("Could not delete task. Please try again.");
    }
  };

  const clearCompleted = async () => {
    const completedTasks = tasks.filter((task) => task.completed);

    try {
      setError("");
      await Promise.all(
        completedTasks.map((task) =>
          axios.delete(`${API_URL}/delete/${task._id}`)
        )
      );
      setTasks(tasks.filter((task) => !task.completed));
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      setError("Could not clear completed tasks. Please try again.");
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

  const updateTaskText = async (task) => {
    if (!editingText.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    try {
      setError("");

      const res = await axios.put(`${API_URL}/update/${task._id}`, {
        text: editingText,
        completed: task.completed,
      });

      setTasks(
        tasks.map((item) => (item._id === task._id ? res.data : item))
      );
      cancelEditing();
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      setError("Could not edit task. Please try again.");
    }
  };

  return (
    <main className="page">
      <section className="todo-app">
        <div className="header">
          <div>
            <p className="date-label">Today's list</p>
            <h1>To-Do List</h1>
          </div>
          <div className="counter">
            <strong>{pendingCount}</strong>
            <span>left</span>
          </div>
        </div>

        <div className={apiOnline ? "status online" : "status offline"}>
          <span></span>
          {apiOnline ? "Backend connected" : "Backend not connected"}
        </div>

        <div className="add-row">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
            placeholder="Enter a new task"
          />

          <button onClick={addTask} disabled={adding}>
            {adding ? "Adding" : "Add Task"}
          </button>
        </div>

        {error && <p className="message error">{error}</p>}

        <div className="toolbar">
          <div className="filters">
            <button
              className={filter === "all" ? "filter active" : "filter"}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "active" ? "filter active" : "filter"}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={filter === "completed" ? "filter active" : "filter"}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <button
            className="clear-button"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Clear completed
          </button>
        </div>

        <div className="summary">
          <span>{tasks.length} total</span>
          <span>{pendingCount} active</span>
          <span>{completedCount} completed</span>
        </div>

        {loading ? (
          <p className="message">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="message">No tasks yet. Add your first one above.</p>
        ) : visibleTasks.length === 0 ? (
          <p className="message">No tasks in this view.</p>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li
                key={task._id}
                className={task.completed ? "task completed" : "task"}
              >
                {editingId === task._id ? (
                  <div className="edit-row">
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateTaskText(task);
                        }

                        if (e.key === "Escape") {
                          cancelEditing();
                        }
                      }}
                    />
                    <button onClick={() => updateTaskText(task)}>Save</button>
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

                    <span className="task-badge">
                      {task.completed ? "Done" : "Open"}
                    </span>

                    <button
                      className="edit-button"
                      onClick={() => startEditing(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task._id)}
                    >
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
