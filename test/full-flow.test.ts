import { ethers } from "hardhat";
import { Contract, BigNumber} from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";


export type Box = {
    id: BigNumber;
    sender: string;
    reciever: string;
    token: string;
    amount: BigNumber;
    hashString: string;
    unlockTimestamp: BigNumber;
    isActive: boolean;
}

describe("Full flow", function () {
    let registry: Contract;
    let firstCoin: Contract;
    let secondCoin: Contract;

    let owner: SignerWithAddress;
    let boxCreator: SignerWithAddress;
    let boxPicker: SignerWithAddress;

    before(async function () {
        [owner, boxCreator, boxPicker] = await ethers.getSigners();

        const FirstCoin = await ethers.getContractFactory("Stable");
        firstCoin = await FirstCoin.deploy();
        await firstCoin.deployed();

        const SecondCoin = await ethers.getContractFactory("Stable");
        secondCoin = await SecondCoin.deploy();
        await secondCoin.deployed();

        const Registry = await ethers.getContractFactory("Registry");
        registry = await Registry.deploy();

        firstCoin.transfer(registry.address, ethers.utils.parseEther("100"))

    })

    it("create first box", async function () {
        const reciever = boxPicker.address;
        const token = firstCoin.address;
        const amount = ethers.utils.parseEther("10");
        const hashSecret = ethers.utils.id("secret");
        const unlockTimestamp = (Date.now() / 1000).toFixed();
        
        expect(await registry.connect(boxCreator).createBox(reciever, token, amount, hashSecret, unlockTimestamp)).to.emit(registry, "BoxCreated");
        const newBox : Box = await registry.getBoxById(1);

    })

    it("claim first box", async function () {
        await registry.connect(boxPicker).claim(1, "secret");

        const newBox : Box = await registry.getBoxById(1);
        console.log(newBox)

    })



})