import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/AccountSettings.module.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function AccountSettings() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Bank Account', details: 'Chase Bank ****6767' }
  ]);
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    investmentUpdates: true,
    marketReports: true,
  });

  useEffect(() => {
    // Fetch user data from local storage or API
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        setUserInfo({
          fullName: parsedInfo.fullName || 'Alex Johnson',
          email: parsedInfo.email || 'alex.johnson@example.com',
          phone: parsedInfo.phone || '+1 (555) 123-4567',
          dateOfBirth: parsedInfo.dateOfBirth || '1985-04-15',
        });
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const saveUserInfo = (e) => {
    e.preventDefault();
    // Save to localStorage for demo purposes
    // In production, this would be an API call
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    alert('Personal information updated successfully!');
  };

  const updatePassword = (e) => {
    e.preventDefault();
    
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (!passwordInfo.currentPassword) {
      alert('Please enter your current password!');
      return;
    }
    
    // In production, this would be an API call
    alert('Password updated successfully!');
    setPasswordInfo({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const savePreferences = (e) => {
    e.preventDefault();
    // Save notification preferences
    // In production, this would be an API call
    alert('Notification preferences saved!');
  };

  const addPaymentMethod = () => {
    // In a real app, this would open a modal or redirect to add payment info
    alert('This would open a payment method form');
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  return (
    <div className={styles.homeContainer}>
    <Navbar />
    <div className={styles.accountSettingsContainer}>
    
      <h1 className={styles.pageTitle}>Account Settings</h1>
      
      {/* Personal Information Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <form onSubmit={saveUserInfo}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={userInfo.fullName}
                onChange={handleUserInfoChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userInfo.email}
                onChange={handleUserInfoChange}
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userInfo.phone}
                onChange={handleUserInfoChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={userInfo.dateOfBirth}
                onChange={handleUserInfoChange}
                className={styles.input}
              />
            </div>
          </div>
          
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </form>
      </section>
      
      
          
        
      {/* Payment Methods Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Payment Methods</h2>
        <div className={styles.paymentMethods}>
          {paymentMethods.map(method => (
            <div key={method.id} className={styles.paymentMethod}>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentIcon}>🏦</span>
                <div>
                  <div className={styles.paymentType}>{method.type}</div>
                  <div className={styles.paymentDetails}>{method.details}</div>
                </div>
              </div>
              <div className={styles.paymentActions}>
                <button className={styles.editButton}>Edit</button>
                <button 
                  className={styles.removeButton}
                  onClick={() => removePaymentMethod(method.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addPaymentMethod} className={styles.addButton}>
          Add Payment Method
        </button>
      </section>
      
      {/* Notifications Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <form onSubmit={savePreferences}>
          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <h3 className={styles.notificationTitle}>Email Notifications</h3>
              <p className={styles.notificationDescription}>
                Receive emails about your account activity
              </p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={() => handleNotificationChange('emailNotifications')}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          
          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <h3 className={styles.notificationTitle}>Investment Updates</h3>
              <p className={styles.notificationDescription}>
                Get notified about property value changes
              </p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notifications.investmentUpdates}
                onChange={() => handleNotificationChange('investmentUpdates')}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          
          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <h3 className={styles.notificationTitle}>Market Reports</h3>
              <p className={styles.notificationDescription}>
                Weekly market analysis and investment opportunities
              </p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={notifications.marketReports}
                onChange={() => handleNotificationChange('marketReports')}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          
          <button type="submit" className={styles.saveButton}>
            Save Preferences
          </button>
        </form>
      </section>
    </div>
    <Footer />
    </div>

  );
}