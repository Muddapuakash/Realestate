import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Verify.module.css';

export default function Verify() {
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);

  const handleVerify = async () => {
    if (!ipfsHash) {
      setVerificationResult('Please enter an IPFS hash.');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);
    setVerificationDetails(null);
    setErrorDetails(null);

    try {
      // Use a public gateway instead of Pinata's authenticated gateway
      const gateway = 'https://ipfs.io/ipfs/';
      const response = await axios.get(
        `${gateway}${ipfsHash}`,
        { 
          responseType: 'blob',
          timeout: 15000 // Add timeout to handle slow requests
        }
      );

      if (response.status === 200) {
        const fileBlob = new Blob([response.data]);
        
        setVerificationResult('✅ File exists on IPFS');
        setVerificationDetails({
          ipfsHash: ipfsHash,
          timestamp: new Date().toLocaleString(),
          fileSize: fileBlob.size,
          gateway: gateway
        });
      }
    } catch (error) {
      console.error('Error verifying IPFS content:', error);
      
      let errorMessage = 'Verification failed';
      
      if (error.response) {
        // Server responded with an error status code
        errorMessage = `Server error: ${error.response.status}`;
        setErrorDetails({
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. The IPFS hash may be invalid or the network may be down.';
      } else {
        // Error in setting up the request
        errorMessage = `Request setup error: ${error.message}`;
      }
      
      setVerificationResult(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to validate IPFS hash format
  const isValidIpfsHash = (hash) => {
    // Basic validation: CIDv0 starts with "Qm" and is 46 chars, CIDv1 has various formats
    return (hash.startsWith('Qm') && hash.length === 46) || 
           (hash.startsWith('b') && hash.length >= 59);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>IPFS Document Verification</h1>

      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Enter IPFS hash"
          className={styles.input}
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
          disabled={isLoading}
        />
        {ipfsHash && !isValidIpfsHash(ipfsHash) && 
          <p className={styles.warning}>This does not  appear to be a valid IPFS hash format.</p>
        }
      </div>

      <div className={styles.buttonGroup}>
        <button
          onClick={handleVerify}
          className={`${styles.button} ${styles.primary}`}
          disabled={isLoading || !ipfsHash}
        >
          {isLoading ? (
            <>
              <svg className={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path>
              </svg>
              Verifying...
            </>
          ) : (
            'Verify IPFS Content'
          )}
        </button>
      </div>

      {verificationResult && (
        <div className={`${styles.resultBox} ${verificationResult.includes('✅') ? styles.success : verificationResult.includes('❌') ? styles.error : ''}`}>
          <p>{verificationResult}</p>
          
          {verificationDetails && (
            <div className={styles.details}>
              {verificationDetails.timestamp && (
                <p><strong>Timestamp:</strong> {verificationDetails.timestamp}</p>
              )}
              {verificationDetails.ipfsHash && (
                <p>
                  <strong>IPFS Hash:</strong> 
                  <a href={`${verificationDetails.gateway}${verificationDetails.ipfsHash}`} target="_blank" rel="noopener noreferrer">
                    {verificationDetails.ipfsHash}
                  </a>
                </p>
              )}
              {verificationDetails.fileSize && (
                <p><strong>File Size:</strong> {(verificationDetails.fileSize / 1024).toFixed(2)} KB</p>
              )}
            </div>
          )}
          
          {errorDetails && (
            <div className={styles.errorDetails}>
              <p><strong>Error Details:</strong></p>
              <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      <div className={styles.infoBox}>
        <h3>About IPFS Verification</h3>
        <p>
          Verify your documents stored on IPFS:
        </p>
        <ul>
          <li>Confirm content existence using IPFS hash</li>
          <li>Access files through public IPFS gateways</li>
          <li>Verify storage integrity</li>
        </ul>
      </div>
    </div>
  );
}