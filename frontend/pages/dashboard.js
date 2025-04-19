import { useState } from 'react';
import { 
  Home, 
  DollarSign, 
  FileText, 
  Upload as UploadIcon,
  BarChart2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Upload from '../pages/upload';
import Verify from '../pages/verify';
import Predict from '../pages/predict';
 import Transactions from '../pages/transactions'

// Create a style object for CSS-in-JS approach
const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  dashboardContent: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #e9ecef',
    padding: '1.5rem',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  profileImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    overflow: 'hidden',
    marginRight: '1rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
  },
  userEmail: {
    margin: '0.25rem 0 0',
    fontSize: '0.875rem',
    color: '#6c757d',
  },
  sidebarNav: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginBottom: '0.5rem',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    background: 'none',
    borderRadius: '0.375rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  navButtonActive: {
    backgroundColor: '#0d6efd',
    color: 'white',
  },
  navButtonHover: {
    backgroundColor: '#e9ecef',
  },
  navButtonText: {
    marginLeft: '0.75rem',
  },
  mainContent: {
    flex: 1,
    padding: '1.5rem',
  },
  dashboardHeader: {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e9ecef',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 600,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    padding: '1.5rem',
  },
  statTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1rem',
    color: '#6c757d',
    fontWeight: 500,
  },
  statValue: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#212529',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    overflow: 'hidden',
    marginTop: '1.5rem',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableCell: {
    padding: '1rem',
    textAlign: 'left',
    borderBottom: '1px solid #e9ecef',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: 600,
    color: '#495057',
  },
  sectionTitle: {
    margin: '0 0 1.5rem',
    fontSize: '1.25rem',
    fontWeight: 600,
  },
};

