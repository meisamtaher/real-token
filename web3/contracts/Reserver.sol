// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Reserver is ChainlinkClient, Ownable {
  using Chainlink for Chainlink.Request;
  using Strings for uint256;

  address public oracle;
  bytes32 public jobId;
  uint256 public fee;

  struct Request {
    address sender;
    string ccid;
  }

  mapping(bytes32 => Request) public requests;
  mapping(string => address) public owners;
  
  uint256 public fulfills;

  mapping(address => bool) public requestPending;
  mapping(bytes32 => bool) public reserved;
  
  constructor() {}

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

  function isReserved(string memory ccid) public view returns (bool) {
    return false;
  }

  function Reserve(string memory ccid) public view returns(bool){
    // bytes32 reqID = verify(ccid);
    // fulfill(reqID);
    // reserved[ccid] = true;
    return true;
  }

  

  function verify(string memory ccid) public returns(bytes32) {
    address sender = address(this);

    require(!requestPending[sender], "Sender already has a pending request");

    Chainlink.Request memory request = buildChainlinkRequest(
      jobId,
      sender,
      this.fulfill.selector
    );
    request.add("tokenId", ccid);

    bytes32 requestId = sendChainlinkRequestTo(oracle, request, fee);
    requests[requestId] = Request(sender, ccid);
    requestPending[sender] = true;

    return sendChainlinkRequestTo(oracle, request, fee);

  }

  function fulfill(bytes32 requestId) public {
    Request storage request = requests[requestId];

    // TODO: Add validator before minting the token. Only the sender should be able to mint!
    owners[request.ccid] = msg.sender;
    fulfills += 1;

    delete requestPending[request.sender];
  }

  function ownerOf(string memory ccid) public view returns (address) {
    return owners[ccid];
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
