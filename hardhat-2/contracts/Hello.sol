// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Hello {
    string private _message = '';

    constructor(string memory message) {
        _message = message;
    }

    function say() public view returns (string memory) {
        return _message;
    }

    function getMessage() public view returns(string memory) {
        return _message;
    }
}