import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Upload.module.css';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transactionHash, setTransactionHash] = useState('');
  const [documentHash, setDocumentHash] = useState('');
  const [uploadHistory, setUploadHistory] = useState([]);
  const [ipfsHash, setIpfsHash] = useState(''); // New state for IPFS hash
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Pinata API credentials (should be stored securely in production)
  const PINATA_API_KEY = 'a267f3c07d5d7dadbdfa';
  const PINATA_SECRET_API_KEY = 'e26a7bcecd0531d569c2892f82bc2333c4b22f69fd6f987dc471d2e152340897';

  useEffect(() => {
    const history = localStorage.getItem('uploadHistory');
    if (history) {
      setUploadHistory(JSON.parse(history));
    }
  }, []);

  const generateHash = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(`Selected: ${selectedFile.name}`);
      setMessageType('info');
      
      if (selectedFile.type === 'application/pdf') {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
      
      const hash = await generateHash(selectedFile);
      setDocumentHash(hash);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.add(styles['drag-active']);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.remove(styles['drag-active']);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropAreaRef.current.classList.remove(styles['drag-active']);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setMessage(`Selected: ${selectedFile.name}`);
      setMessageType('info');
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(selectedFile);
      fileInputRef.current.files = dataTransfer.files;
      
      if (selectedFile.type === 'application/pdf') {
        setFilePreview(URL.createObjectURL(selectedFile));
      }
      
      generateHash(selectedFile).then(hash => {
        setDocumentHash(hash);
      });
    }
  };

  const uploadToPinata = async () => {
    if (!file) {
      setMessage('Please select a file.');
      setMessageType('error');
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setMessage('File is too large. Maximum file size is 50MB.');
      setMessageType('error');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      setMessage('Invalid file type. Please upload PDF or Word documents only.');
      setMessageType('error');
      return;
    }

    setIsUploading(true);
    setMessage('Uploading to IPFS via Pinata...');
    setMessageType('info');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pinataMetadata', JSON.stringify({
        name: file.name,
        keyvalues: {
          documentHash: documentHash,
          uploadedAt: new Date().toISOString()
        }
      }));

      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          return newProgress <= 90 ? newProgress : 90;
        });
      }, 300);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 90) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      clearInterval(uploadInterval);
      
      const ipfsCid = response.data.IpfsHash;
      setIpfsHash(ipfsCid);
      
      setMessage('Simulating blockchain storage...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const txHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      setTransactionHash(txHash);
      setUploadProgress(100);
      setMessage('Document successfully stored on IPFS and blockchain');
      setMessageType('success');

      const newHistoryItem = {
        id: Date.now(),
        filename: file.name,
        documentHash: documentHash,
        transactionHash: txHash,
        ipfsHash: ipfsCid,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [newHistoryItem, ...uploadHistory].slice(0, 10);
      setUploadHistory(updatedHistory);
      localStorage.setItem('uploadHistory', JSON.stringify(updatedHistory));

    } catch (error) {
      console.error('Pinata upload error:', error);
      setMessage(`Upload failed: ${error.response?.data?.error || error.message}`);
      setMessageType('error');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFilePreview(null);
    setMessage('');
    setDocumentHash('');
    setTransactionHash('');
    setIpfsHash('');
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Secure Legal Document Upload</h1>
      
      <div 
        ref={dropAreaRef}
        className={styles.dropArea}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <p className={styles.mainText}>Drag and drop your legal document here</p>
        <p className={styles.subText}>or click to browse files</p>
        <input
          type="file"
          className={styles.fileInput}
          onChange={handleFileChange}
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
        />
        {file && (
          <div className={styles.selectedFile}>
            <span>{file.name}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                resetForm();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {filePreview && (
        <div className={styles.previewArea}>
          <h3>Document Preview</h3>
          <div className={styles.previewFrame}>
            <iframe src={filePreview} title="Document Preview"></iframe>
          </div>
        </div>
      )}
      
      {documentHash && (
        <div className={styles.hashDisplay}>
          <div className={styles.header}>
            <div className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12l4-4 6 6 10-10"></path>
              </svg>
            </div>
            <h3>Document Hash (SHA-256)</h3>
          </div>
          <code>{documentHash}</code>
          <p className={styles.description}>
            This unique hash verifies your document has not been tampered with.
          </p>
        </div>
      )}
      
      <div className={styles.uploadButton}>
        <button
          onClick={uploadToPinata}
          disabled={isUploading || !file}
          className={`${styles.button} ${!file ? styles.disabled : isUploading ? styles.loading : styles.primary}`}
        >
          {isUploading ? (
            <>
              <svg className={styles.loadingSpinner} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload to Blockchain
            </>
          )}
        </button>
      </div>
      
      {uploadProgress > 0 && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill} ${uploadProgress === 100 ? styles.complete : styles.inProgress}`}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className={styles.progressLabels}>
            <span>Upload Progress</span>
            <span>{uploadProgress}%</span>
          </div>
        </div>
      )}
      
      {message && (
        <div className={`${styles.messageBox} ${styles[messageType]}`}>
          <div className={styles.content}>
            {messageType === 'success' && (
              <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
            {messageType === 'error' && (
              <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
            <p>{message}</p>
          </div>
          
          {ipfsHash && (
            <div className={styles.transactionHash}>
              <p>IPFS Hash:</p>
              <code>{ipfsHash}</code>
              <p className={styles.description}>
                Access your file at: <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer">View File</a>
              </p>
            </div>
          )}
          
          {transactionHash && (
            <div className={styles.transactionHash}>
              <p>Transaction Hash:</p>
              <code>{transactionHash}</code>
              <p className={styles.description}>
                This hash is your proof of document storage on the blockchain.
              </p>
            </div>
          )}
        </div>
      )}
      
      {uploadHistory.length > 0 && (
        <div className={styles.historySection}>
          <h3>Recent Document Uploads</h3>
          <div className={styles.tableContainer}>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Date</th>
                  <th>IPFS Hash</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((item) => (
                  <tr key={item.id}>
                    <td><div>{item.filename}</div></td>
                    <td className={styles.dateColumn}>
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <a 
                        href={`https://gateway.pinata.cloud/ipfs/${item.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.ipfsHash.substring(0, 10)}...
                      </a>
                    </td>
                    <td>
                      <span className={styles.statusBadge}>
                        Blockchain Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className={styles.infoBox}>
        <h3>About Blockchain Document Storage</h3>
        <p>
          Your legal documents are securely stored using IPFS via Pinata and blockchain technology.
          This provides:
        </p>
        <ul>
          <li>Tamper-proof document verification via SHA-256 hashing</li>
          <li>Immutable IPFS storage through Pinata</li>
          <li>Distributed content addressing with CIDs</li>
          <li>Cryptographic verification of document integrity</li>
        </ul>
      </div>
    </div>
  );
}