import Link from 'next/link';
import styles from '../styles/HeroSection.module.css'; // Ensure this file exists

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Find Your Dream Home</h1>
      <p className={styles.subtitle}>Discover properties with AI-driven pricing and blockchain security.</p>
      <Link href="/properties">
        <button className={styles.button}>Browse Listings</button>
      </Link>
    </section>
  );
}
