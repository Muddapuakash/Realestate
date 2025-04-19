import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import styles from '../styles/Register.module.css';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName, 
          email, 
          phoneNumber, 
          dateOfBirth,
          password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful');
        router.push('/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Create Account</h1>
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName" className={styles.label}>Full Name</label>
            <input
              id="fullName"
              type="text"
              className={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

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
            <label htmlFor="phoneNumber" className={styles.label}>Phone Number</label>
            <input
              id="phoneNumber"
              type="tel"
              className={styles.input}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="dateOfBirth" className={styles.label}>Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              className={styles.input}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
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
              placeholder="Create a password"
              required
              minLength={6}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>
          
          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>
        
        <p className={styles.loginLink}>
          Already have an account? <Link href="/login" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}