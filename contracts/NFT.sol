// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZKPassportNFT is ERC721, Ownable {
    constructor() ERC721("ZK Passport NFT", "ZKT") Ownable() {
        _mint(msg.sender, 0);
        _mint(0xc8efafb5F8cbB385b3A3fA20aC7e480F0638Aa87, 1);
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmPYKeyoe4cTSbdP4J7XkV7XuM96YkgNsCaMzBLHGrpNdW";
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmPYKeyoe4cTSbdP4J7XkV7XuM96YkgNsCaMzBLHGrpNdW";
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
