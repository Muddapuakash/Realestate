import styles from '../styles/About.module.css'; // Ensure this file exists

export default function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.heading}>About Us</h1>
      <p className={styles.description}>
        Our platform leverages AI and Blockchain for smart real estate investments.
      </p>
    </div>
  );
}
