import { ethers } from "hardhat";

async function main() {
    const Registry = await ethers.getContractFactory("Registry");
    const registry = await Registry.deploy();
    await registry.deployed();

    console.log("registry deployed to: ", registry.address)

    const [user] = await ethers.getSigners();

    await registry.createBox(user.address, "0x991A8B4c7843089d0CB18F4D24af5bC7782cF899", ethers.utils.parseEther("1"), ethers.utils.sha256("0x1234"), 100, "secretWord")

    console.log("Box created");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});