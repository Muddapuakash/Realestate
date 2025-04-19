// pages/api/transactions.js
export default function handler(req, res) {
    // Mock transaction data
    const transactions = [
      {
        txHash: '0x7834f32e9f151c9385c30a9f4db0b9a148cc7e1a2b0b697ae12483c2e7614862',
        timestamp: Date.now() - 86400000, // yesterday
        type: 'Investment',
        status: 'Completed'
      },
      {
        txHash: '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
        timestamp: Date.now() - 172800000, // 2 days ago
        type: 'Withdrawal',
        status: 'Pending'
      },
      {
        txHash: '0x9137a5a83e4bccce91e5d1922b6849b70e31f8c47592cdad0a8e8214d71bd93c',
        timestamp: Date.now() - 345600000, // 4 days ago
        type: 'Investment',
        status: 'Completed'
      },
      {
        txHash: '0x0d835e432857ddba60cfd52a6c95c7a5e586025be26c1e0cf4048d8c3de3c79e',
        timestamp: Date.now() - 518400000, // 6 days ago
        type: 'Deposit',
        status: 'Completed'
      },
      {
        txHash: '0x88dfb5c334914e94be522ca83e98afba2be6de5545c76d7fde9cb53c322b150c',
        timestamp: Date.now() - 604800000, // 7 days ago
        type: 'Investment',
        status: 'Completed'
      }
    ];
  
    res.status(200).json({ transactions });
  }