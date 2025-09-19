require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am",
        blockNumber:23043400// 23043400 works
      }
    }
  }
};

// alternative: url: "https://mainnet.infura.io/v3/c385e2e722284dc9b570de7ede60dba1",
