// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract privateNFT is Context, ERC721 {
    uint256 private _nextTokenId;
    address private owner;
    mapping(address => uint256) private _balances;

    constructor() ERC721("CrxaNodeNFT", "CRXp") {
        _nextTokenId = 1;
        owner = _msgSender(); // Set the contract deployer as the owner
    }

    modifier onlyOwner() {
        require(_msgSender() == owner, "You are not the owner");
        _;
    }

    function mint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _mint(to, tokenId);
        _balances[to] += 1; // Increase balance of the recipient
    }

    function burn(uint256 tokenId) public onlyOwner {
        address tokenOwner = ownerOf(tokenId);
        _balances[tokenOwner] -= 1; // Decrease balance of the owner
        _burn(tokenId);
    }

    function balanceOf(address account) public view override returns (uint256) {
        require(msg.sender == account, "PERC20Sample: msg.sender != account");
        return _balances[account];
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }

    function privateMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _mint(to, tokenId);
        _balances[to] += 1; // Increase balance of the recipient
    }

    function privateBurn(uint256 tokenId) public onlyOwner {
        address tokenOwner = ownerOf(tokenId);
        _balances[tokenOwner] -= 1; // Decrease balance of the owner
        _burn(tokenId);
    }
}
