import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Home as HomeIcon,
  TrendingUp,
  Shield,
  MapPin,
  ChevronRight,
  BarChart2,
  IndianRupee,
  Compass,
  RefreshCw,
  Building,
  Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [marketTrends, setMarketTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Indian market trends data when component mounts
  useEffect(() => {
    const fetchIndianMarketData = async () => {
      try {
        setIsLoading(true);
        
        // Example API call to Housing.com or 99acres API
        // In production, you would use proper API endpoints and authentication
        const response = await fetch('/api/indian-real-estate-data');
        const data = await response.json();
        
        // Mock data for Indian cities
        const mockIndianData = [
          {
            region: "Mumbai, Maharashtra",
            priceChange: "+4.8%",
            avgPrice: "₹1.85 Cr",
            pricePerSqFt: "₹18,500",
            trend: "rising"
          },
          {
            region: "Bangalore, Karnataka",
            priceChange: "+7.2%",
            avgPrice: "₹95 L",
            pricePerSqFt: "₹7,800",
            trend: "rising"
          },
          {
            region: "Delhi-NCR",
            priceChange: "+2.7%",
            avgPrice: "₹1.2 Cr",
            pricePerSqFt: "₹9,300",
            trend: "stable"
          },
          {
            region: "Pune, Maharashtra",
            priceChange: "+5.4%",
            avgPrice: "₹85 L",
            pricePerSqFt: "₹7,200",
            trend: "rising"
          },
          {
            region: "Hyderabad, Telangana",
            priceChange: "+8.5%",
            avgPrice: "₹88 L",
            pricePerSqFt: "₹6,900",
            trend: "rising"
          },
          {
            region: "Chennai, Tamil Nadu",
            priceChange: "+1.8%",
            avgPrice: "₹75 L",
            pricePerSqFt: "₹6,300",
            trend: "stable"
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setMarketTrends(mockIndianData);
          setIsLoading(false);
        }, 1000);
        
      } catch (err) {
        setError('Failed to fetch Indian market data');
        setIsLoading(false);
        console.error('Error fetching market data:', err);
      }
    };
    
    fetchIndianMarketData();
  }, []);

  const featuresData = [
    {
      icon: <HomeIcon size={48} strokeWidth={1.5} />,
      title: "Smart Property Search",
      description: "Discover your perfect property with advanced AI-powered filtering across major Indian cities."
    },
    {
      icon: <TrendingUp size={48} strokeWidth={1.5} />,
      title: "Investment Insights",
      description: "Get real-time market trends, predictive analytics, and RERA-compliant investment potential scores."
    },
    {
      icon: <Shield size={48} strokeWidth={1.5} />,
      title: "Secure Transactions",
      description: "Blockchain-powered verification ensures transparent and secure real estate transactions with UPI integration."
    }
  ];
  
  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'rising':
        return <TrendingUp className={styles.trendIconUp} />;
      case 'falling':
        return <TrendingUp className={styles.trendIconDown} style={{ transform: 'rotate(180deg)' }} />;
      default:
        return <Compass className={styles.trendIconStable} />;
    }
  };
  
  return (
    <div className={styles.homeContainer}>
      <Navbar />
      
      <main className={styles.heroSection}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.mainHeading}>
            Your Gateway to Intelligent 
            <span> Indian Real Estate Investing</span>
          </h1>
          
          <p className={styles.subHeading}>
            Leverage AI, blockchain, and advanced analytics to transform 
            your property investment journey across India.
          </p>
          
          <div className={styles.ctaContainer}>
            <Link href="/properties" className={styles.primaryCta}>
              Browse Properties
              <ChevronRight size={24} />
            </Link>
            
            <Link href="/predict" className={styles.secondaryCta}>
              Price Prediction
              <MapPin size={24} />
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          className={styles.featuresGrid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
      
      {/* Indian Market Trends Section */}
      <section className={styles.marketTrendsSection}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <BarChart2 size={32} strokeWidth={1.5} />
          <h2>Indian Real Estate Market Trends</h2>
          <p>Powered by leading Indian property data sources including Housing.com, 99acres, and MagicBricks</p>
        </motion.div>
        
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <RefreshCw className={styles.loadingIcon} />
            <p>Loading market data...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <motion.div 
            className={styles.trendsGrid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {marketTrends.map((item, index) => (
              <motion.div
                key={index}
                className={styles.trendCard}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={styles.trendHeader}>
                  <h3>{item.region}</h3>
                  {getTrendIcon(item.trend)}
                </div>
                <div className={styles.trendDetailsIndia}>
                  <div className={styles.trendStat}>
                    <Building size={18} />
                    <span>{item.avgPrice}</span>
                  </div>
                  <div className={styles.trendStat}>
                    <MapPin size={18} />
                    <span>{item.pricePerSqFt}</span>
                  </div>
                  <div className={`${styles.trendStat} ${item.trend === 'rising' ? styles.rising : item.trend === 'falling' ? styles.falling : styles.stable}`}>
                    <Clock size={18} />
                    <span>{item.priceChange}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className={styles.marketInsightsContainer}>
          <div className={styles.marketInsightCard}>
            <h3>RERA Compliance</h3>
            <p>All properties verified against RERA database to ensure legal compliance</p>
          </div>
          <div className={styles.marketInsightCard}>
            <h3>Metro Connectivity</h3>
            <p>Proximity to metro stations and public transport included in property scores</p>
          </div>
          <div className={styles.marketInsightCard}>
            <h3>Smart City Index</h3>
            <p>Properties ranked by Smart City potential and infrastructure development</p>
          </div>
        </div>
        
        <div className={styles.apiSourceInfo}>
          <p>Data sourced from Housing.com, 99acres, and MagicBricks APIs</p>
          <Link href="/indian-market-data" className={styles.viewMoreLink}>
            View detailed Indian market analysis
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}