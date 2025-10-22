"use strict";

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        // Load the connection profile
        const ccpPath = path.resolve(__dirname, 'samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // CA info
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`✅ Wallet path: ${walletPath}`);

        // Check if appUser exists
        const userExists = await wallet.get('appUser');
        if (userExists) {
            console.log('✔️  An identity for "appUser" already exists in the wallet');
            return;
        }

        // Check if admin exists
        const adminExists = await wallet.get('admin');
        if (!adminExists) {
            console.log('⚠️  Admin identity not found, run importAdmin.js first');
            return;
        }

        // Build admin user object for authenticating with CA
        const provider = wallet.getProviderRegistry().getProvider(adminExists.type);
        const adminUser = await provider.getUserContext(adminExists, 'admin');

        // Register and enroll appUser
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: 'appUser',
            role: 'client'
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: 'appUser',
            enrollmentSecret: secret
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes()
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        };

        await wallet.put('appUser', x509Identity);
        console.log('🎉 Successfully registered and enrolled appUser into the wallet');

    } catch (error) {
        console.error(`❌ Failed to populate wallet: ${error}`);
        process.exit(1);
    }
}

main();
