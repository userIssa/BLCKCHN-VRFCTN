'use strict';

const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// --- Helper: Connect to Fabric ---
async function getContract() {
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const ccpPath = path.join(process.cwd(), 'connection-profile', 'network-connection.yaml');
    const ccpYaml = fs.readFileSync(ccpPath, 'utf8');
    const ccp = yaml.load(ccpYaml);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('id-cc');

    return { contract, gateway };
}

// --- Helper: Generate file hash ---
function hashFile(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

// --- Upload Endpoint ---
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'User ID is required' });

        const fileHash = hashFile(req.file.buffer);
        const timestamp = new Date().toISOString();
        const metadata = JSON.stringify({
            userId,
            filename: req.file.originalname,
            hash: fileHash,
            uploadedAt: timestamp
        });

        const { contract, gateway } = await getContract();

        // Check if user already exists
        try {
            await contract.evaluateTransaction('queryIDHash', userId);
            return res.status(409).json({ error: 'User hash already exists. Use /update to modify.' });
        } catch {
            // Not found, safe to create
        }

        await contract.submitTransaction('storeIDHash', userId, metadata);
        await gateway.disconnect();

        res.status(200).json({ message: `File hash for ${userId} stored successfully`, metadata });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to store hash' });
    }
});

// --- Update Endpoint ---
app.put('/update', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'User ID is required' });

        const fileHash = hashFile(req.file.buffer);
        const timestamp = new Date().toISOString();
        const metadata = JSON.stringify({
            userId,
            filename: req.file.originalname,
            hash: fileHash,
            updatedAt: timestamp
        });

        const { contract, gateway } = await getContract();

        // Check if user exists
        try {
            await contract.evaluateTransaction('queryIDHash', userId);
        } catch {
            return res.status(404).json({ error: 'User not found. Use /upload first.' });
        }

        await contract.submitTransaction('updateIDHash', userId, metadata);
        await gateway.disconnect();

        res.status(200).json({ message: `File hash for ${userId} updated successfully`, metadata });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Failed to update hash' });
    }
});

// --- Query Endpoint ---
app.get('/query/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { contract, gateway } = await getContract();

        let result;
        try {
            result = await contract.evaluateTransaction('queryIDHash', userId);
        } catch {
            return res.status(404).json({ error: 'User not found' });
        }

        const userRecord = JSON.parse(result.toString());
        await gateway.disconnect();
        res.status(200).json(userRecord);

    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({ error: 'Failed to retrieve user hash' });
    }
});

app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
