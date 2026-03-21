#!/bin/bash

# Certificate Verification System - Setup Script
# This script helps you set up the project quickly

set -e

echo "🎓 Certificate Verification System - Setup"
echo "=========================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm $(npm --version)"

# Check Foundry
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry is not installed."
    echo "Install with: curl -L https://foundry.paradigm.xyz | bash && foundryup"
    exit 1
fi
echo "✅ Foundry $(forge --version | head -n 1)"

echo ""
echo "📦 Installing dependencies..."
echo ""

# Setup contracts
echo "Setting up smart contracts..."
cd contracts
forge install
echo "✅ Smart contract dependencies installed"
cd ..

# Setup frontend
echo ""
echo "Setting up frontend..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"
cd ..

echo ""
echo "📝 Creating environment files..."

# Create contracts .env if not exists
if [ ! -f contracts/.env ]; then
    cp contracts/.env.example contracts/.env
    echo "✅ Created contracts/.env (please edit with your values)"
else
    echo "⚠️  contracts/.env already exists"
fi

# Create frontend .env.local if not exists
if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local (please edit with your values)"
else
    echo "⚠️  frontend/.env.local already exists"
fi

echo ""
echo "🧪 Running tests..."
cd contracts
forge test
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo ""
echo "1. Edit contracts/.env with your private key and RPC URL"
echo "   cd contracts"
echo "   nano .env"
echo ""
echo "2. Deploy the smart contract:"
echo "   source .env"
echo "   forge script script/Deploy.s.sol --rpc-url \$BASE_SEPOLIA_RPC_URL --broadcast"
echo ""
echo "3. Edit frontend/.env.local with contract address and Pinata JWT"
echo "   cd ../frontend"
echo "   nano .env.local"
echo ""
echo "4. Start the frontend:"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - README.md"
echo "   - QUICKSTART.md"
echo "   - DEPLOYMENT.md"
echo ""
