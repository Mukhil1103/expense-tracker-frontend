import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import ExpenseChart from "./components/ExpenseChart";

function App() {

  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const API_URL = "http://127.0.0.1:8000/api/expenses/";

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addExpense = async () => {
    await axios.post(API_URL, {
      title,
      amount: Number(amount),
      date
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    clearForm();
    fetchExpenses();
  };

  const updateExpense = async () => {
    await axios.put(`${API_URL}${editingId}/`, {
      title,
      amount: Number(amount),
      date
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    clearForm();
    fetchExpenses();
  };

  const deleteExpense = async (id) => {
    await axios.delete(`${API_URL}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchExpenses();
  };

  const editExpense = (expense) => {
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setDate(expense.date);
  };

  const clearForm = () => {
    setTitle("");
    setAmount("");
    setDate("");
    setEditingId(null);
  };

  const total = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  return (
    <div style={styles.appWrapper}>

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            <h2>💰 FinTrack</h2>

            <p style={styles.menuItem}>Dashboard</p>
            <p style={styles.menuItem}>Expenses</p>
            <p style={styles.menuItem}>Analytics</p>

            <button
              style={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
              }}
            >
              Logout
            </button>
          </div>

          {/* Main Content */}
          <div style={styles.main}>

            <h1>Dashboard</h1>

            {/* Stats Cards */}
            <div style={styles.statsRow}>

              <div style={styles.statCard}>
                ₹ {total}
                <p>Total Spending</p>
              </div>

              <div style={styles.statCard}>
                {expenses.length}
                <p>Transactions</p>
              </div>

            </div>

            {/* Chart */}
            <ExpenseChart expenses={expenses} />

            {/* Form */}
            <div style={styles.card}>

              <h3>{editingId ? "Edit Expense" : "Add Expense"}</h3>

              <input
                style={styles.input}
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <input
                style={styles.input}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <button
                style={styles.button}
                onClick={editingId ? updateExpense : addExpense}
              >
                {editingId ? "Update Expense" : "Add Expense"}
              </button>

            </div>

          </div>
        </>
      )}
    </div>
  );
}

const styles = {

  appWrapper: {
    display: "flex"
  },

  sidebar: {
    width: "220px",
    height: "100vh",
    background: "#111",
    color: "white",
    padding: "20px"
  },

  menuItem: {
    margin: "15px 0",
    cursor: "pointer"
  },

  logoutBtn: {
    marginTop: "30px",
    padding: "10px",
    background: "#f44336",
    color: "white",
    border: "none",
    cursor: "pointer",
    width: "100%"
  },

  main: {
    flex: 1,
    padding: "30px",
    background: "#f4f6f8"
  },

  statsRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  },

  statCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "20px"
  },

  input: {
    display: "block",
    marginBottom: "10px",
    padding: "10px",
    width: "100%"
  },

  button: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};

export default App;