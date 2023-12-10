# Solidity API

## FractionalizedNFT

_ERC1155 token with fractional ownership, pausability, burnable, and role-based access control._

### URI_SETTER_ROLE

```solidity
bytes32 URI_SETTER_ROLE
```

### PAUSER_ROLE

```solidity
bytes32 PAUSER_ROLE
```

### MINTER_ROLE

```solidity
bytes32 MINTER_ROLE
```

### MAX_TOKEN_AMOUNT

```solidity
uint256 MAX_TOKEN_AMOUNT
```

### ApproveData

```solidity
struct ApproveData {
  address[] approvals;
  mapping(address => uint256) allowances;
}
```

### TokenMinted

```solidity
event TokenMinted(uint256 tokenId, address account)
```

### OwnershipRemoved

```solidity
event OwnershipRemoved(uint256 tokenId, address account)
```

### AmountApproved

```solidity
event AmountApproved(uint256 tokenId, address operator, uint256 amount)
```

### AmountTransferred

```solidity
event AmountTransferred(uint256 tokenId, address from, address to, uint256 amount)
```

### constructor

```solidity
constructor(address defaultAdmin, address _reserver, string baseUri) public
```

_Constructor_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| defaultAdmin | address | Default admin address with all roles |
| _reserver | address | Address of the Reserver contract |
| baseUri | string | Base URI for token metadata |

### setReserver

```solidity
function setReserver(address _reserver) external
```

_Set the Reserver contract address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _reserver | address | New Reserver contract address |

### mint

```solidity
function mint(address account, uint256 tokenId, string metadata, bool reservable, bytes data) external
```

_Mint a new token with a specific amount as totalAmount_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | Address to receive the minted tokens |
| tokenId | uint256 | ID of the token to be minted |
| metadata | string | Metadata associated with the token |
| reservable | bool | Boolean indicating whether the token is related to a reservable asset |
| data | bytes | Additional data for minting |

### mintBatch

```solidity
function mintBatch(address account, uint8 count, uint256[] tokenId, string[] metadata, bool reservable, bytes data) external
```

_Mint multiple tokens in a batch_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | Address to receive the minted tokens |
| count | uint8 | Number of tokens to mint |
| tokenId | uint256[] | Array of token IDs to be minted |
| metadata | string[] | Array of metadata associated with the tokens |
| reservable | bool | Boolean indicating whether each token is related to a reservable asset |
| data | bytes | Additional data for minting |

### approve

```solidity
function approve(uint256 tokenId, address operator, uint256 amount) external
```

_Approve an operator to spend a specific amount of tokens on behalf of the owner_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | ID of the token |
| operator | address | Address to approve |
| amount | uint256 | Amount of fractions to approve |

### removeApproval

```solidity
function removeApproval(address operator, uint256 tokenId) external
```

