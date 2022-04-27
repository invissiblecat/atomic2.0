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
        uint hashSecret;
        uint unlockTimestamp;
        bool isActive;
    }

    uint256 private _nextBoxId;

    event BoxCreated(uint256 indexed boxId, address indexed sender);
    event Claim(uint256 indexed boxId, address indexed reciever);
    event Refund(uint256 indexed boxId, address indexed reciever);

    function createBox(
        address reciever,
        address token,
        uint256 amount,
        uint hashSecret,
        uint unlockTimestamp
    ) public {
        _nextBoxId += 1;
        _boxes[_nextBoxId] = Box(
            _nextBoxId,
            msg.sender,
            reciever,
            token,
            amount,
            hashSecret,
            unlockTimestamp,
            true
        );
        emit BoxCreated(_nextBoxId, msg.sender);
    }

    function claim( //check on testnet if we can see incoming secret in transaction
        uint256 boxId,
        uint recieverHashSecret
    ) public {
        Box storage box = _boxes[boxId];
        require(box.reciever == msg.sender, "claim: Wrong reciever");
        require(box.hashSecret == recieverHashSecret, "claim: Wrong secret");
        require(box.isActive, "claim: Sender has withdraw funds");

        IERC20(box.token).safeTransfer(msg.sender, box.amount);
        box.isActive = false;
        emit Claim(boxId, msg.sender);
    }

    function refund(
        uint256 boxId
    ) public {
        Box storage box = _boxes[boxId];
        require(box.sender == msg.sender, "refund: Msg.sender is not a box creator");
        require(block.timestamp >= box.unlockTimestamp, "refund: Unlock time not reached");
        require(box.isActive, "refund: Recipient has withdraw funds");

        IERC20(box.token).safeTransfer(msg.sender, box.amount);
        box.isActive = false;
        emit Refund(boxId, msg.sender);
    }

    
}