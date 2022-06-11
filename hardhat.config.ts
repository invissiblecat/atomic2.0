import { HardhatUserConfig} from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import '@nomiclabs/hardhat-ethers'
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";

dotenv.config();


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000
      }
    }
  },
  networks: {
    hardhat: {
      // accounts: {
      //   count: 2000,
      // }
    },
    local: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    rinkeby: {
      url: process.env.RINKEBY !== undefined ? process.env.RINKEBY : "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gas: 8000000,
      gasPrice: 30000000000,
    },
    fuji: {
      url: process.env.FUJI !== undefined ? process.env.FUJI : "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gas: 8000000,
      gasPrice: 30000000000,
    },
  },
};

export default config;
