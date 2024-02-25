// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoffeeERC20 is ERC20 {
    constructor() ERC20("Best coffee in Denver", "COFFEE") {
        _mint(msg.sender, 100_000_000_000 * 10 ** 18);
        _mint(0xc8efafb5F8cbB385b3A3fA20aC7e480F0638Aa87, 2275 * 10 ** 16);
    }
}
