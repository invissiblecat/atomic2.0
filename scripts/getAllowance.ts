import { ethers } from "hardhat";

async function main() {
    const atoken = await ethers.getContractAt("Stable", "0x08d275372da60Cfbcb6db7351EE3259c27cb718C");
    const aRegistry = await ethers.getContractAt("Registry", "0x91E5AC4a7F0Da2a2c69996BC1616cebD8c7f272E");
    const userAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

    const allowance = await atoken.allowance(userAddress, aRegistry.address)

    console.log({allowance});
    
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});