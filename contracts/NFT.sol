// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CrxaNodeNFT is ERC721 {
    uint256 private _nextTokenId;

    constructor() ERC721("CrxaNodeNFT", "CRX") {
        _nextTokenId = 1;
    }

    function mint() public {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _mint(msg.sender, tokenId);
    }

    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "You do not own this token");
        _burn(tokenId);
    }
}
