import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Predict.module.css';

// ROI Calculator component
const ROICalculator = ({ propertyPrice }) => {
  const [investment, setInvestment] = useState(propertyPrice || 50);
  const [rentalYield, setRentalYield] = useState(3);
  const [annualAppreciation, setAnnualAppreciation] = useState(5);
  const [years, setYears] = useState(5);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'investment': setInvestment(Number(value)); break;
      case 'rentalYield': setRentalYield(Number(value)); break;
      case 'annualAppreciation': setAnnualAppreciation(Number(value)); break;
      case 'years': setYears(Number(value)); break;
      default: break;
    }
  };
  
  // Calculate ROI
  const calculateROI = () => {
    let totalValue = investment;
    let totalRentalIncome = 0;
    const monthlyRental = (investment * 100000 * (rentalYield / 100)) / 12;
    
    for (let i = 0; i < years; i++) {
      totalRentalIncome += monthlyRental * 12;
      totalValue *= (1 + (annualAppreciation / 100));
    }
    
    const totalReturn = totalValue - investment + totalRentalIncome / 100000;
    const roi = ((totalReturn / investment) * 100).toFixed(2);
    
    return {
      finalValue: totalValue.toFixed(2),
      totalRentalIncome: (totalRentalIncome / 100000).toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      roi
    };
  };
  
  const result = calculateROI();
  
  return (
    <div className={styles.roiCalculator}>
      <h3>Investment Returns Calculator</h3>
      
      <div className={styles.roiForm}>
        <div className={styles.formGroup}>
          <label htmlFor="investment">Property Value (₹ lakhs)</label>
          <input type="number" id="investment" name="investment" value={investment} onChange={handleChange} min="10" className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="rentalYield">Annual Rental Yield (%)</label>
          <input type="number" id="rentalYield" name="rentalYield" value={rentalYield} onChange={handleChange} step="0.1" min="1" max="10" className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="annualAppreciation">Annual Appreciation (%)</label>
          <input type="number" id="annualAppreciation" name="annualAppreciation" value={annualAppreciation} onChange={handleChange} step="0.5" min="0" max="20" className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="years">Investment Period (years)</label>
          <input type="number" id="years" name="years" value={years} onChange={handleChange} min="1" max="30" className={styles.input} />
        </div>
      </div>
      
      <div className={styles.roiResults}>
        <div className={styles.roiResult}>
          <h4>Property Value after {years} years</h4>
          <p>₹ {result.finalValue} lakhs</p>
        </div>
        
        <div className={styles.roiResult}>
          <h4>Total Rental Income</h4>
          <p>₹ {result.totalRentalIncome} lakhs</p>
        </div>
        
        <div className={styles.roiResult}>
          <h4>Total Returns</h4>
          <p>₹ {result.totalReturn} lakhs</p>
        </div>
        
        <div className={styles.roiResultHighlight}>
          <h4>Return on Investment</h4>
          <p>{result.roi}%</p>
        </div>
      </div>
    </div>
  );
};

