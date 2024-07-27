// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PERC20.sol";

/**
 * @dev Sample implementation of the {PERC20} contract.
 */
contract PERC20Sample is PERC20 {
    uint256 private constant MINT_AMOUNT = 10 * 10**18; // 10 tokens with 18 decimals

    constructor() PERC20("Sample PERC20", "pSWTR") {}

    /// @dev Wraps SWTR to PSWTR.
    receive() external payable {
        _mint(_msgSender(), msg.value);
    }

    /**
     * @dev Mints a fixed amount of tokens (10 tokens) to the caller's address.
     */
    function mint() external {
        _mint(_msgSender(), MINT_AMOUNT);
    }

    /**
     * @dev Regular `balanceOf` function marked as internal, so we override it to extend visibility  
     */
    function balanceOf(address account) public view override returns (uint256) {
        // This function should be called by EOA using signed `eth_call` to make EVM able to
        // extract original sender of this request. In case of regular (non-signed) `eth_call`
        // msg.sender will be empty address (0x0000000000000000000000000000000000000000).
        require(msg.sender == account, "PERC20Sample: msg.sender != account");

        // If msg.sender is correct we return the balance
        return _balances[account];
    }

    /**
     * @dev Regular `allowance` function marked as internal, so we override it to extend visibility  
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        // This function should be called by EOA using signed `eth_call` to make EVM able to
        // extract original sender of this request. In case of regular (non-signed) `eth_call`
        // msg.sender will be empty address (0x0000000000000000000000000000000000000000)
        require(msg.sender == spender, "PERC20Sample: msg.sender != account");
        
        // If msg.sender is correct we return the allowance
        return _allowances[owner][spender];
    }
}
