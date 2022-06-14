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
        firstCoin = await FirstCoin.deploy("FRST", "FRST");
        await firstCoin.deployed();

        const SecondCoin = await ethers.getContractFactory("Stable");
        secondCoin = await SecondCoin.deploy("SCND", "SCND");
        await secondCoin.deployed();

        const Registry = await ethers.getContractFactory("Registry");
        registry = await Registry.deploy();

        await firstCoin.transfer(boxCreator.address, ethers.utils.parseEther("100"))
        await secondCoin.transfer(boxPicker.address, ethers.utils.parseEther("100"))
        await firstCoin.connect(boxCreator).approve(registry.address, ethers.utils.parseEther('100000'))
        await secondCoin.connect(boxPicker).approve(registry.address, ethers.utils.parseEther('100000'))

    })

    it("create first box", async function () {
        const reciever = boxPicker.address;
        const token = firstCoin.address;
        const amount = ethers.utils.parseEther("10");
        const hashSecret = ethers.utils.id("secret");
        const unlockTimestamp = (Date.now() / 1000).toFixed();
        
        expect(await registry.connect(boxCreator).createBox(reciever, token, amount, hashSecret, unlockTimestamp, "1")).to.emit(registry, "BoxCreated");

    })

    it("create second box", async function () {
        const reciever = boxCreator.address;
        const token = secondCoin.address;
        const amount = ethers.utils.parseEther("11");
        const hashSecret = ethers.utils.id("secret2");
        const unlockTimestamp = (Date.now() / 1000).toFixed();
        expect(await registry.connect(boxPicker).createBox(reciever, token, amount, hashSecret, unlockTimestamp, "1")).to.emit(registry, "BoxCreated");

    })

    it("claim first box", async function () {
        const firstBox : Box = await registry.getBoxById(1);
        const secondBox : Box = await registry.getBoxById(2);
        console.log({firstBox, secondBox})
        await registry.connect(boxPicker).claim(1, "secret", "1");
    })



})