import { ethers } from 'ethers';

// Simple ABI for a document verification smart contract
const DocumentVerificationABI = [
  // Function to store a document hash
  "function storeDocumentHash(string memory documentHash, string memory metadata) public returns (uint256)",
  // Function to verify if a document hash exists
  "function verifyDocumentHash(string memory documentHash) public view returns (bool, uint256, string memory, address)"
];

// Configure your contract and network details here
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'sepolia'; // Default to Sepolia testnet

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Check if window is defined (browser environment)
      if (typeof window !== 'undefined' && window.ethereum) {
        // Create a provider from MetaMask
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Get the signer
        this.signer = this.provider.getSigner();
        
        // Create contract instance
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          DocumentVerificationABI,
          this.signer
        );
        
        this.initialized = true;
      } else {
        // Fallback to a read-only provider if MetaMask is not available
        this.provider = ethers.getDefaultProvider(NETWORK);
        
        // Create read-only contract instance
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          DocumentVerificationABI,
          this.provider
        );
        
        this.initialized = true;
      }
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw new Error('Failed to connect to blockchain. Please ensure MetaMask is installed and connected.');
    }
  }

  async storeDocumentHash(hash, metadata = '') {
    await this.init();
    
    if (!this.signer) {
      throw new Error('Wallet not connected. Please connect your wallet to store document hashes.');
    }
    
    try {
      const tx = await this.contract.storeDocumentHash(hash, metadata);
      const receipt = await tx.wait();
      
      // Get the transaction hash and block explorer URL
      const txHash = receipt.transactionHash;
      const explorerUrl = this.getExplorerUrl(txHash);
      
      return {
        transactionHash: txHash,
        blockNumber: receipt.blockNumber,
        explorerUrl
      };
    } catch (error) {
      console.error('Error storing document hash:', error);
      throw new Error(error.message || 'Failed to store document on blockchain');
    }
  }

  async verifyDocumentHash(hash) {
    await this.init();
    
    try {
      // Call the verification function
      const [exists, timestamp, metadata, uploader] = await this.contract.verifyDocumentHash(hash);
      
      if (!exists) {
        return { verified: false };
      }
      
      return {
        verified: true,
        timestamp: new Date(timestamp.toNumber() * 1000), // Convert from Unix timestamp
        metadata,
        uploader
      };
    } catch (error) {
      console.error('Error verifying document hash:', error);
      throw new Error('Failed to verify document on blockchain');
    }
  }

  getExplorerUrl(txHash) {
    // Get block explorer URL based on the network
    const explorers = {
      'mainnet': 'https://etherscan.io',
      'sepolia': 'https://sepolia.etherscan.io',
      'goerli': 'https://goerli.etherscan.io',
      'polygon': 'https://polygonscan.com',
      'mumbai': 'https://mumbai.polygonscan.com',
    };
    
    const baseUrl = explorers[NETWORK] || explorers['sepolia'];
    return `${baseUrl}/tx/${txHash}`;
  }

  async getWalletInfo() {
    await this.init();
    
    if (!this.signer) {
      return { connected: false };
    }
    
    try {
      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      
      return {
        connected: true,
        address,
        balance: ethers.utils.formatEther(balance)
      };
    } catch (error) {
      console.error('Error getting wallet info:', error);
      return { connected: false, error: error.message };
    }
  }
}

// Export a singleton instance
const blockchainService = new BlockchainService();
export default blockchainService;