import styles from '../styles/Transactions.module.css';
import { useState, useEffect } from 'react';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/transactions');
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      // Try to parse as JSON, with error handling
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
        setTransactions(data.transactions || []);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample mock data to use until API is working
  const mockTransactions = [
    {
      txHash: '0x1234...abcd',
      timestamp: Date.now() - 86400000, // yesterday
      type: 'Investment',
      status: 'Completed'
    },
    {
      txHash: '0x5678...efgh',
      timestamp: Date.now() - 172800000, // 2 days ago
      type: 'Withdrawal',
      status: 'Pending'
    },
    {
      txHash: '0x91011...ijkl',
      timestamp: Date.now() - 345600000, // 4 days ago
      type: 'Investment',
      status: 'Completed'
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Transaction History</h1>
      <p className={styles.subtitle}>
        View all your past transactions and investments.
      </p>
      
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <div className={styles.error}>
          <p>Error loading transactions: {error}</p>
          <p>Displaying mock data instead</p>
          <div className={styles.transactionList}>
            {mockTransactions.map((tx, index) => (
              <div key={index} className={styles.transactionItem}>
                <p className={styles.txHash}>Hash: {tx.txHash}</p>
                <p className={styles.txDate}>Date: {new Date(tx.timestamp).toLocaleString()}</p>
                <p className={styles.txType}>Type: {tx.type}</p>
                <p className={styles.txStatus}>Status: {tx.status}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.transactionList}>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            transactions.map((tx, index) => (
              <div key={index} className={styles.transactionItem}>
                <p className={styles.txHash}>Hash: {tx.txHash}</p>
                <p className={styles.txDate}>Date: {new Date(tx.timestamp).toLocaleString()}</p>
                <p className={styles.txType}>Type: {tx.type}</p>
                <p className={styles.txStatus}>Status: {tx.status}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}