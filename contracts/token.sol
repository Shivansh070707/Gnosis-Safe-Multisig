// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity 0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(address safe) ERC20("S", "s") {
        _mint(msg.sender, 10000 ether);
        _mint(safe, 10000 ether);
    }
}
//0x7700b7F7BF7a61A3ec2a7821992342f05f479333
