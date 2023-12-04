// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract FractionalizedNFT is
    ERC1155,
    AccessControl,
    ERC1155Pausable,
    ERC1155Burnable,
    ERC1155Supply
{
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Token ID to total supply mapping
    mapping(uint256 => uint256) private totalSupply;

    // // Token ID to free shares
    // mapping(uint256 => uint256) private freeShares = 1000;

    // Token ID to percentage ownership mapping
    mapping(uint256 => mapping(address => uint256)) public ownership;

    // Event emitted when a new token is minted
    event TokenMinted(uint256 tokenId, uint256 amount, address owner);

    // Event emitted when ownership is transferred
    event OwnershipTransferred(
        uint256 tokenId,
        address from,
        address to,
        uint256 amount
    );

    constructor(
        address defaultAdmin,
        address pauser,
        address minter
    )
        // ,string memory uri
        ERC1155("https://meisamtaher.github.io/real-token/")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
    }

    // Function to mint a new token
    function mint(
        address account,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external onlyOwner onlyRole(MINTER_ROLE) {
        _mint(account, tokenId, amount, data);
        totalSupply[tokenId] = amount;
        ownership[tokenId][account] = amount;
        emit TokenMinted(tokenId, amount, account);
    }

    function mintBatch(
        address account,
        uint256[] memory tokenIds,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        _mintBatch(account, tokenIds, amounts, data);
        for (uint i; i < tokenIds.length; i++) {
            totalSupply[tokenIds[i]] = amounts[i];
            ownership[tokenId][account] = amount[i];
        }
    }

    // Function to transfer ownership of a token
    function transferOwnership(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) external onlyOwner {
        require(
            ownership[tokenId][from] >= amount,
            "Insufficient ownership balance"
        );

        _transfer(from, to, tokenId, amount);
        ownership[tokenId][from] = ownership[tokenId][from] - amount;
        ownership[tokenId][to] = ownership[tokenId][to] + amount;

        emit OwnershipTransferred(tokenId, from, to, amount);
    }

    // Function to get total supply of a token
    function getTotalSupply(uint256 tokenId) external view returns (uint256) {
        return totalSupply[tokenId];
    }

    // Function to get ownership percentage of an account for a token
    function getOwnershipPercentage(
        uint256 tokenId,
        address account
    ) external view returns (uint256) {
        return (ownership[tokenId][account] * 100) / totalSupply[tokenId];
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
