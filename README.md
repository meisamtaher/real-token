# Narpet - Fractional NFT Standard and Marketplace for Real-World Assets

# Table of Contents
1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Project Flow](#project-flow)
4. [Project Highlights](#project-highlights)
5. [Contracts](#contracts)
    - [1. FractionalizedNFT.sol](#1-fractionalizednftsol)
    - [2. MarketPlace.sol](#2-marketplacesol)
    - [3. Reserver.sol](#3-reserversol)
    - [4. PriceConsumerV3.sol](#4-priceconsumerv3sol)
    - [5. WalletBalance.sol](#5-walletbalancesol)
6. [Technologies Used](#technologies-used)
7. [Getting Started](#getting-started)
8. [Conclusion](#conclusion)
9. [What's Next for Narpet](#whats-next-for-narpet)

***
## Overview

Narpet, short for NFT Carpet, is a groundbreaking project that introduces fractionalized NFTs representing real-world assets. The platform facilitates the minting of NFTs backed by tangible assets, such as carpets, allowing users to fractionalize and trade ownership shares on the Narpet marketplace. This project leverages the power of blockchain technology and smart contracts to create a unique ecosystem. The off-chain proof of reserve process ensures the authenticity of the underlying assets.
***
## Architecture Diagram

![image](https://github.com/meisamtaher/real-token/assets/99467399/53d9ef43-94ab-44a2-b3b4-31691da4f441)

***
## Project Flow

1. **Asset Upload:** Users visit the Narpet website, upload asset details, and request the minting of an NFT tied to the asset.

2. **Reserve Approval:** The minting process remains pending until the user physically takes the asset (carpet) to a reserver entity. Upon approval by the reserver, minting is executed.

3. **Chainlink Verification:** Chainlink oracles are used to verify if the user has taken the asset to a valid reserver and if the user's wallet has a balance of over 100 MATIC.

4. **Minting:** Once verified, the user gains the minter role, allowing them to mint the related token with a unique ID. Metadata is stored on IPFS, and the CID is stored on the smart contract.

5. **Fractionalized NFT Standard:** The ERC-1155-based fractionalized NFT standard is implemented, allowing each token to have a fixed amount as fractions or shares (e.g., 10,000). Early owners can transfer or list shares for sale in the marketplace.

6. **Ownership Transfer:** Ownership of fractional shares can be transferred between users, facilitating a dynamic marketplace for real-world asset ownership.

7. **Asset Redemption:** Token owners can redeem the tangible asset by burning their tokens.

***
## Project Highlights

- **Fractionalized Ownership:** Mint NFTs representing real-world assets and own fractional shares of these assets on the blockchain.

- [**Off-Chain Proof of Reserve:**](#proof-of-reserve) Utilize a reserve mechanism, involving Chainlink oracles, to verify the presence of physical assets tied to the NFTs.

- **Reserver Entities:** Users can approach reserver entities, to store their tangible assets securely.

- **Marketplace:** Trade fractionalized ownership shares in the marketplace, allowing users to buy or sell ownership stakes in real-world assets.

- **Chainlink Integration:** Leverage Chainlink oracles to ensure users' adherence to asset reserve requirements and verify wallet balances.



### Proof of Reserve

  Proof of Reserve is a critical component of Narpet's functionality. It ensures that the carpet represented as an NFT on the platform is backed by a corresponding physical carpet in the real world. This mechanism provides transparency and trust to users, as they can verify the existence and authenticity of the physical carpet associated with the NFT.

#### Reserver Contract

  The Reserver Contract is a smart contract within Narpet responsible for validating the existence of a carpet and retrieving its value from the Chainlink network. Here's how it works:

  1. Verification with Chainlink Network: The Reserver Contract communicates with the Chainlink network to verify whether the specified carpet exists or not. Chainlink provides a decentralized oracle network that supplies accurate and reliable off-chain data, ensuring the authenticity of the carpet information.

  2. Fetching Carpet Value: Once the existence of the carpet is confirmed, the Reserver Contract retrieves its value from the Chainlink network's price feed. This dynamic pricing mechanism ensures that the NFT's value is up-to-date and reflects the market value of the underlying physical carpet.

  By integrating the Reserver Contract with Chainlink, Narpet ensures a robust and tamper-proof system for linking NFTs to real-world assets, enhancing the overall trustworthiness of the platform.

  In addition to the Reserver Contract, Narpet features the <b> WalletBalance Contract</b> to control minting eligibility. This contract checks the wallet balance associated with a given address and allows minting of NFTs only if the wallet holds at least 100 Matic tokens. This adds an additional layer of security and ensures that users have sufficient funds to participate in the fractional ownership of carpets on the Narpet platform.




***
## Contracts

### 1. FractionalizedNFT.sol

The core contract representing the ERC-1155-based fractionalized NFT standard. Handles minting, transfers, approvals, and ownership-related functionalities.

### 2. MarketPlace.sol

Facilitates the listing and purchasing of fractionalized ownership shares in the marketplace.

### 3. Reserver.sol

Implements the proof of reserve process using Chainlink oracles to verify the presence of physical assets.

### 4. PriceConsumerV3.sol

Fetches the MATIC/USD price using the Chainlink AggregatorV3Interface.

### 5. WalletBalance.sol

Retrieves the user's MATIC balance using the Chainlink AggregatorV3Interface.
***
## Technologies Used

- **Solidity**
- **Hardhat**
- **ReactJS**
- **Chainlink**
- **IPFS**
***
## Networks
- **Polygon mumbai**

  WalletBalance deployed to: 0xA3D1F0A6c7483489FAa10f3F9b1A5DA5AFa4144e
  Reserver deployed to: 0x0Ef8df0021f78Cf9d627Ffe6CE4AcB5Db8721d14
  FractionalizedNFT deployed to: 0x99396454915DaAE29833844871E86f42C11119e5
  matic deployed to: 0xC85B57Cc472efb827d0AEeDd44832508F37Ed3aB
  priceConsumerV3 deployed to: 0xF29A1983431f67c1B37AA3e4Bf2FE5711FdC09B6
  Marketplace deployed at 0x1fEeC7a03Cf0C07E59012cCF42923E6A15Fe7DDA

- **Polygon zkEVM**

  WalletBalance deployed to: 0xBFC1822277bA6394966786A6517B308cf78fe37E
  Reserver deployed to: 0xCa8a5819bcBA1Fd4a9D3fc03258E89352F18Fc10
  FractionalizedNFT deployed to: 0xF2d74a66192B4a5666aa4ec4Bc9dA5b231e7339E
  matic deployed to: 0xB2f2275935158092B9F5e57c1a5bB4bd933DD552
  priceConsumerV3 deployed to: 0xEeC0c00d0281764017085Fc8AE3B69A312f52076
  Marketplace deployed at 0x22Aa658133cC8b4F2d492b31E215029C0747e6d1


***
## Getting Started

(Provide instructions on how to set up and deploy the contracts, run the frontend, and interact with the Narpet platform.)
***
## Conclusion

Narpet revolutionizes the NFT space by bridging the digital and physical worlds, allowing users to own and trade fractions of real-world assets on the blockchain. The project introduces a new dimension to NFT utility and liquidity.
***
## What's Next for Narpet

(Describe future plans, potential features, or improvements for the Narpet project.)




***
## Team
- [@Hooman (DMind) Dehghani](https://www.github.com/itsDMind)
- [@Mahdieh-amiri1](https://www.github.com/mahdieh-amiri1)


## Demo Website 
[online demo](https://meisamtaher.github.io/real-token/)
