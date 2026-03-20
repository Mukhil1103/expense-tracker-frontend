import React, { useState } from "react";
import axios from "axios";

function Login({ setToken }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        {
          username,
          password
        }
      );

      const token = res.data.access;

      localStorage.setItem("token", token);
      setToken(token);

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>

      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={loginUser}>Login</button>

    </div>
  );
}

export default Login;