import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, form);
      setMessage('Registered! Now go to Login.');
    } catch (err) {
      setMessage('Registration failed');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email: </label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password: </label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit">Sign up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
