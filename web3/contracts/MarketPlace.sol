// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Matic} from "./Mocks/Matic.sol";
import {FractionalizedNFT} from "./FractionalizedNFT.sol";

contract MarketPlace is Ownable, ReentrancyGuard {
    FractionalizedNFT fractionalizedNFT;
    Matic matic;

    // Struct representing a listed token
    struct ListedToken {
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
    }

    // Mapping from token ID to listed tokens
    mapping(uint256 => ListedToken) public listedTokens;

    event TokenListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 amount,
        uint256 price
    );

    // Event emitted when a token is removed from sale
    event TokenRemovedFromSale(uint256 indexed tokenId);

    // Event emitted when the ownership of a token is transferred after a purchase
    event TokenSold(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    // Modifier to ensure that only the seller can perform certain actions
    modifier onlySeller(uint256 tokenId) {
        require(listedTokens[tokenId].seller == msg.sender, "Not the seller");
        _;
    }

    constructor(
        address _fractionalizedNFT,
        address _matic
    ) Ownable(msg.sender) {
        fractionalizedNFT = FractionalizedNFT(_fractionalizedNFT);
        matic = Matic(_matic);
    }

    // Function to list a token for sale
    function listTokenForSale(
        uint256 tokenId,
        uint256 amount,
        uint256 price
    ) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(price > 0, "Price must be greater than zero");

        // Check if the token is fractionalized
        require(isFractionalized(tokenId), "Token must be fractionalized");
        require(
            fractionalizedNFT.getOwnershipAmount(msg.sender, tokenId) >= amount,
            "Insufficient ownership"
        );
        // Approve the marketplace contract to transfer the tokens
        // fractionalizedNFT.approve(tokenId, address(this), amount);

        listedTokens[tokenId] = ListedToken({
            seller: msg.sender,
            tokenId: tokenId,
            amount: amount,
            price: price
        });

        emit TokenListed(tokenId, msg.sender, amount, price);
    }

    // Function to remove a token from sale
    function removeTokenFromSale(
        uint256 tokenId
    ) external nonReentrant onlySeller(tokenId) {
        delete listedTokens[tokenId];

        // Remove the approval
        // fractionalizedNFT.removeApproval(address(this), tokenId);

        emit TokenRemovedFromSale(tokenId);
    }

    // Function to buy a token
    function buyToken(
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");

        ListedToken storage listedToken = listedTokens[tokenId];
        require(
            listedToken.amount >= amount,
            "Not enough tokens available for sale"
        );
        uint256 totalPrice = listedToken.price * amount;
        require(
            matic.balanceOf(msg.sender) >= totalPrice,
            "Insufficient buyer balance"
        );

        // Transfer funds to the seller
        require(
            matic.transferFrom(msg.sender, listedToken.seller, totalPrice),
            "Token transfer failed"
        );

        // Transfer token ownership
        fractionalizedNFT.transferFrom(
            listedToken.seller,
            msg.sender,
            tokenId,
            amount,
            data
        );

        // Update the listed token
        listedToken.amount -= amount;

        emit TokenSold(tokenId, listedToken.seller, msg.sender, amount);

        // Remove the token from sale if the seller has no remaining tokens
        if (listedToken.amount == 0) {
            delete listedTokens[tokenId];
            emit TokenRemovedFromSale(tokenId);
        }
    }

    // Function to check if a token is fractionalized
    function isFractionalized(uint256 tokenId) internal view returns (bool) {
        return fractionalizedNFT.balanceOf(msg.sender, tokenId) > 0;
    }
}
