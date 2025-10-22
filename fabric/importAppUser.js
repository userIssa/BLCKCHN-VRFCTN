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

    // certificate file (some setups use cert.pem, some Admin@... file — handle both)
    const certCandidates = [
      path.join(mspPath, 'signcerts', 'cert.pem'),
      path.join(mspPath, 'signcerts', 'Admin@org1.example.com-cert.pem')
    ];
    let certPath = certCandidates.find(p => fs.existsSync(p));
    if (!certPath) throw new Error('Admin cert not found at expected path(s): ' + certCandidates.join(', '));

    const keyDir = path.join(mspPath, 'keystore');
    const keyFiles = fs.readdirSync(keyDir).filter(f => !f.startsWith('.'));
    if (keyFiles.length === 0) throw new Error('No key file found in ' + keyDir);
    const keyPath = path.join(keyDir, keyFiles[0]);

    const certificate = fs.readFileSync(certPath, 'utf8');
    const privateKey = fs.readFileSync(keyPath, 'utf8');

    const identity = {
      credentials: { certificate, privateKey },
      mspId: 'Org1MSP',
      type: 'X.509'
    };

    // Put as appUser
    await wallet.put('appUser', identity);
    console.log("✅ Imported 'appUser' identity into the wallet");
  } catch (err) {
    console.error('❌ Failed to import appUser identity:', err);
    process.exit(1);
  }
}

main();
