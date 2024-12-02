import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setCurrentUsername, setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username,
      password,
    };

    try {
      const response = await fetch('http://localhost:3300/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Login Successful!');
        console.log('User logged in successfully.');
        localStorage.setItem('currentUsername', username);
        setCurrentUsername(username);
        setIsLoggedIn(true);
        localStorage.setItem('loginUserID', formData.username);
        setUsername('');
        setPassword('');
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }
      navigate('/');
    } catch (error) {
      console.log(error);
      alert('Error');
    }
  };

  return (
    <div className="App">
      <div className="login">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
