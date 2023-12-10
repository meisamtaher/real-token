# Narpet - Fractional NFT Marketplace

## Overview

  Welcome to Narpet, a revolutionary fractional NFT marketplace that allows users to tokenize their carpets and trade fractions of ownership. This project leverages the power of blockchain technology and smart contracts to create a unique ecosystem where users can transform their carpets into NFTs, backed by the Proof of Reserve mechanism.


## Proof of Reserve

  Proof of Reserve is a critical component of Narpet's functionality. It ensures that the carpet represented as an NFT on the platform is backed by a corresponding physical carpet in the real world. This mechanism provides transparency and trust to users, as they can verify the existence and authenticity of the physical carpet associated with the NFT.

### Reserver Contract

  The Reserver Contract is a smart contract within Narpet responsible for validating the existence of a carpet and retrieving its value from the Chainlink network. Here's how it works:

  1. Verification with Chainlink Network: The Reserver Contract communicates with the Chainlink network to verify whether the specified carpet exists or not. Chainlink provides a decentralized oracle network that supplies accurate and reliable off-chain data, ensuring the authenticity of the carpet information.

  2. Fetching Carpet Value: Once the existence of the carpet is confirmed, the Reserver Contract retrieves its value from the Chainlink network's price feed. This dynamic pricing mechanism ensures that the NFT's value is up-to-date and reflects the market value of the underlying physical carpet.

  By integrating the Reserver Contract with Chainlink, Narpet ensures a robust and tamper-proof system for linking NFTs to real-world assets, enhancing the overall trustworthiness of the platform.

  In addition to the Reserver Contract, Narpet features the <b> WalletBalance Contract</b> to control minting eligibility. This contract checks the wallet balance associated with a given address and allows minting of NFTs only if the wallet holds at least 100 Matic tokens. This adds an additional layer of security and ensures that users have sufficient funds to participate in the fractional ownership of carpets on the Narpet platform.

## Authors
- [@Hooman (DMind) Dehghani](https://www.github.com/itsDMind)


## Demo Website 
[online demo](https://meisamtaher.github.io/real-token/)
