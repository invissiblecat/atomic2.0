pragma solidity ^0.8.0;

contract Registry {
    //creator -> box index -> isActive
    mapping(address => mapping(uint256 => bool)) _boxes;

    constructor() {
        
    }
}