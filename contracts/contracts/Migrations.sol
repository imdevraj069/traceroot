// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Migrations
 * @dev Standard Truffle migrations contract
 */
contract Migrations {
    address public owner;
    uint256 public last_completed_migration;

    modifier restricted() {
        require(msg.sender == owner, "Restricted to owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setCompleted(uint256 completed) external restricted {
        last_completed_migration = completed;
    }
}
