import Link from 'next/link';
import styles from '../styles/DashboardSidebar.module.css'; // Ensure this file exists

export default function DashboardSidebar() {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Dashboard</h2>
      <ul className={styles.menu}>
        <li>
          <Link href="/dashboard" className={styles.link}>Overview</Link>
        </li>
        <li>
          <Link href="/transactions" className={styles.link}>Transactions</Link>
        </li>
        <li>
          <Link href="/profile" className={styles.link}>Profile</Link>
        </li>
        <li>
          <Link href="/logout" className={styles.logout}>Logout</Link>
        </li>
      </ul>
    </aside>
  );
}
