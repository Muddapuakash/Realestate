// pages/priceprediction.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import hpiData from '../data/housing-price-data.json';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Priceprediction.module.css';

export default function Home() {
  const [city, setCity] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [futurePrice, setFuturePrice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cityStats, setCityStats] = useState(null);
  const [projectionData, setProjectionData] = useState([]);
  const [topCities, setTopCities] = useState([]);

  useEffect(() => {
    if (hpiData && hpiData.cities) {
      const top = [...hpiData.cities]
        .sort((a, b) => b.hpi_2023 - a.hpi_2023)
        .slice(0, 5)
        .map(city => ({
          name: city.name,
          price: city.base_price_2012 * (city.hpi_2023 / 100)
        }));
      
      setTopCities(top);
    }
  }, []);

  const calculatePrices = (e) => {
    e.preventDefault();
    setError('');
    setCurrentPrice(null);
    setFuturePrice(null);
    setProjectionData([]);
    setCityStats(null);
    setLoading(true);

    if (!city) {
      setError('Please select a city');
      setLoading(false);
      return;
    }

    const cityData = hpiData.cities.find(c => c.name.toLowerCase() === city.toLowerCase());

    if (!cityData) {
      setError(`City '${city}' not supported. Please select from the dropdown.`);
      setLoading(false);
      return;
    }

    try {
      const hpi2023 = cityData.hpi_2023;
      const basePrice = cityData.base_price_2012;
      const current = basePrice * (hpi2023 / 100) * Math.pow(1 + 0.05, 2);

      const projections = [];
      const growthRates = [
        { label: 'Conservative', rate: 0.03, color: '#94a3b8' },
        { label: 'Medium', rate: 0.05, color: '#4f46e5' },
        { label: 'Optimistic', rate: 0.08, color: '#f97316' }
      ];

      for (let i = 0; i <= 5; i++) {
        const year = 2025 + i;
        const yearData = { year };
        
        growthRates.forEach(({ label, rate }) => {
          yearData[label] = current * Math.pow(1 + rate, i);
        });
        
        projections.push(yearData);
      }

      const future = current * Math.pow(1 + 0.05, 5);

      setCurrentPrice(current.toLocaleString('en-IN'));
      setFuturePrice(future.toLocaleString('en-IN'));
      setProjectionData(projections);
      
      setCityStats({
        name: cityData.name,
        population: cityData.population || 'N/A',
        growthRate: cityData.annual_growth_rate || 5,
        avgSqftPrice: cityData.avg_sqft_price || Math.round(current / 1000),
        tier: cityData.tier || (hpi2023 > 250 ? 'Tier 1' : hpi2023 > 150 ? 'Tier 2' : 'Tier 3'),
        demand: hpi2023 > 250 ? 'Very High' : hpi2023 > 200 ? 'High' : hpi2023 > 150 ? 'Medium' : 'Moderate'
      });
      
      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (err) {
      setError(`Failed to process data: ${err.message}`);
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} Lac`;
    } else {
      return `₹${value.toLocaleString('en-IN')}`;
    }
  };

  const getPercentageWidth = (value, max) => {
    return (value / max * 100).toFixed(2) + '%';
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <Head>
        <title>Indian Housing Price Predictor | Market Analysis</title>
        <meta name="description" content="Analyze and predict housing prices in major Indian cities with historical data and future projections" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.mainContainer}>
        <div className={styles.headerSection}>
          <h1 className={styles.mainTitle}>
            Indian Real Estate Price Predictor
          </h1>
          <p className={styles.headerDescription}>
            Analyze current property values and get 5-year price projections for major Indian cities
            based on historical Housing Price Index (HPI) data and market trends.
          </p>
        </div>

        <div className={styles.gridContainer}>
          {/* Input card */}
          <div className={styles.inputCard}>
            <h2 className={styles.cardTitle}>
              Select Location
            </h2>
            
            <form onSubmit={calculatePrices} className={styles.form}>
              <div>
                <label htmlFor="city" className={styles.label}>
                  City:
                </label>
                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={styles.select}
                >
                  <option value="">-- Select a city --</option>
                  {hpiData.cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Calculating...' : 'Calculate Prices'}
              </button>
            </form>

            {error && (
              <div className={styles.errorMessage}>
                <p className={styles.errorText}>{error}</p>
              </div>
            )}

            {loading && (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
              </div>
            )}

            {cityStats && !loading && (
              <div className={styles.cityStats}>
                <h3 className={styles.statsTitle}>
                  {cityStats.name} Market Overview
                </h3>
                <ul className={styles.statsList}>
                  <li className={styles.statsItem}>
                    <span className={styles.statsLabel}>Market Category:</span>
                    <span className={styles.statsValue}>{cityStats.tier}</span>
                  </li>
                  <li className={styles.statsItem}>
                    <span className={styles.statsLabel}>Demand Level:</span>
                    <span className={styles.statsValue}>{cityStats.demand}</span>
                  </li>
                  <li className={styles.statsItem}>
                    <span className={styles.statsLabel}>Avg. Price (per sq.ft):</span>
                    <span className={styles.statsValue}>₹{cityStats.avgSqftPrice.toLocaleString('en-IN')}</span>
                  </li>
                  <li className={styles.statsItem}>
                    <span className={styles.statsLabel}>YoY Growth Rate:</span>
                    <span className={styles.statsValue}>{cityStats.growthRate}%</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Results card */}
          <div className={styles.resultsCard}>
            {currentPrice && !loading ? (
              <div>
                <h2 className={styles.cardTitle}>
                  Price Analysis for {city}
                </h2>
                
                <div className={styles.priceGrid}>
                  <div className={styles.currentPrice}>
                    <h3 className={styles.priceLabel}>Current Average Price (2025)</h3>
                    <p className={styles.priceValue}>₹{currentPrice}</p>
                  </div>
                  
                  <div className={styles.futurePrice}>
                    <h3 className={styles.priceLabel}>Projected Price (2030)</h3>
                    <p className={styles.priceValue}>₹{futurePrice}</p>
                    <p className={styles.priceNote}>Based on 5% annual growth</p>
                  </div>
                </div>

                {projectionData.length > 0 && (
                  <div className={styles.projectionSection}>
                    <h3 className={styles.sectionTitle}>Price Trend Projection</h3>
                    
                    <div className={styles.tableContainer}>
                      <table className={styles.table}>
                        <thead className={styles.tableHeader}>
                          <tr>
                            <th className={styles.tableHeaderCell}>Year</th>
                            <th className={styles.tableHeaderCell}>Conservative (3%)</th>
                            <th className={styles.tableHeaderCell}>Medium (5%)</th>
                            <th className={styles.tableHeaderCell}>Optimistic (8%)</th>
                          </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                          {projectionData.map((data, index) => (
                            <tr key={index} className={index === 0 ? styles.tableRowCurrent : styles.tableRow}>
                              <td className={styles.tableCell}>{data.year}</td>
                              <td className={styles.tableCell}>{formatPrice(data.Conservative)}</td>
                              <td className={styles.tableCellMedium}>{formatPrice(data.Medium)}</td>
                              <td className={styles.tableCell}>{formatPrice(data.Optimistic)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className={styles.barCharts}>
                      <div>
                        <div className={styles.barLabel}>
                          <span className={styles.barTitle}>Current (2025)</span>
                          <span>{formatPrice(projectionData[0].Medium)}</span>
                        </div>
                        <div className={styles.barContainer}>
                          <div className={styles.bar} style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className={styles.barLabel}>
                          <span className={styles.barTitle}>Medium Growth (2030)</span>
                          <span>{formatPrice(projectionData[5].Medium)}</span>
                        </div>
                        <div className={styles.barContainer}>
                          <div className={styles.bar} style={{ width: '40%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className={styles.barLabel}>
                          <span className={styles.barTitle}>Optimistic Growth (2030)</span>
                          <span>{formatPrice(projectionData[5].Optimistic)}</span>
                        </div>
                        <div className={styles.barContainer}>
                          <div className={styles.barOptimistic} style={{ width: '55%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <p className={styles.projectionNote}>
                      Projections show estimated prices based on three different growth scenarios.
                    </p>
                  </div>
                )}

                <div className={styles.insightsSection}>
                  <h3 className={styles.sectionTitle}>Investment Insights</h3>
                  <p className={styles.insightsText}>
                    Based on historical trends and current market indicators, property in {city} is projected 
                    to appreciate by approximately 27.6% over the next 5 years.
                  </p>
                  <div className={styles.insightsGrid}>
                    <div className={styles.insightItem}>
                      <div className={styles.insightIconBlue}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div className={styles.insightContent}>
                        <h4 className={styles.insightTitle}>Annual ROI</h4>
                        <p className={styles.insightValue}>5% (Medium Growth)</p>
                      </div>
                    </div>
                    <div className={styles.insightItem}>
                      <div className={styles.insightIconGreen}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                      </div>
                      <div className={styles.insightContent}>
                        <h4 className={styles.insightTitle}>Rental Yield</h4>
                        <p className={styles.insightValue}>2.5% - 3.5% (Estimated)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : !loading ? (
              <div className={styles.noCitySelected}>
                <img src="/api/placeholder/400/300" alt="Select a city to view price analysis" className={styles.placeholderImage} />
                <h3 className={styles.noCityTitle}>No city selected</h3>
                <p className={styles.noCityText}>
                  Select a city from the dropdown and click "Calculate Prices" to view 
                  the real estate market analysis and price predictions.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Market comparison section */}
        <div className={styles.comparisonSection}>
          <h2 className={styles.cardTitle}>
            Top Real Estate Markets Comparison
          </h2>
          
          {topCities.length > 0 && (
            <div className={styles.comparisonBars}>
              {topCities.map((city, index) => {
                const maxPrice = Math.max(...topCities.map(c => c.price));
                const percentWidth = getPercentageWidth(city.price, maxPrice);
                
                return (
                  <div key={index}>
                    <div className={styles.comparisonLabel}>
                      <span className={styles.comparisonCity}>{city.name}</span>
                      <span>{formatPrice(city.price)}</span>
                    </div>
                    <div className={styles.comparisonBarContainer}>
                      <div 
                        className={styles.comparisonBar}
                        style={{ width: percentWidth }}
                      >
                        {percentWidth}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <p className={styles.comparisonNote}>
            Comparison of average property prices across top Indian real estate markets in 2023.
          </p>
        </div>
        
        {/* FAQ section */}
        <div className={styles.faqSection}>
          <h2 className={styles.cardTitle}>
            Frequently Asked Questions
          </h2>
          
          <div className={styles.faqContainer}>
            <div>
              <h3 className={styles.faqQuestion}>
                How is the future price calculated?
              </h3>
              <p className={styles.faqAnswer}>
                Future prices are calculated using compound growth applied to current property values. 
                We use a baseline growth rate of 5% annually (medium scenario), which is the typical 
                long-term appreciation rate for Indian real estate. We also show conservative (3%) 
                and optimistic (8%) scenarios for a more comprehensive view.
              </p>
            </div>
            
            <div>
              <h3 className={styles.faqQuestion}>
                What is the Housing Price Index (HPI)?
              </h3>
              <p className={styles.faqAnswer}>
                The Housing Price Index (HPI) is a measure that tracks changes in residential property 
                prices over time. It provides a way to monitor trends in the housing market and compare 
                price changes between different cities and regions.
              </p>
            </div>
            
            <div>
              <h3 className={styles.faqQuestion}>
                Are these prices accurate for all neighborhoods?
              </h3>
              <p className={styles.faqAnswer}>
                The prices shown represent city-wide averages and can vary significantly between 
                different neighborhoods and property types. Premium locations may command prices 
                30-100% higher than the city average, while developing areas might be priced below 
                the average.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}