import Link from 'next/link';
import styles from '../styles/PropertyCard.module.css'; // Ensure this file exists

export default function PropertyCard({ property }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{property.name}</h2>
      <p className={styles.details}>{property.location} - {property.price}</p>
      <Link href={`/property/${property.id}`}>
        <button className={styles.button}>View Details</button>
      </Link>
    </div>
  );
}
