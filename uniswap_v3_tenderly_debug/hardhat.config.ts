import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks:{
    virtualMainnet: {
      url: "https://virtual.mainnet.eu.rpc.tenderly.co/788e8993-30e7-40ea-8442-f5b91c13efd0",
      chainId: 175362 // the Chain ID you selected during creation
    },
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/QLyqy7ll-NxAiFILvr2Am",
        blockNumber: 23396231
      }
    }
  },
};

export default config;
