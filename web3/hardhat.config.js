require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
// require("solidity-docgen");
const docgen = require("solidity-docgen");

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
    ],
  },

  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    mumbai: {
      url: process.env.MUMBAI_TESTNET_RPC,
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  docgen: {
    path: "./docs", // Specify the path where the generated documentation will be saved
    clear: true, // Optional - Clears the documentation directory before generating the new documentation
    runOnCompile: true,
    // templates: {
    //   group: "./templates/group.hbs", // Optional - Path to the Handlebars template for groups
    //   contract: "./templates/contract.hbs", // Optional - Path to the Handlebars template for contracts
    //   context: "./templates/context.hbs", // Optional - Path to the Handlebars template for contexts
    // },
  },
};