_Remove approval for an operator on a specific token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | Address to remove approval from |
| tokenId | uint256 | ID of the token |

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes data) external
```

_Transfer tokens on behalf of an owner to another address_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | Owner address |
| to | address | Address to receive the tokens |
| tokenId | uint256 | ID of the token |
| amount | uint256 | Amount of fractions to transfer |
| data | bytes | Additional data for the transfer |

### transfer

```solidity
function transfer(address from, address to, uint256 tokenId, uint256 amount, bytes data) public
```

_Transfer ownership of a specific amount of tokens from one address to another_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | Address from which the tokens are transferred |
| to | address | Address to which the tokens are transferred |
| tokenId | uint256 | ID of the token |
| amount | uint256 | Amount of fractions to transfer |
| data | bytes | Additional data for the transfer |

### getMetadata

```solidity
function getMetadata(uint256 tokenId) external view returns (string)
```

_Get the metadata associated with a token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | ID of the token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | Metadata string |

### getOwnershipAmount

```solidity
function getOwnershipAmount(address account, uint256 tokenId) external view returns (uint256)
```

_Get the ownership amount of a specific account for a specific token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | Address of the account |
| tokenId | uint256 | ID of the token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Amount of ownership for the account |

### getOwners

```solidity
function getOwners(uint256 tokenId) external view returns (address[])
```

_Get the list of all accounts that own a specific token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | ID of the token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | Array of addresses that own the token |

### getOwnershipPercentage

```solidity
function getOwnershipPercentage(address account, uint256 tokenId) external view returns (uint256)
```

_Get the percentage ownership of an account for a specific token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | Address of the account |
| tokenId | uint256 | ID of the token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Percentage ownership of the account for the token |

### getOwnedTokens

```solidity
function getOwnedTokens(address account) external view returns (uint256[])
```

_Get the list of tokens owned by a specific account_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | Address of the account |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] | Array of token IDs owned by the account |

### allowance

```solidity
function allowance(uint256 tokenId, address operator) public view returns (uint256)
```

_Get the allowance for a specific operator on a token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | ID of the token |
| operator | address | Address of the operator |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | Allowance amount |

### uri

```solidity
function uri(uint256 tokenId) public view returns (string)
```

_Returns the URI for a given token ID.
Overrides the ERC1155 implementation._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The ID of the token. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | string The URI string. |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view returns (bool)
```

_Check if a contract supports a specific interface_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| interfaceId | bytes4 | Interface identifier |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Boolean indicating whether the contract supports the interface |

### setURI

```solidity
function setURI(string newuri) public
```

_Set a new URI for all token metadata_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| newuri | string | New URI to set |

### pause

```solidity
function pause() public
```

_Pause the contract, preventing transfers and approvals_

### unpause

```solidity
function unpause() public
```

_Unpause the contract, allowing transfers and approvals_

### spendAllowance

```solidity
function spendAllowance(address operator, uint256 tokenId, uint256 amount) internal
```

_Spend the allowance of a specific operator on a token_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | Address of the operator |
| tokenId | uint256 | ID of the token |
| amount | uint256 | Amount to spend from the allowance |

### removeOwner

```solidity
function removeOwner(uint256 tokenId, address account) internal
```

_Remove an account from token owners list and remove the token from its owned tokens list_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | ID of the token |
| account | address | Address to remove from ownership |

### _update

```solidity
function _update(address from, address to, uint256[] ids, uint256[] values) internal
```

_Internal function to update the balance of multiple accounts and tokens_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | Address from which the tokens will be transferred |
| to | address | Address to which the tokens will be transferred |
| ids | uint256[] | Array of token IDs |
| values | uint256[] | Array of amounts to transfer |

## MarketPlace

_A marketplace contract for buying and selling fractionalized NFTs._

### fractionalizedNFT

```solidity
contract FractionalizedNFT fractionalizedNFT
```

### matic

```solidity
contract Matic matic
```

### ListedToken

_Struct representing a listed token._

```solidity
struct ListedToken {
  address seller;
  uint256 tokenId;
  uint256 amount;
  uint256 price;
}
```

### TokenListed

```solidity
event TokenListed(uint256 tokenId, address seller, uint256 amount, uint256 price)
```

### TokenRemovedFromSale

```solidity
event TokenRemovedFromSale(uint256 tokenId)
```

### TokenSold

```solidity
event TokenSold(uint256 tokenId, address from, address to, uint256 amount)
```

### onlySeller

```solidity
modifier onlySeller(uint256 tokenId)
```

### constructor

```solidity
constructor(address _fractionalizedNFT, address _matic) public
```

_Constructor function to initialize the marketplace._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _fractionalizedNFT | address | Address of the FractionalizedNFT contract. |
| _matic | address | Address of the Matic contract. |

### listTokenForSale

```solidity
function listTokenForSale(uint256 tokenId, uint256 amount, uint256 price) external
```

