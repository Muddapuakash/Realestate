import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const storedUserInfo = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;

      if (token) {
        setIsLoggedIn(true);
        if (storedUserInfo) {
          try {
            setUserInfo(JSON.parse(storedUserInfo));
          } catch (error) {
            console.error('Error parsing user info:', error);
            setUserInfo(null);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    // Initial check
    checkAuthStatus();

    // Listen for storage changes across tabs
    window.addEventListener('storage', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication token and user info
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');

    // Update state
    setIsLoggedIn(false);
    setUserInfo(null);
    setShowDropdown(false);

    // Redirect to login page
    router.push('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Real Estate AI</Link>
      </div>
      
      <div className={styles.navLinks}>
        {/* Always visible links */}
        <Link href="/" className={styles.navLink}>Home</Link>
        <Link href="/properties" className={styles.navLink}>Properties</Link>
        <Link href="/priceprediction" className={styles.navLink}>Price Prediction</Link>
        
        {/* Conditionally render links based on login status */}
        {isLoggedIn ? (
          <div className={`${styles.userSection} user-dropdown-container`}>
            <button 
              className={styles.userButton} 
              onClick={toggleDropdown}
            >
              {userInfo && userInfo.email ? userInfo.email.split('@')[0] : 'User'}
            </button>
            
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <Link href="/dashboard" className={styles.dropdownItem}>Dashboard</Link>
                <Link href="/account" className={styles.dropdownItem}>Account Settings</Link>
                <Link href="/changepassword" className={styles.dropdownItem}>Change Password</Link>
                <button 
                  className={styles.dropdownItem} 
                  onClick={handleLogout}
                >
                <Link href="/" className={styles.dropdownItem}>Log out</Link>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link href="/login" className={styles.navLink}>Login</Link>
            <Link href="/register" className={styles.navLink}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}