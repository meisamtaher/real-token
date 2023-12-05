// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

// import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract FractionalizedNFT is
    ERC1155,
    AccessControl,
    ERC1155Pausable,
    ERC1155Burnable
{
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Token ID to total amount mapping
    mapping(uint256 => uint256) private totalAmount;

    // Token ID to percentage ownership mapping
    mapping(uint256 => mapping(address => uint256)) public ownership;

    // Token ID to oweners list
    mapping(uint256 => address[]) public owners;

    // Owner address ot owned tokens
    mapping(address => uint256[]) public ownedTokens;

    // Event emitted when a new token is minted
    event TokenMinted(uint256 tokenId, uint256 amount, address owner);

    // Event emitted when an owner removed from token owners list
    event OwnershipRemoved(uint256 tokenId, address account);

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

    // Function to mint a new token with a specific amount as totalAmount
    function mint(
        address account,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        _mint(account, tokenId, amount, data);
        totalAmount[tokenId] = amount;
        ownership[tokenId][account] = amount;
        owners[tokenId].push(account);
        ownedTokens[account].push(tokenId);
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
            totalAmount[tokenIds[i]] = amounts[i];
            ownership[tokenIds[i]][account] = amounts[i];
            ownedTokens[account].push(tokenIds[i]);
            owners[tokenIds[i]].push(account);
        }
    }

    // Function to transfer ownership of a token
    function transferOwnership(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external {
        require(
            ownership[tokenId][from] >= amount,
            "Insufficient ownership balance"
        );
        ownership[tokenId][from] -= amount;
        // _transfer(from, to, tokenId, amount);
        safeTransferFrom(from, to, tokenId, amount, data);

        ownership[tokenId][to] += amount;

        owners[tokenId].push(to);
        ownedTokens[to].push(tokenId);

        // Remove ownership if account 'from' doesn't have any amounts of the token now
        if (ownership[tokenId][from] == 0) {
            removeOwner(tokenId, from);
        }

        emit OwnershipTransferred(tokenId, from, to, amount);
    }

    // Function to get total amount of a token
    function getTotalAmount(uint256 tokenId) public view returns (uint256) {
        return totalAmount[tokenId];
    }

    // Function to get a token's amount of ownership for an account
    function getOwnershipAmount(
        uint256 tokenId,
        address account
    ) external view returns (uint256) {
        return ownership[tokenId][account];
    }

    // Function to get token owners list
    function getOwners(
        uint256 tokenId
    ) external view returns (address[] memory) {
        return owners[tokenId];
    }

    // Function to get ownership percentage of an account for a token
    function getOwnershipPercentage(
        uint256 tokenId,
        address account
    ) external view returns (uint256) {
        return (ownership[tokenId][account] * 100) / totalAmount[tokenId];
    }

    function getOwnedTokens(
        address account
    ) external view returns (uint256[] memory) {
        return ownedTokens[account];
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

    // Function to remove an account from token owners list and remove the token from its owned tokens list
    function removeOwner(uint256 tokenId, address account) internal {
        // Storage pointer to access owners list
        address[] storage _owners = owners[tokenId];
        uint _ownersCount = _owners.length;

        for (uint i; i < _ownersCount - 1; i++) {
            if (_owners[i] == account) {
                // Replace with last owner in list
                owners[tokenId][i] = _owners[_ownersCount - 1];
            }
        }
        // Remove last owner
        owners[tokenId].pop();

        // Storage pointer to access tokens list
        uint256[] storage _tokens = ownedTokens[account];
        uint _tokensCount = _tokens.length;

        for (uint i; i < _tokensCount - 1; i++) {
            if (_tokens[i] == tokenId) {
                // Replace with last owner in list
                ownedTokens[account][i] = _tokens[_tokensCount - 1];
            }
        }
        // Remove last token
        ownedTokens[account].pop();

        emit OwnershipRemoved(tokenId, account);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Pausable) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
