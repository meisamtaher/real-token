// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Matic is ERC20, Ownable {
    // Called when new token are issued
    event Issue(uint amount);

    // Called when tokens are redeemed
    event Redeem(uint amount);

    // Called if contract ever adds fees
    event Params(uint feeBasisPoints, uint maxFee);

    constructor(
        uint _totalSupply
    ) ERC20("Matic Token", "Matic") Ownable(msg.sender) {
        _mint(_msgSender(), _totalSupply);
    }

    /// @dev same as ERC20 burn function
    // Issue a new amount of tokens
    // these tokens are deposited into the owner address
    //
    // @param _amount Number of tokens to be issued
    function issue(uint amount) public onlyOwner {
        require(totalSupply() + amount > totalSupply());
        require(balanceOf(_msgSender()) + amount > balanceOf(_msgSender()));

        _mint(_msgSender(), amount);
        emit Issue(amount);
    }

    /// @dev same as ERC20 burn function
    // Redeem tokens.
    // These tokens are withdrawn from the owner address
    // if the balance must be enough to cover the redeem
    // or the call will fail.
    // @param _amount Number of tokens to be issued
    function redeem(uint amount) public onlyOwner {
        require(totalSupply() >= amount);
        require(balanceOf(_msgSender()) >= amount);

        _burn(_msgSender(), amount);
        emit Redeem(amount);
    }

    /**
     * @notice called when user wants to withdraw tokens back to root chain
     * @dev Should burn user's tokens. This transaction will be verified when exiting on root chain
     * @param amount amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external {
        _burn(_msgSender(), amount);
    }
}
