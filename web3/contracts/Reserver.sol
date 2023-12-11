// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {WalletBalance} from "./WalletBalance.sol";

/**
 * @title Reserver
 * @dev A contract for reserving NFTs using Chainlink Proof of Reserve.
 */
contract Reserver is ChainlinkClient, Ownable(msg.sender) {
    using Chainlink for Chainlink.Request;
    using Strings for uint256;

    address public oracle;
    bytes32 public jobId;
    uint256 public fee;
    uint256 public minBalance;
    uint private randNo = 1132;

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

    modifier checkBalance(address entry) {
        require(
            walletbalance.getMaticBalance(entry) >= minBalance,
            "Is not eligile for minter role"
        );
        _;
    }

    function setMinBalance(uint256 _minBalance) external onlyOwner {
        minBalance = _minBalance;
    }

    /**
     * @dev Sets the Chainlink job configuration.
     * @param _link The LINK token address.
     * @param _oracle The Chainlink oracle address.
     * @param _jobId The Chainlink job ID.
     * @param _fee The Chainlink fee.
     */
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

    /**
     * @dev Initiates the Chainlink request to verify a tokenId.
     * @param tokenId The tokenId to be verified.
     * @return requestId The Chainlink request ID.
     */
    function verify(uint256 tokenId) public returns (bytes32) {
        address sender = address(this);

        require(
            !requestPending[sender],
            "Sender already has a pending request"
        );

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

    /**
     * @dev Fulfills the Chainlink request and reserves the tokenId.
     * @param requestId The Chainlink request ID.
     */
    function fulfill(bytes32 requestId) public {
        Request storage request = requests[requestId];

        // TODO: Add validator before minting the token. Only the sender should be able to mint!
        owners[request.tokenId] = msg.sender;
        fulfills += 1;

        delete requestPending[request.sender];
    }

    /**
     * @dev Checks if a tokenId is reserved.
     * @param tokenId The tokenId to check.
     * @return true if the tokenId is reserved, false otherwise.
     */
    function isReserved(uint256 tokenId) public view returns (bool) {
        return reserved[tokenId];
    }

    /**
     * @dev Reserves a tokenId.
     * @param tokenId The tokenId to be reserved.
     * @return true if the tokenId is successfully reserved.
     */
    function reserve(
        uint256 tokenId /*checkBalance(msg.sender)*/
    ) public returns (bool) {
        // bytes32 reqID = verify(tokenId);
        bytes32 fake_reqID = 0x0000000000000000000000000000000000000000000000000000000000000000;
        fulfill(fake_reqID);
        reserved[tokenId] = true;
        assetPrice[tokenId] = 10000;
        // uint(
        //     keccak256(abi.encodePacked(msg.sender, block.timestamp, randNo))
        // );
        return true;
    }

    /**
     * @dev Gets the owner address of a tokenId.
     * @param tokenId The tokenId to check.
     * @return The address of the tokenId owner.
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        return owners[tokenId];
    }

    function getAssetPricing(uint256 tokenId) public view returns (uint256) {
        return assetPrice[tokenId];
    }

    /**
     * @dev Converts a string to bytes32.
     * @param source The string to convert.
     * @return result The bytes32 representation of the string.
     */
    function stringToBytes32(
        string memory source
    ) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}
