import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/ChangePassword.module.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function ChangePassword() {
  const router = useRouter();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // In a real application, this would be an API call
    // For demo purposes, we'll just simulate success
    setTimeout(() => {
      setSuccess(true);
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset success message after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 500);
  };

  const handleCancel = () => {
    // Navigate back to account settings or dashboard
    router.push('/dashboard');
  };

  return (
    <div className={styles.homeContainer}>
        <Navbar />
    <div className={styles.changePasswordContainer}>
       
      <div className={styles.card}>
        <h1 className={styles.title}>Change Password</h1>
        <p className={styles.subtitle}>
          Update your password to keep your account secure
        </p>
        
        {success && (
          <div className={styles.successMessage}>
            Password changed successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword" className={styles.label}>
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              className={`${styles.input} ${errors.currentPassword ? styles.inputError : ''}`}
              placeholder="Enter your current password"
            />
            {errors.currentPassword && (
              <p className={styles.errorText}>{errors.currentPassword}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              className={`${styles.input} ${errors.newPassword ? styles.inputError : ''}`}
              placeholder="Enter your new password"
            />
            {errors.newPassword && (
              <p className={styles.errorText}>{errors.newPassword}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && (
              <p className={styles.errorText}>{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className={styles.passwordRequirements}>
            <h3 className={styles.requirementsTitle}>Password Requirements:</h3>
            <ul className={styles.requirementsList}>
              <li>At least 8 characters</li>
              <li>Include at least one uppercase letter</li>
              <li>Include at least one number</li>
              <li>Include at least one special character (!@#$%^&*)</li>
            </ul>
          </div>
          
          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={handleCancel} 
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
      
    </div>
    <Footer />
  </div>
  );
}