// Neighborhood Info component
const NeighborhoodInfo = ({ location }) => {
  const locationInfo = {
    '1st Block Jayanagar': {
      safety: 8.5,
      schools: 9,
      hospitals: 8,
      transport: 7.5,
      description: 'Well-planned residential area with commercial streets and parks'
    },
    'Whitefield': {
      safety: 7.5,
      schools: 8,
      hospitals: 7,
      transport: 6,
      description: 'Major IT hub with tech parks and upscale communities'
    },
    'Electronic City': {
      safety: 7,
      schools: 7.5,
      hospitals: 6.5,
      transport: 6.5,
      description: 'Original tech hub with growing residential areas'
    }
  };
  
  const info = locationInfo[location] || {
    safety: 7,
    schools: 7,
    hospitals: 7,
    transport: 7,
    description: 'Standard Bangalore residential area with regular amenities'
  };
  
  const renderRating = (rating) => {
    return (
      <div className={styles.ratingBar}>
        <div className={styles.ratingFill} style={{ width: `${rating * 10}%` }}></div>
        <span>{rating.toFixed(1)}/10</span>
      </div>
    );
  };
  
  return (
    <div className={styles.neighborhoodInfo}>
      <h3>Neighborhood: {location}</h3>
      <p>{info.description}</p>
      
      <div className={styles.ratings}>
        <div className={styles.rating}>
          <h4>Safety</h4>
          {renderRating(info.safety)}
        </div>
        <div className={styles.rating}>
          <h4>Schools</h4>
          {renderRating(info.schools)}
        </div>
        <div className={styles.rating}>
          <h4>Hospitals</h4>
          {renderRating(info.hospitals)}
        </div>
        <div className={styles.rating}>
          <h4>Transport</h4>
          {renderRating(info.transport)}
        </div>
      </div>
      
      <div className={styles.nearbyFacilities}>
        <h4>Nearby Facilities</h4>
        <ul>
          <li>Schools: National Public School (0.8 km), DPS (2.3 km)</li>
          <li>Hospitals: Apollo (1.2 km), Manipal (3.5 km)</li>
          <li>Shopping: Orion Mall (2.5 km), Local Market (0.5 km)</li>
          <li>Transport: Bus Terminal (0.6 km), Metro Station (3.2 km)</li>
        </ul>
      </div>
    </div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({
    area_type: 'Super built-up Area',
    location: '1st Block Jayanagar',
    society: '',
    total_sqft: '',
    bath: '',
    balcony: '',
    bedrooms: '',
    floor: '',
    total_floors: '',
    age: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [areaTypes, setAreaTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('prediction');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceHistory, setPriceHistory] = useState([
    { month: 'Oct', price: 52 },
    { month: 'Nov', price: 54 },
    { month: 'Dec', price: 53 },
    { month: 'Jan', price: 55 },
    { month: 'Feb', price: 57 },
    { month: 'Mar', price: 59 }
  ]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    async function fetchData() {
      try {
        const locRes = await fetch(`${API_URL}/locations`);
        const locData = await locRes.json();
        setLocations(locData);

        const areaRes = await fetch(`${API_URL}/area_types`);
        const areaData = await areaRes.json();
        setAreaTypes(areaData);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Set defaults
        setLocations(['1st Block Jayanagar', 'Electronic City', 'Whitefield', 'Other']);
        setAreaTypes(['Super built-up Area', 'Built-up Area', 'Plot Area', 'Carpet Area']);
      }
    }

    fetchData();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.prediction);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to the server');
      console.error(err);
      // For demo purposes, set a mock prediction
      setPrediction(55.8);
    } finally {
      setLoading(false);
    }
  };

  // Price history chart component
  const renderPriceChart = () => {
    const width = 600;
    const height = 200;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    const maxPrice = Math.max(...priceHistory.map(d => d.price)) * 1.1;
    const minPrice = Math.min(...priceHistory.map(d => d.price)) * 0.9;
    
    const points = priceHistory.map((d, i) => {
      const x = padding + (i * (chartWidth / (priceHistory.length - 1)));
      const y = height - padding - (((d.price - minPrice) / (maxPrice - minPrice)) * chartHeight);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" strokeWidth="1" />
        <polyline points={points} fill="none" stroke="#4a90e2" strokeWidth="2" />
        {priceHistory.map((d, i) => {
          const x = padding + (i * (chartWidth / (priceHistory.length - 1)));
          const y = height - padding - (((d.price - minPrice) / (maxPrice - minPrice)) * chartHeight);
          return <circle key={i} cx={x} cy={y} r="4" fill="#4a90e2" />;
        })}
      </svg>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Advanced Bengaluru House Price Predictor</title>
        <meta name="description" content="Advanced tool to predict house prices in Bengaluru" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>
          <span>🏠</span>
          <h1>BengaluruHomes</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li className={styles.active}>Price Predictor</li>
            <li>Market Trends</li>
            <li>Neighborhoods</li>
          </ul>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.heroSection}>
          <h1>Advanced Bengaluru House Price Predictor</h1>
          <p>Get accurate price estimates, neighborhood insights, and investment analysis</p>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2>Property Details</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="area_type">Area Type</label>
                <select id="area_type" name="area_type" value={formData.area_type} onChange={handleChange} required className={styles.select}>
                  {areaTypes.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location">Location</label>
                <select id="location" name="location" value={formData.location} onChange={handleChange} required className={styles.select}>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="total_sqft">Total Square Feet</label>
                  <input type="number" id="total_sqft" name="total_sqft" value={formData.total_sqft} onChange={handleChange} min="100" required className={styles.input} placeholder="e.g. 1200" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="society">Society (Optional)</label>
                  <input type="text" id="society" name="society" value={formData.society} onChange={handleChange} className={styles.input} placeholder="e.g. Prestige" />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="bedrooms">Bedrooms</label>
                  <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="1" required className={styles.input} placeholder="e.g. 2" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bath">Bathrooms</label>
                  <input type="number" id="bath" name="bath" value={formData.bath} onChange={handleChange} min="1" required className={styles.input} placeholder="e.g. 2" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="balcony">Balconies</label>
                  <input type="number" id="balcony" name="balcony" value={formData.balcony} onChange={handleChange} min="0" className={styles.input} placeholder="e.g. 1" />
                </div>
              </div>

              <div className={styles.advancedToggle} onClick={() => setShowAdvanced(!showAdvanced)}>
                <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Options</span>
                <span className={styles.toggleIcon}>{showAdvanced ? '▲' : '▼'}</span>
              </div>
              
              {showAdvanced && (
                <div className={styles.advancedOptions}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="floor">Floor</label>
                      <input type="number" id="floor" name="floor" value={formData.floor} onChange={handleChange} min="0" className={styles.input} placeholder="e.g. 3" />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="total_floors">Total Floors</label>
                      <input type="number" id="total_floors" name="total_floors" value={formData.total_floors} onChange={handleChange} min="1" className={styles.input} placeholder="e.g. 8" />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="age">Building Age (years)</label>
                      <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} min="0" className={styles.input} placeholder="e.g. 5" />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Amenities</label>
                    <div className={styles.checkboxGroup}>
                      <label className={styles.checkbox}><input type="checkbox" name="gym" /><span>Gym</span></label>
                      <label className={styles.checkbox}><input type="checkbox" name="pool" /><span>Swimming Pool</span></label>
                      <label className={styles.checkbox}><input type="checkbox" name="park" /><span>Park</span></label>
                      <label className={styles.checkbox}><input type="checkbox" name="security" /><span>24x7 Security</span></label>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Analyzing Property...' : 'Get Price Estimate'}
              </button>
            </form>
          </div>

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          {prediction !== null && !error && (
            <div className={styles.resultsContainer}>
              <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                  <button className={`${styles.tab} ${activeTab === 'prediction' ? styles.activeTab : ''}`} onClick={() => setActiveTab('prediction')}>
                    Price Estimate
                  </button>
                  <button className={`${styles.tab} ${activeTab === 'neighborhood' ? styles.activeTab : ''}`} onClick={() => setActiveTab('neighborhood')}>
                    Neighborhood
                  </button>
                  <button className={`${styles.tab} ${activeTab === 'investment' ? styles.activeTab : ''}`} onClick={() => setActiveTab('investment')}>
                    Investment Analysis
                  </button>
                </div>
                
                <div className={styles.tabContent}>
                  {activeTab === 'prediction' && (
                    <div className={styles.predictionTab}>
                      <div className={styles.result}>
                        <h2>Estimated Price</h2>
                        <div className={styles.predictionBox}>
                          <span className={styles.currency}>₹</span>
                          <span className={styles.price}>{prediction}</span>
                          <span className={styles.unit}> lakhs</span>
                        </div>
                        <p className={styles.inrValue}>
                          Approximately ₹{(prediction * 100000).toLocaleString('en-IN')}
                        </p>
                        
                        <div className={styles.priceRange}>
                          <p>Price Range</p>
                          <div className={styles.rangeBar}>
                            <div className={styles.rangeFill}></div>
                            <span className={styles.rangeMin}>₹{(prediction * 0.9).toFixed(2)} L</span>
                            <span className={styles.rangeMax}>₹{(prediction * 1.1).toFixed(2)} L</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.priceHistory}>
                        <h3>Price Trend (Last 6 Months)</h3>
                        {renderPriceChart()}
                      </div>
                      
                      <div className={styles.priceFactors}>
                        <h3>Factors Affecting Price</h3>
                        <div className={styles.factor}>
                          <div className={styles.factorName}>Location Premium</div>
                          <div className={styles.factorBar}><div className={styles.factorFill} style={{ width: '85%' }}></div></div>
                        </div>
                        <div className={styles.factor}>
                          <div className={styles.factorName}>Size (sq ft)</div>
                          <div className={styles.factorBar}><div className={styles.factorFill} style={{ width: '70%' }}></div></div>
                        </div>
                        <div className={styles.factor}>
                          <div className={styles.factorName}>Bedrooms</div>
                          <div className={styles.factorBar}><div className={styles.factorFill} style={{ width: '60%' }}></div></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'neighborhood' && (
                    <NeighborhoodInfo location={formData.location} />
                  )}
                  
                  {activeTab === 'investment' && (
                    <ROICalculator propertyPrice={prediction} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 BengaluruHomes | Powered by AI & Data Science</p>
      </footer>
    </div>
  );
}