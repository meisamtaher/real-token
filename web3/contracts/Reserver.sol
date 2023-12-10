// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {WalletBalance} from "./WalletBalance.sol";

contract Reserver is ChainlinkClient, Ownable(msg.sender) {
  using Chainlink for Chainlink.Request;
  using Strings for uint256;

  address public oracle;
  bytes32 public jobId;
  uint256 public fee;
  uint randNo = 1132;

  struct Request {
    address sender;
    uint256 tokenId;
  }

  WalletBalance public walletbalance;

  mapping(bytes32 => Request) public requests;
  mapping(uint256 => address) public owners;
  uint256 public fulfills;

  mapping(address => bool) public requestPending;
  mapping(uint256 => bool) public reserved;
  mapping(uint256 => uint256) public assetPrice;
  address public walletBalance;
  constructor(address contractWalletBalance) {
    walletBalance = contractWalletBalance;
  }

  modifier checkBalance(address entry){
    require(walletbalance.getMaticBalance(entry)>100,"is not eligile for minter role");
    _;
  }

  function setJobConfig(
    address _link,
    address _oracle,
    string memory _jobId,
    uint256 _fee
  ) public onlyOwner {
    setChainlinkToken(_link);
    oracle = _oracle;
    jobId = stringToBytes32(_jobId);
    fee = _fee;
  }

  function verify(uint256 tokenId) public returns (bytes32){
    address sender = address(this);

    require(!requestPending[sender], "Sender already has a pending request");

    Chainlink.Request memory request = buildChainlinkRequest(
      jobId,
      sender,
      this.fulfill.selector
    );
    request.add("tokenId", tokenId.toString());

    bytes32 requestId = sendChainlinkRequestTo(oracle, request, fee);
    requests[requestId] = Request(sender, tokenId);
    requestPending[sender] = true;

    return requestId;
  }

  function fulfill(bytes32 requestId) public {
    Request storage request = requests[requestId];

    // TODO: Add validator before minting the token. Only the sender should be able to mint!
    owners[request.tokenId] = msg.sender;
    fulfills += 1;

    delete requestPending[request.sender];
  }


  function isReserved(uint256 tokenId) public view returns (bool) {
    return reserved[tokenId];
  }

  function Reserve(uint256 tokenId) public checkBalance(msg.sender) returns(bool){
    // bytes32 reqID = verify(tokenId);
    bytes32 fake_reqID = 0x0000000000000000000000000000000000000000000000000000000000000000;
    fulfill(fake_reqID);
    reserved[tokenId] = true;
    assetPrice[tokenId] = uint (keccak256(abi.encodePacked (msg.sender, block.timestamp, randNo))); 
    return true;
  }

  function ownerOf(uint256 tokenId) public view returns (address) {
    return owners[tokenId];
  }

  function getAssetPricing(uint256 tokenId) view  public returns(uint256){
    return assetPrice[tokenId];
  } 

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }
}

