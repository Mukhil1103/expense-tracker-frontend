import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "const API_URL = "https://expense-tracker-fullstack-1-ikle.onrender.com/api"

function App() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔥 Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_URL}/expenses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) fetchExpenses();
  }, [token]);

  // 🔥 Login
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://expense-tracker-fullstack-1-ikle.onrender.com/api/token/",
        {
          username: title,
          password: amount,
        }
      );

      localStorage.setItem("token", res.data.access);
      setToken(res.data.access);

      alert("Login successful!");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  // 🔥 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // 🔥 Add Expense
  const handleAddExpense = async () => {
    try {
      await axios.post(
        `${API_URL}/expenses/`,
        {
          title,
          amount,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setAmount("");
      setCategory("");
      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 DELETE Expense
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 EDIT Expense
  const handleEdit = async (expense) => {
    const newTitle = prompt("Edit title:", expense.title);
    const newAmount = prompt("Edit amount:", expense.amount);
    const newCategory = prompt("Edit category:", expense.category);

    if (!newTitle || !newAmount || !newCategory) return;

    try {
      await axios.put(
        `${API_URL}/expenses/${expense.id}/`,
        {
          title: newTitle,
          amount: newAmount,
          category: newCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 LOGIN UI
  if (!token) {
    return (
      <div className="container">
        <h1>🔐 Login</h1>

        <input
          placeholder="Username"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="add-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    );
  }

  // 🔥 MAIN DASHBOARD
  return (
    <div className="container">
      <h1>💰 Expense Dashboard</h1>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      {/* ADD EXPENSE */}
      <div className="card">
        <h3>Add Expense</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button className="add-btn" onClick={handleAddExpense}>
          Add
        </button>
      </div>

      {/* EXPENSE LIST */}
      <div className="card">
        <h3>Expenses</h3>

        {expenses.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="expense-item">
              <span>
                {exp.title} - ₹{exp.amount} ({exp.category})
              </span>

              <div>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(exp)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(exp.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;