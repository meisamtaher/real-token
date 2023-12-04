// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {FractionalizedNFT} from "./FractionalizedNFT.sol";

contract FractionalizedMarketplace is Ownable, ReentrancyGuard {
    
    FractionalizedNFT private fractionalizedNFT;
    // Struct representing a listed token
    struct ListedToken {
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
    }

    // Mapping from token ID to listed tokens
    mapping(uint256 => ListedToken) public listedTokens;

    // Event emitted when a token is removed from sale
    event TokenRemovedFromSale(uint256 tokenId);

    // Event emitted when the ownership of a token is transferred after a purchase
    event TokenOwnershipTransferred(uint256 tokenId, address from, address to, uint256 amount);

    // Modifier to ensure that only the seller can perform certain actions
    modifier onlySeller(uint256 tokenId) {
        require(listedTokens[tokenId].seller == msg.sender, "Not the seller");
        _;
    }

    constructor (address _fractionalizedNFT){
        fractionalizedNFT = FractionalizedNFT(_fractionalizedNFT);
    }

    // Function to list a token for sale
    function listTokenForSale(uint256 tokenId, uint256 amount, uint256 price) external {
        require(amount > 0, "Amount must be greater than zero");
        require(price > 0, "Price must be greater than zero");
        require(fractionalizedNFT.ownership[tokenId][msg.sender] > amount, "Invalid token ownership");
        
        // Check if the token is fractionalized
        require(isFractionalized(tokenId), "Token must be fractionalized");

        // Transfer the token to this contract
        fractionalizedNFT.transferFrom(msg.sender, address(this), tokenId, amount);

        listedTokens[tokenId] = ListedToken({
            seller: msg.sender,
            tokenId: tokenId,
            amount: amount,
            price: price
        });
    }

    // Function to remove a token from sale
    function removeTokenFromSale(uint256 tokenId) external onlySeller(tokenId) nonReentrant {
        delete listedTokens[tokenId];

        // Transfer the token back to the seller
        FractionalizedNFT fractionalizedNFT = FractionalizedNFT(owner());
        fractionalizedNFT.transferFrom(address(this), msg.sender, tokenId, listedTokens[tokenId].amount);

        emit TokenRemovedFromSale(tokenId);
    }

    // Function to buy a token
    function buyToken(uint256 tokenId, uint256 amount) external payable nonReentrant {
        require(amount > 0, "Amount must be greater than zero");

        ListedToken storage listedToken = listedTokens[tokenId];
        require(listedToken.amount >= amount, "Not enough tokens available for sale");
        require(msg.value >= listedToken.price * amount, "Insufficient funds sent");

        // Transfer funds to the seller
        payable(listedToken.seller).transfer(msg.value);

        // Transfer token ownership
        FractionalizedNFT fractionalizedNFT = FractionalizedNFT(owner());
        fractionalizedNFT.transferOwnership(listedToken.seller, msg.sender, tokenId, amount);

        // Update the listed token
        listedToken.amount -= amount;

        emit TokenOwnershipTransferred(tokenId, listedToken.seller, msg.sender, amount);

        // Remove the token from sale if the seller has no remaining tokens
        if (listedToken.amount == 0) {
            delete listedTokens[tokenId];
            emit TokenRemovedFromSale(tokenId);
        }
    }

    // Function to check if a token is fractionalized
    function isFractionalized(uint256 tokenId) internal view returns (bool) {
        FractionalizedNFT fractionalizedNFT = FractionalizedNFT(owner());
        return fractionalizedNFT.balanceOf(msg.sender, tokenId) > 0;
    }
}
