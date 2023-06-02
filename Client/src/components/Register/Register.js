import React, { useState } from 'react';
import './Register.css';
import { Nav } from 'react-bootstrap';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [img, setAvatar] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('password_confirm', password_confirm);
    formData.append('email', email);
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('img', img[0]);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}register/`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const token = data.access;
      console.log(token);
      document.cookie = `token=${token}; Path=/`;
      window.location.href = '/';
      event.target.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowLogin = () => {
    props.showLogin();
  };

  return (
    <div className="login-box">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label>Email</label>
        </div>
        <div className="user-box">
          <input
            type="text"
            name="first_name"
            value={first_name}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
          <label>First Name</label>
        </div>
        <div className="user-box">
          <input
            type="text"
            name="last_name"
            value={last_name}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
          <label>Last Name</label>
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
            <div className="user-box">
            <input
            type="password"
            name="password_confirm"
            value={password_confirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            required
          />
              <label>Password Confirm</label>
          </div>
            <div className="user-box">
            <input
            type="file"
            name="avatar"
            onChange={(event) => setAvatar(event.target.files)}
          />
              <label>Avatar</label>
          </div>
            <p className="text-center text-muted mb-0">Have already an account?
            <Nav.Link onClick={handleShowLogin} className="fw-bold text-body d-inline-block ms-1">Login
                                        here</Nav.Link></p>
          <button type="submit" className="d-flex justify-content-center">
            Submit
          </button>
        </form>
      </div>
  );
}

export default Login;