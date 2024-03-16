// Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/register', { email, password });
      console.log(response.data); // handle successful registration
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account? <button onClick={switchToLogin}>Login</button>
      </p>
    </div>
  );
};

export default Register;
