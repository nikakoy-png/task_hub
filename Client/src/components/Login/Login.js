import React, { useState } from 'react';
import './Login.css'
import {Nav} from "react-bootstrap";

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const token = data.access;
      console.log(token);
      document.cookie = `token=${token}; Path=/`;
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowRegister = () => {
    props.showRegister();
  };

  return (
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="text"
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
            <label>Username</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <label>Password</label>
          </div>
          <p className="text-center text-muted mb-0">Don't have an account?
            <Nav.Link onClick={handleShowRegister} className="fw-bold text-body d-inline-block ms-1">Register here</Nav.Link></p>
          <button type="submit" className="d-flex justify-content-center">
            Submit
          </button>
        </form>
      </div>
  );
}

export default Login;