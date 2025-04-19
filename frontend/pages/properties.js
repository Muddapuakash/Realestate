// pages/properties.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Properties.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesCity = !filterCity || property.location.toLowerCase().includes(filterCity.toLowerCase());
    const matchesType = !filterType || property.type === filterType;
    return matchesCity && matchesType;
  });

  const availableCities = [...new Set(properties.map(property => property.location))];
  const availableTypes = [...new Set(properties.map(property => property.type))];

  const handleFilter = (e) => {
    e.preventDefault();
    // The filtering happens automatically through the filteredProperties variable
  };

  const clearFilters = () => {
    setFilterCity('');
    setFilterType('');
  };

  return (
    <div className={styles.homeContainer}>
      <Navbar />
      <div className={styles.container}>
        <Head>
          <title>Real Estate Properties</title>
          <meta name="description" content="Browse available properties in India" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Available Properties
          </h1>

          <p className={styles.description}>
            Browse our selection of premium real estate across India
          </p>

          <div className={styles.card}>
            <form onSubmit={handleFilter} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="filterCity">Filter by City:</label>
                <select
                  id="filterCity"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className={styles.select}
                >
                  <option value="">-- All Cities --</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="filterType">Property Type:</label>
                <select
                  id="filterType"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={styles.select}
                >
                  <option value="">-- All Types --</option>
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className={styles.button}>
                Apply Filters
              </button>
              <button type="button" onClick={clearFilters} className={styles.secondaryButton}>
                Clear Filters
              </button>
            </form>

            {error && <p className={styles.error}>{error}</p>}
            {loading && <p className={styles.loading}>Loading properties...</p>}

            {!loading && filteredProperties.length === 0 && (
              <p className={styles.noResults}>No properties found matching your criteria.</p>
            )}

            {!loading && filteredProperties.length > 0 && (
              <div className={styles.propertiesList}>
                {filteredProperties.map((property) => (
                  <div key={property._id} className={styles.propertyCard}>
                    <h2 className={styles.propertyName}>{property.name}</h2>
                    <div className={styles.propertyDetails}>
                      <p><strong>Location:</strong> {property.location}</p>
                      <p><strong>Type:</strong> {property.type}</p>
                      <p><strong>Price:</strong> ₹{property.price.toLocaleString('en-IN')}</p>
                      <p><strong>Size:</strong> {property.size} sq.ft</p>
                    </div>
                    <Link href={`/property/${property._id}`} className={styles.viewDetailsButton}>
  View Details
</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}