// Helper function to format numbers without locale-specific formatting
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Dashboard() {
  // State to control which tab is active
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock user data
  
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    profileImage: "/api/placeholder/150/150",
    accountBalance: 245000,
  };

  // Simplified investment data
  const investments = [
    { id: 1, property: "Prestige Lakeside Habitat", location: "Whitefield, Bangalore", amount: 9500000, currentValue: 11020000, roi: 16.0, status: "active" },
  { id: 2, property: "Sobha Dream Acres", location: "Panathur, Bangalore", amount: 5600000, currentValue: 6384000, roi: 14.0, status: "active" },
  { id: 3, property: "Brigade Meadows", location: "Kanakapura Rd, Bangalore", amount: 4800000, currentValue: 5328000, roi: 11.0, status: "active" },
  { id: 4, property: "Godrej Eternity", location: "Electronic City, Bangalore", amount: 7200000, currentValue: 7776000, roi: 8.0, status: "active" },
  { id: 5, property: "Salarpuria Sattva Aspire", location: "Bannerghatta Rd, Bangalore", amount: 6300000, currentValue: 6867000, roi: 9.0, status: "active" },
  { id: 6, property: "Mantri Serenity", location: "Kannur, Bangalore", amount: 8100000, currentValue: 9315000, roi: 15.0, status: "active" },
  { id: 7, property: "Puravankara Purva Fountain Square", location: "Marathahalli, Bangalore", amount: 5500000, currentValue: 5995000, roi: 9.0, status: "active" },
  { id: 8, property: "Shriram Greenfield", location: "Budigere Cross, Bangalore", amount: 4300000, currentValue: 4601000, roi: 7.0, status: "active" },
  { id: 9, property: "Embassy Edge", location: "Devanahalli, Bangalore", amount: 6800000, currentValue: 7684000, roi: 13.0, status: "active" },
  { id: 10, property: "Provident Sunworth", location: "Mysore Rd, Bangalore", amount: 3800000, currentValue: 4066000, roi: 7.0, status: "active" }
  ];

  // Pre-calculate totals to avoid hydration mismatch
  const totalInvestment = investments.reduce((acc, inv) => acc + inv.amount, 0);
  const totalCurrentValue = investments.reduce((acc, inv) => acc + inv.currentValue, 0);
  const activeProperties = investments.filter(inv => inv.status === "active").length;

  // Function to get nav button styles based on active state
  const getNavButtonStyle = (tabName) => {
    return {
      ...styles.navButton,
      ...(activeTab === tabName ? styles.navButtonActive : {}),
    };
  };

  return (
    <div style={styles.dashboardContainer}>
      <Navbar />
      
      <div style={styles.dashboardContent}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.userProfile}>
            <div style={styles.profileImage}>
              <img src={userData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={styles.userInfo}>
              <h3 style={styles.userName}>{userData.name}</h3>
              <p style={styles.userEmail}>{userData.email}</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav>
            <ul style={styles.sidebarNav}>
              <li style={styles.navItem}>
                <button 
                  onClick={() => setActiveTab("overview")} 
                  style={getNavButtonStyle("overview")}
                >
                  <Home size={20} />
                  <span style={styles.navButtonText}>Overview</span>
                </button>
              </li>
              <li style={styles.navItem}>
                <button 
                  onClick={() => setActiveTab("investments")} 
                  style={getNavButtonStyle("investments")}
                >
                  <DollarSign size={20} />
                  <span style={styles.navButtonText}>Investments</span>
                </button>
              </li>
              <li style={styles.navItem}>
                <button 
                  onClick={() => setActiveTab("transactions")} 
                  style={getNavButtonStyle("transactions")}
                >
                  <FileText size={20} />
                  <span style={styles.navButtonText}>Transactions</span>
                </button>
              </li>
              <li style={styles.navItem}>
                <button 
                  onClick={() => setActiveTab("upload")} 
                  style={getNavButtonStyle("upload")}
                >
                  <UploadIcon size={20} />
                  <span style={styles.navButtonText}>Upload</span>
                </button>
              </li>
              <li style={styles.navItem}>
                <button 
                  onClick={() => setActiveTab("verify")} 
                  style={getNavButtonStyle("verify")}
                >
                  <UploadIcon size={20} />
                  <span style={styles.navButtonText}>Verify</span>
                </button>
              </li>
              <li style={styles.navItem}>
                <button 
                  onClick={() => setActiveTab("predict")} 
                  style={getNavButtonStyle("predict")}
                >
                  <BarChart2 size={20} />
                  <span style={styles.navButtonText}>Predict</span>
                </button>
              </li>
              
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main style={styles.mainContent}>
          <header style={styles.dashboardHeader}>
            <h1 style={styles.headerTitle}>Dashboard</h1>
          </header>
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Total Investment</h3>
                  <p style={styles.statValue}>₹{formatNumber(totalInvestment)}</p>
                </div>
                
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Current Value</h3>
                  <p style={styles.statValue}>₹{formatNumber(totalCurrentValue)}</p>
                </div>
                
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Properties</h3>
                  <p style={styles.statValue}>{activeProperties}</p>
                </div>
                
                <div style={styles.statCard}>
                  <h3 style={styles.statTitle}>Available Funds</h3>
                  <p style={styles.statValue}>₹{formatNumber(userData.accountBalance)}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Investments Tab */}
          {activeTab === "investments" && (
            <div>
              <h2 style={styles.sectionTitle}>Your Investment Portfolio</h2>
              <div style={styles.tableContainer}>
                <table style={styles.dataTable}>
                  <thead>
                    <tr>
                      <th style={{...styles.tableCell, ...styles.tableHeader}}>Property</th>
                      <th style={{...styles.tableCell, ...styles.tableHeader}}>Location</th>
                      <th style={{...styles.tableCell, ...styles.tableHeader}}>Amount</th>
                      <th style={{...styles.tableCell, ...styles.tableHeader}}>Current Value</th>
                      <th style={{...styles.tableCell, ...styles.tableHeader}}>ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map(investment => (
                      <tr key={investment.id}>
                        <td style={styles.tableCell}>{investment.property}</td>
                        <td style={styles.tableCell}>{investment.location}</td>
                        <td style={styles.tableCell}>₹{formatNumber(investment.amount)}</td>
                        <td style={styles.tableCell}>₹{formatNumber(investment.currentValue)}</td>
                        <td style={styles.tableCell}>{investment.roi}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div>
              <Transactions />
            </div>
          )}
          
          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div>
              <Upload />
            </div>
          )}
          
          {/* Verify Tab */}
          {activeTab === "verify" && (
            <div>
              <Verify />
            </div>
          )}

          {/* Predict Tab */}
          {activeTab === "predict" && (
            <div>
              <Predict />
            </div>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}