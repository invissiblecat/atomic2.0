import { ethers } from "hardhat";

async function main() {
    const registry = await ethers.getContractAt("Registry", "0xE9d959bB03cFdb72B7e25B6a2Cf0c2dC380F9a2E");

//eth 0xE9d959bB03cFdb72B7e25B6a2Cf0c2dC380F9a2E
    const box = await registry.getBoxById(7)

    console.log('box ', box);
    console.log(ethers.utils.id('0x65462b0520ef7d3df61b9992ed3bea0c56ead753be7c8b3614e0ce01e4cac41b'))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});