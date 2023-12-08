// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Reserver} from "./Reserver.sol";

// import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract FractionalizedNFT is
    ERC1155,
    AccessControl,
    ERC1155Pausable,
    ERC1155Burnable
{
    struct ApproveData {
        address[] approvals;
        mapping(address => uint256) allowances;
    }

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Token ID to total amount mapping
    uint256 public constant MAX_TOKEN_AMOUNT = 10000;

    // Reserver contract address
    Reserver public reserver;
 
    // Token ID to percentage ownership mapping
    mapping(uint256 => mapping(address => uint256)) public ownership;

    // Token ID to oweners list
    mapping(uint256 => address[]) public owners;

    // Owner address ot owned tokens
    mapping(address => uint256[]) public ownedTokens;

    mapping(uint256 => ApproveData) private approvedAmounts;

    // Event emitted when a new token is minted
    event TokenMinted(uint256 indexed tokenId, address account);

    // Event emitted when an owner removed from token owners list
    event OwnershipRemoved(uint256 indexed tokenId, address account);

    // Event emitted when an approval is setted
    event AmountApproved(
        uint256 indexed tokenId,
        address indexed operator,
        uint256 amount
    );

    // Event emitted when ownership is transferred
    event AmountTransferred(
        uint256 tokenId,
        address from,
        address to,
        uint256 amount
    );

    constructor(
        address defaultAdmin,
        address _reserver,
        // address pauser,
        // address minter,
        string memory uri
    )
        /*ERC1155("https://meisamtaher.github.io/real-token/")*/
        ERC1155(uri)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin); 
        _grantRole(URI_SETTER_ROLE, defaultAdmin); 

        reserver = Reserver(_reserver);
    }


    function setReserver(address _reserver) external onlyRole(DEFAULT_ADMIN_ROLE){
        reserver = Reserver(_reserver);
    }

    // Function to mint a new token with a specific amount as totalAmount
    function mint(
        address account,
        uint256 tokenId,
        bool reservable,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {

        if(reservable){
            require(reserver.isReserved(tokenId), "Asset is not reserved yet");
        }

        // uint256 tokenId = uint256(
        //     keccak256(abi.encodePacked(account, data, block.timestamp))
        // );

        _mint(account, tokenId, MAX_TOKEN_AMOUNT, data);
        // totalAmount[tokenId] = amount;
        ownership[tokenId][account] = MAX_TOKEN_AMOUNT;
        owners[tokenId].push(account);
        ownedTokens[account].push(tokenId);
        emit TokenMinted(tokenId, account);
    }

    function mintBatch(
        address account,
        uint8 count,
        uint256[] memory tokenIds,
        bytes memory data
    ) external onlyRole(MINTER_ROLE) {
        // uint256[] memory tokenIds = new uint256[](count);
        uint256[] memory amounts = new uint256[](count);
        for (uint8 i; i < count; i++) {
            // tokenIds[i] = uint256(
            //     keccak256(abi.encodePacked(account, data, block.timestamp, i))
            // );
            amounts[i] = MAX_TOKEN_AMOUNT;
        }
        _mintBatch(account, tokenIds, amounts, data);
        for (uint i; i < tokenIds.length; i++) {
            // totalAmount[tokenIds[i]] = amounts[i];
            ownership[tokenIds[i]][account] = amounts[i];
            ownedTokens[account].push(tokenIds[i]);
            owners[tokenIds[i]].push(account);
            emit TokenMinted(tokenIds[i], account);
        }
    }

    // Function to transfer ownership of a token
    function transfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) public {
        require(
            ownership[tokenId][from] >= amount,
            "Insufficient ownership balance"
        );

        ownership[tokenId][from] -= amount;
        // _transfer(from, to, tokenId, amount);
        super.safeTransferFrom(from, to, tokenId, amount, data);

        ownership[tokenId][to] += amount;

        owners[tokenId].push(to);
        ownedTokens[to].push(tokenId);

        // Remove ownership if account 'from' doesn't have any amounts of the token now
        if (ownership[tokenId][from] == 0) {
            removeOwner(tokenId, from);
        }

        emit AmountTransferred(tokenId, from, to, amount);
    }

    function approve(
        uint256 tokenId,
        address operator,
        uint256 amount
    ) external {
        require(
            ownership[tokenId][msg.sender] >= amount,
            "Insufficient allowance"
        );
        require(msg.sender != operator, "Approval to current owner");

        // approveAmounts(tokenId, operator, amount);
        // if (amount == MAX_TOKEN_AMOUNT) {
            setApprovalForAll(operator, true);
        // }
 
        ApproveData storage approveData = approvedAmounts[tokenId];
        // If have any allowance before
        if (approveData.allowances[operator] == 0) {
            approveData.approvals.push(operator);
        }
        approveData.allowances[operator] = amount;
        emit AmountApproved(tokenId, operator, amount);
    }

    function removeApproval(address operator, uint256 tokenId) external {
        require(
            ownership[tokenId][msg.sender] > 0,
            "Invalid ownership amount to remove approval"
        );
        uint256 currentAllowance = allowance(tokenId, operator);
        require(currentAllowance > 0, "Insufficient operator allowance");
        spendAllowance(operator, tokenId, currentAllowance);

        setApprovalForAll(operator, false);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) external {
        uint256 currentAllowance = allowance(tokenId, msg.sender);
        require(currentAllowance >= amount, "Insufficient allowance");
        spendAllowance(msg.sender, tokenId, amount);

        // Call transfer fuction of this contract
        transfer(from, to, tokenId, amount, data);
    }

    function allowance(
        uint256 tokenId,
        address operator
    ) public view returns (uint256) {
        return approvedAmounts[tokenId].allowances[operator];
    }

    // Function to get a token's amount of ownership for an account
    // Must be equal to balanceOf(account, tokenId)
    function getOwnershipAmount(
        address account,
        uint256 tokenId
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
        address account,
        uint256 tokenId
    ) external view returns (uint256) {
        return (ownership[tokenId][account] * 100) / MAX_TOKEN_AMOUNT;
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

    function spendAllowance(
        address operator,
        uint256 tokenId,
        uint256 amount
    ) internal {
        uint256 currentAllowance = allowance(tokenId, operator);
        require(currentAllowance >= amount, "Insufficient allowance");

        approvedAmounts[tokenId].allowances[operator] -= amount;
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
