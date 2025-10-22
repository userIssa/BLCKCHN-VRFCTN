#!/bin/bash

# ==============================================
# Full Fabric Automation Script
# Sets up test network, wallets, and backend
# ==============================================

set -e  # Exit on any error

echo "🚀 Starting full Hyperledger Fabric setup..."

# =========================
# Step 0: Environment Setup
# =========================

export FABRIC_CFG_PATH=$PWD/config
echo "🔧 FABRIC_CFG_PATH set to $FABRIC_CFG_PATH"

# =========================
# Step 1: Bring up the test network
# =========================

cd samples/test-network
echo "🛠 Bringing down any existing network..."
./network.sh down || true

echo "🛠 Starting test network with CA..."
./network.sh up createChannel -ca

echo "✅ Test network is up"
cd ../../

# =========================
# Step 2: Prepare connection profile
# =========================

if [ ! -f "connection-profile/network-connection.yaml" ]; then
    echo "⚠️  connection-profile/network-connection.yaml missing, creating from template..."
    mkdir -p connection-profile
    cp samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml connection-profile/network-connection.yaml
fi

# =========================
# Step 3: Import Admin identity
# =========================

echo "🔑 Importing admin identity..."
node importAdmin.js || { echo "❌ Failed to import admin identity"; exit 1; }

# =========================
# Step 4: Populate Wallet (appUser)
# =========================

echo "👤 Populating wallet with appUser..."
node populateWallet.js || echo "⚠️ appUser may already exist"

# =========================
# Step 5: Set Org1 and Org2 peer environment variables
# =========================

# Org1 peer
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/samples/test-network/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem
export CORE_PEER_MSPCONFIGPATH=$PWD/wallet
export CORE_PEER_ADDRESS=localhost:7051

# Org2 peer
export CORE_PEER2_LOCALMSPID="Org2MSP"
export CORE_PEER2_TLS_ROOTCERT_FILE=$PWD/samples/test-network/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem
export CORE_PEER2_MSPCONFIGPATH=$PWD/wallet
export CORE_PEER2_ADDRESS=localhost:9051

echo "✅ Org environment variables set for peer CLI"

# =========================
# Step 6: Verify wallet
# =========================

echo "📂 Wallet contents:"
ls wallet || echo "❌ Wallet directory missing"

# =========================
# Step 7: Ready to run backend
# =========================

echo "🎉 Fabric setup complete!"
echo "Run 'node server.js' to start the backend and test uploads/queries."