_Function to list a token for sale._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | ID of the token. |
| amount | uint256 | Amount of the fractions to be listed. |
| price | uint256 | Price per unit of the token. |

### removeTokenFromSale

```solidity
function removeTokenFromSale(uint256 tokenId) external
```

_Function to remove a token from sale._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | ID of the token to be removed from sale. |

### buyToken

```solidity
function buyToken(uint256 tokenId, uint256 amount, bytes data) external
```

_Function to buy a token._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | ID of the token to be bought. |
| amount | uint256 | Amount of the token to be bought. |
| data | bytes | Additional data for the token transfer. |

### isFractionalized

```solidity
function isFractionalized(uint256 tokenId) internal view returns (bool)
```

_Function to check if a token is fractionalized._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | ID of the token to be checked. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean indicating whether the token is fractionalized. |

## Matic

### Issue

```solidity
event Issue(uint256 amount)
```

### Redeem

```solidity
event Redeem(uint256 amount)
```

### Params

```solidity
event Params(uint256 feeBasisPoints, uint256 maxFee)
```

### constructor

```solidity
constructor(uint256 _totalSupply) public
```

### issue

```solidity
function issue(uint256 amount) public
```

_same as ERC20 burn function_

### redeem

```solidity
function redeem(uint256 amount) public
```

_same as ERC20 burn function_

### withdraw

```solidity
function withdraw(uint256 amount) external
```

called when user wants to withdraw tokens back to root chain

_Should burn user's tokens. This transaction will be verified when exiting on root chain_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | amount of tokens to withdraw |

## Reserver

_A contract for reserving NFTs using Chainlink Proof of Reserve._

### oracle

```solidity
address oracle
```

### jobId

```solidity
bytes32 jobId
```

### fee

```solidity
uint256 fee
```

### Request

```solidity
struct Request {
  address sender;
  uint256 tokenId;
}
```

### requests

```solidity
mapping(bytes32 => struct Reserver.Request) requests
```

### owners

```solidity
mapping(uint256 => address) owners
```

### fulfills

```solidity
uint256 fulfills
```

### requestPending

```solidity
mapping(address => bool) requestPending
```

### reserved

```solidity
mapping(uint256 => bool) reserved
```

### constructor

```solidity
constructor() public
```

### setJobConfig

```solidity
function setJobConfig(address _link, address _oracle, string _jobId, uint256 _fee) public
```

_Sets the Chainlink job configuration._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _link | address | The LINK token address. |
| _oracle | address | The Chainlink oracle address. |
| _jobId | string | The Chainlink job ID. |
| _fee | uint256 | The Chainlink fee. |

### verify

```solidity
function verify(uint256 tokenId) public returns (bytes32)
```

_Initiates the Chainlink request to verify a tokenId._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The tokenId to be verified. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 | requestId The Chainlink request ID. |

### fulfill

```solidity
function fulfill(bytes32 requestId) public
```

_Fulfills the Chainlink request and reserves the tokenId._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| requestId | bytes32 | The Chainlink request ID. |

### isReserved

```solidity
function isReserved(uint256 tokenId) public view returns (bool)
```

_Checks if a tokenId is reserved._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The tokenId to check. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true if the tokenId is reserved, false otherwise. |

### Reserve

```solidity
function Reserve(uint256 tokenId) public returns (bool)
```

_Reserves a tokenId._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The tokenId to be reserved. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true if the tokenId is successfully reserved. |

### ownerOf

```solidity
function ownerOf(uint256 tokenId) public view returns (address)
```

_Gets the owner address of a tokenId._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The tokenId to check. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The address of the tokenId owner. |

## Lock

### unlockTime

```solidity
uint256 unlockTime
```

### owner

```solidity
address payable owner
```

### Withdrawal

```solidity
event Withdrawal(uint256 amount, uint256 when)
```

### constructor

```solidity
constructor(uint256 _unlockTime) public payable
```

### withdraw

```solidity
function withdraw() public
```

