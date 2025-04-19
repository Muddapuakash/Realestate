import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Store the authentication token
        localStorage.setItem('authToken', data.token);
        
        // Store user information
        localStorage.setItem('userInfo', JSON.stringify(data.user));

        toast.success('Login successful');
        router.push('/dashboard');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        
        <p className={styles.registerLink}>
          Don 't have an account? <Link href="/register" className={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
}