/**
 * importAdmin.js
 * Imports Org1 Admin cert & key from the test-network MSP into the wallet as identity 'admin'
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets } = require('fabric-network');

async function main() {
  try {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log('Wallet path:', walletPath);

    // MSP path for Org1 Admin in the Fabric samples test-network
    const mspPath = path.join(process.cwd(), 'samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'users', 'Admin@org1.example.com', 'msp');

    const certPath = path.join(mspPath, 'signcerts', 'Admin@org1.example.com-cert.pem');
    const keyDir = path.join(mspPath, 'keystore');
    const keyFiles = fs.readdirSync(keyDir);
    if (keyFiles.length === 0) {
      throw new Error('No key file found in ' + keyDir);
    }
    const keyPath = path.join(keyDir, keyFiles[0]);

    const certificate = fs.readFileSync(certPath, 'utf8');
    const privateKey = fs.readFileSync(keyPath, 'utf8');

    const identity = {
      credentials: {
        certificate,
        privateKey
      },
      mspId: 'Org1MSP',
      type: 'X.509'
    };

    await wallet.put('admin', identity);
    console.log("✅ Imported 'admin' identity into the wallet");
  } catch (err) {
    console.error('❌ Failed to import admin identity:', err);
    process.exit(1);
  }
}

main();
