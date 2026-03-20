import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function ExpenseChart({ expenses }) {

  const data = {
    labels: expenses.map(e => e.title),
    datasets: [
      {
        label: "Expenses (₹)",
        data: expenses.map(e => Number(e.amount)),

        // 🔥 Gradient color effect
        backgroundColor: "rgba(76, 175, 80, 0.6)",
        borderRadius: 8,
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#333",
          font: {
            size: 14
          }
        }
      },

      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹ ${context.raw}`;
          }
        }
      }
    },

    scales: {
      x: {
        ticks: {
          color: "#555"
        },
        grid: {
          display: false
        }
      },

      y: {
        ticks: {
          color: "#555"
        },
        grid: {
          color: "#eee"
        }
      }
    }
  };

  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      marginBottom: "20px"
    }}>
      <h3 style={{ marginBottom: "10px" }}>📊 Expense Analytics</h3>

      <Bar data={data} options={options} />
    </div>
  );
}

export default ExpenseChart;