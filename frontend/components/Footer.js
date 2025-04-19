import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Mail, 
  Phone 
} from 'lucide-react';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <Link href="/properties">Properties</Link>
            <Link href="/predict">Price Prediction</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/about">About Us</Link>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Contact Info</h3>
          <div className={styles.contactItem}>
            <MapPin size={20} />
            <span>123 Real Estate Ave, City, Country</span>
          </div>
          <div className={styles.contactItem}>
            <Mail size={20} />
            <span>support@realestate.com</span>
          </div>
          <div className={styles.contactItem}>
            <Phone size={20} />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Connect With Us</h3>
          <div className={styles.socialIcons}>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Facebook size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Twitter size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>
          © {currentYear} Real Estate Platform. All Rights Reserved.
        </p>
        <div className={styles.legalLinks}>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}