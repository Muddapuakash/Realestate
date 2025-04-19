/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        net: false,
        tls: false,
        fs: false,
        module: false,
      };
    }
    return config;
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
module.exports = {
  env: {
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL
  }

}
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'mongodb': false,
        'child_process': false
      };
    }
    return config;
  }
};

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*'
      }
    ]
  }
}


