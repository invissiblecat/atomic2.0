import { ethers } from "hardhat";

async function main() {
    const Token = await ethers.getContractFactory("Stable");
    const token = await Token.deploy("Atomic ETH", "tETH");
    await token.deployed();

    console.log(`token deployed to:` , token.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});