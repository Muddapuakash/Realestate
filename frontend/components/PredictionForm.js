import { useState } from 'react';
import styles from '../styles/Predict.module.css';

// Sample data for dropdowns
const areaTypes = [
  'Super built-up Area',
  'Built-up Area',
  'Plot Area',
  'Carpet Area'
];

const popularLocations = [
  'Whitefield',
  'Sarjapur Road',
  'Electronic City',
  'HSR Layout',
  'Marathahalli',
  'Bannerghatta Road',
  'Hennur Road',
  'Hoodi',
  'Kanakpura Road',
  'Yelahanka',
  'JP Nagar',
  'Hebbal',
  'Other'
];

const sizeBHKOptions = [
  '1 BHK',
  '2 BHK',
  '3 BHK',
  '4 BHK',
  '5 BHK',
  '6 BHK',
  '7 BHK',
  '8 BHK',
  '9 BHK',
  '10 BHK'
];

const PredictionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    area_type: 'Super built-up Area',
    location: 'Whitefield',
    size: '2 BHK',
    society: '',
    total_sqft: '1200',
    bath: '2',
    balcony: '1'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="area_type">Area Type</label>
        <select
          id="area_type"
          name="area_type"
          value={formData.area_type}
          onChange={handleChange}
          required
        >
          {areaTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="location">Location</label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        >
          {popularLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="size">Size (BHK)</label>
        <select
          id="size"
          name="size"
          value={formData.size}
          onChange={handleChange}
          required
        >
          {sizeBHKOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="society">Society</label>
        <input
          type="text"
          id="society"
          name="society"
          value={formData.society}
          onChange={handleChange}
          placeholder="Enter society name"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="total_sqft">Total Square Feet</label>
        <input
          type="number"
          id="total_sqft"
          name="total_sqft"
          value={formData.total_sqft}
          onChange={handleChange}
          min="100"
          required
          placeholder="Enter total square feet"
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="bath">Bathrooms</label>
          <input
            type="number"
            id="bath"
            name="bath"
            value={formData.bath}
            onChange={handleChange}
            min="1"
            max="10"
            required
            placeholder="Bathrooms"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="balcony">Balconies</label>
          <input
            type="number"
            id="balcony"
            name="balcony"
            value={formData.balcony}
            onChange={handleChange}
            min="0"
            max="5"
            required
            placeholder="Balconies"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Predicting...' : 'Predict Price'}
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;