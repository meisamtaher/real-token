require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
// require("@nomicfoundation/hardhat-waffle");
// require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
      },
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
      },
    ]
  },

  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    mumbai: {
      url: process.env.MUMBAI_TESTNET_RPC,
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY]
    }
    
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },

}; 
