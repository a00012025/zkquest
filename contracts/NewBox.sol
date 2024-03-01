/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract NewBox is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    function initialize() public initializer {
        __ERC20_init("ZkQuest Upgradable Beacon", "ZKQ_BEACON_V2");
        __Ownable_init();

        _mint(msg.sender, 21 * 10 ** decimals());
    }

    function name() public pure override returns (string memory) {
        return "ZkQuest Upgradable Beacon";
    }

    function symbol() public pure override returns (string memory) {
        return "ZKQ_BEACON_V2";
    }
}
