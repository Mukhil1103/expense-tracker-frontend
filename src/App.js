import React, { useEffect, useState } from "react";
import axios from "axios";
import ExpenseChart from "./components/ExpenseChart";

function App() {
  const [expenses, setExpenses] = useState([]);

  const API_URL = "https://expense-tracker-fullstack-1-ikle.onrender.com/api/expenses/";

  // ✅ fetch function defined BEFORE useEffect
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(API_URL);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ include dependency
  useEffect(() => {
    fetchExpenses();
  }, []); // safe because function is stable

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Expense Dashboard</h1>

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