const express = require('express');
const Web3 = require('web3');

// Connect to a local Ethereum node (update with your node details)
const web3 = new Web3('http://localhost:8545');

// Define your Ethereum contract addresses
const NFTContractAddress = '0xContract1Address';
const MarketContractAddress = '0xContract2Address';
const ReserverContractAddress = '0xContract3Address';
const UVContractAddress = '0xContract3Address';

// Define ABI (replace with your contract ABIs)
const NFTContractAbi = [];
const MarketContractAbi = [];
const ReserverContractAbi = [];
const UVContractAbi = [];

// Initialize contracts
const nft = new web3.eth.Contract(contract1Abi, contract1Address);
const market = new web3.eth.Contract(contract2Abi, contract2Address);
const reserver = new web3.eth.Contract(contract3Abi, contract3Address);
const uv = new web3.eth.Contract(contract3Abi, contract3Address);

// Express app
const app = express();
const port = 3000;


// Define NFT
app.get('/narpet/NFT', async (req, res) => {
    try {
        // Use the 'nft' contract instance to call the appropriate method to get all NFTs
        const allNFTs = await nft.methods.getAllNFTs().call();

        // Send the list of NFTs as a JSON response
        res.json({ nfts: allNFTs });
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/narpet/NFT/:id', async (req, res) => {
    const nftId = req.params.id;

    try {
        // Use the 'nft' contract instance to call the appropriate method with the provided ID
        const nftDetails = await nft.methods.getNFTDetails(nftId).call();

        // Check if the NFT with the given ID exists
        if (nftDetails) {
            // Send the NFT details as a JSON response
            res.json({ nft: nftDetails });
        } else {
            // If NFT with the given ID is not found, return a 404 status
            res.status(404).json({ error: 'NFT not found' });
        }
    } catch (error) {
        console.error(`Error fetching NFT details for ID ${nftId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/narpet/market/buy', async (req, res) => {
    const { userAddress, nftId, price } = req.query;

    try {
        // Call the function to initiate the purchase transaction
        const transaction = await buyNFT(userAddress, nftId, price);

        // Send the transaction details as a JSON response
        res.json({ transaction });
    } catch (error) {
        console.error('Error buying NFT:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/narpet/NFT/person/:address', async (req, res) => {
    const userAddress = req.params.address;

    try {
        // Use the 'nft' contract instance to call the appropriate method to get NFTs owned by the user
        const userNFTs = await nft.methods.getNFTsByOwner(userAddress).call();

        // Send the list of NFTs owned by the user as a JSON response
        res.json({ nfts: userNFTs });
    } catch (error) {
        console.error(`Error fetching NFTs owned by ${userAddress}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/narpet/NFT/mint', async (req, res) => {
    try {
        // Replace the following with the actual logic to mint a new NFT
        const mintedNFT = await nft.methods.mintNFT().send({
            from: // specify the sender's address,
        });

        // For illustration purposes, assume you also add metadata after minting
        const nftId = mintedNFT.events.NFTMinted.returnValues.nftId;
        await nft.methods.addMetadata(nftId, 'Your Metadata').send({
            from: // specify the sender's address,
        });

        // Send a success message as a JSON response
        res.json({ message: 'NFT minted successfully' });
    } catch (error) {
        console.error('Error minting NFT:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/narpet/NFT/metadata/:id', async (req, res) => {
    const nftId = req.params.id;

    try {
        // Use the 'nft' contract instance to call the appropriate method to get metadata for the given NFT ID
        const nftMetadata = await nft.methods.getMetadata(nftId).call();

        // Check if metadata for the NFT with the given ID exists
        if (nftMetadata) {
            // Send the NFT metadata as a JSON response
            res.json({ metadata: nftMetadata });
        } else {
            // If metadata for the given ID is not found, return a 404 status
            res.status(404).json({ error: 'Metadata not found for the NFT' });
        }
    } catch (error) {
        console.error(`Error fetching metadata for NFT ID ${nftId}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/narpet/ai', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await openai.createImage({
        prompt,
        n: 1,
        size: "512x512",
        });
        res.send(response.data.data[0].url);
    } catch (err) {
        res.send(err.message);
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});