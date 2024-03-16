// Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', { email, password });
      console.log(response.data); // handle successful login
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account? <button onClick={switchToRegister}>Register</button>
      </p>
    </div>
  );
};

export default Login;
