pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Registry {
    using SafeERC20 for IERC20;

    // box id -> Box
   mapping(uint256 => Box) private _boxes;

    struct Box {
        uint256 id;
        address sender;
        address reciever;
        address token;
        uint256 amount;
        bytes32 hashSecret;
        uint unlockTimestamp;
        bool isActive;
    }

    uint256 private _boxId;

    event BoxCreated(uint256 indexed boxId, address indexed sender, string offchainBoxId);
    event Claim(uint256 indexed boxId, address indexed reciever, string offchainBoxId);
    event Refund(uint256 indexed boxId, address indexed reciever, string offchainBoxId);

    function createBox(
        address reciever,
        address token,
        uint256 amount,
        bytes32 hashSecret,
        uint unlockTimestamp,
        string memory offchainBoxId
    ) public {
        _boxId += 1;
        _boxes[_boxId] = Box(
            _boxId,
            msg.sender,
            reciever,
            token,
            amount,
            hashSecret,
            unlockTimestamp,
            true
        );
        emit BoxCreated(_boxId, msg.sender, offchainBoxId);
    }

    function claim(
        uint256 boxId,
        string memory secret,
        string memory offchainBoxId
    ) public {
        Box storage box = _boxes[boxId];
        require(box.reciever == msg.sender, "claim: Wrong reciever");
        require(box.hashSecret == keccak256(abi.encodePacked(secret)), "claim: Wrong secret");
        require(box.isActive, "claim: Sender has withdraw funds");

        IERC20(box.token).safeTransfer(msg.sender, box.amount);
        box.isActive = false;
        emit Claim(boxId, msg.sender, offchainBoxId);
    }

    function refund(
        uint256 boxId,
        string memory offchainBoxId
    ) public {
        Box storage box = _boxes[boxId];
        require(box.sender == msg.sender, "refund: Msg.sender is not a box creator");
        require(block.timestamp >= box.unlockTimestamp, "refund: Unlock time not reached");
        require(box.isActive, "refund: Recipient has withdraw funds");

        IERC20(box.token).safeTransfer(msg.sender, box.amount);
        box.isActive = false;
        emit Refund(boxId, msg.sender, offchainBoxId);
    }

    function getBoxById(uint256 boxId) public view returns (Box memory) {
        return _boxes[boxId];
    } 

    
}