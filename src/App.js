import React, { useEffect, useState } from "react";
import axios from "axios";
import ExpenseChart from "./components/ExpenseChart";
import Login from "./Login";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const API_URL = "https://expense-tracker-fullstack-1-ikle.onrender.com/api/expenses/";

  // ✅ fetchExpenses INSIDE useEffect → no dependency warning
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!token) return;

      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchExpenses();
  }, [token]);

  // ✅ Add expense
  const addExpense = async () => {
    try {
      await axios.post(
        API_URL,
        { title, amount: Number(amount), date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // refetch
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);

      setTitle("");
      setAmount("");
      setDate("");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ✅ Login screen
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Expense Dashboard</h1>

      <button onClick={logout}>Logout</button>

      {/* Add Expense */}
      <div style={{ marginTop: "20px" }}>
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
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>

      {/* Chart */}
      <ExpenseChart expenses={expenses} />

      {/* List */}
      {expenses.map((e) => (
        <div key={e.id} style={{ marginTop: "10px" }}>
          <strong>{e.title}</strong> - ₹{e.amount}
        </div>
      ))}
    </div>
  );
}

export default App;