const path = require('path');
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, '../samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');

async function connectToNetwork() {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet.get('appUser');

    if (!identity) {
        throw new Error('❌ appUser identity not found in wallet. Register the user first.');
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('id-cc');
    return { gateway, contract };
}

module.exports = { connectToNetwork };
