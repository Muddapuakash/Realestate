import styles from '../styles/Predict.module.css';

const ResultCard = ({ prediction }) => {
  const { formattedPrice, inputData } = prediction;
  
  // Format numbers with commas for better readability
  const formatNumber = (num) => {
    return Number(num).toLocaleString('en-IN');
  };
  
  return (
    <div className={styles.resultCardContainer}>
      <h2 className={styles.resultTitle}>Price Prediction</h2>
      
      <div className={styles.priceResult}>
        <span className={styles.priceValue}>{formattedPrice}</span>
      </div>
      
      <div className={styles.resultDetails}>
        <h3>Property Details</h3>
        <ul className={styles.detailsList}>
          <li>
            <span className={styles.detailLabel}>Location:</span>
            <span className={styles.detailValue}>{inputData.location}</span>
          </li>
          <li>
            <span className={styles.detailLabel}>Size:</span>
            <span className={styles.detailValue}>{inputData.size}</span>
          </li>
          <li>
            <span className={styles.detailLabel}>Area Type:</span>
            <span className={styles.detailValue}>{inputData.area_type}</span>
          </li>
          <li>
            <span className={styles.detailLabel}>Total Area:</span>
            <span className={styles.detailValue}>{formatNumber(inputData.total_sqft)} sq.ft</span>
          </li>
          <li>
            <span className={styles.detailLabel}>Bathrooms:</span>
            <span className={styles.detailValue}>{inputData.bath}</span>
          </li>
          <li>
            <span className={styles.detailLabel}>Balconies:</span>
            <span className={styles.detailValue}>{inputData.balcony}</span>
          </li>
          {inputData.society && (
            <li>
              <span className={styles.detailLabel}>Society:</span>
              <span className={styles.detailValue}>{inputData.society}</span>
            </li>
          )}
        </ul>
      </div>
      
      <div className={styles.disclaimer}>
        <p>* This is an estimated price based on historical data</p>
      </div>
    </div>
  );
};

export default ResultCard;