import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

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
