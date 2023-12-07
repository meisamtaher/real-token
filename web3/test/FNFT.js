// Import the necessary libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { ethers } = require("ethers");

// Describe the test suite
describe("FractionalizedNFT Contract", function () {
  let fractionalizedNFT;
  let owner;
  let user1;
  let user2;

  // Deploy the contract before each test
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const FractionalizedNFT = await ethers.getContractFactory("FractionalizedNFT");
    fractionalizedNFT = await FractionalizedNFT.deploy(owner.address, owner.address, owner.address, "https://example.com/");
    // await fractionalizedNFT.deployed();

  });

  // Test the mint function
it.only("Should mint a new token with the correct ownership", async function () {
    // Mint a new token

    // const data = ethers.encodeBytes32String("data");
    [owner, user1, user2] = await ethers.getSigners();

    const mintTx = await fractionalizedNFT.mint(owner.address, ethers.encodeBytes32String("data"));
    // Wait for the transaction to be mined
    await mintTx.wait();
  
    // Listen for the TokenMinted event
    const eventFilter = fractionalizedNFT.filters.TokenMinted();
    const events = await fractionalizedNFT.queryFilter(eventFilter, mintTx.blockHash);
    // Ensure that at least one event was emitted
    expect(events.length).to.be.at.least(1);
    // Get the tokenId from the emitted event
    const tokenId = events[0].args.tokenId;
    console.log("Token ID: " + tokenId)

    // Verify the state after minting
    const finalBalance = await fractionalizedNFT.balanceOf(owner.address, tokenId);
    const ownershipAmount = await fractionalizedNFT.getOwnershipAmount(owner.address, tokenId);
    const ownershipPercentage = await fractionalizedNFT.getOwnershipPercentage(owner.address, tokenId);
  
    const maxAmount = await fractionalizedNFT.MAX_TOKEN_AMOUNT();
    expect(finalBalance).to.equal(ownershipAmount);
    expect(finalBalance).to.equal(maxAmount);
    expect(ownershipPercentage).to.equal(100);
  });

  

  // Test the mintBatch function
  it("Should mint multiple tokens with the correct ownership", async function () {
    const initialBalance = await fractionalizedNFT.balanceOf(owner.address, 0);

    await fractionalizedNFT.mintBatch(owner.address, 3, ethers.utils.formatBytes32String("data"));

    const finalBalance = await fractionalizedNFT.balanceOf(owner.address, 0);
    const ownership = await fractionalizedNFT.getOwnershipAmount(owner.address, 0);

    expect(finalBalance).to.equal(initialBalance.add(3));
    expect(ownership).to.equal(10000);
  });

  // Test the transfer function
  it("Should transfer ownership of tokens", async function () {
    await fractionalizedNFT.mint(owner.address, ethers.utils.formatBytes32String("data"));
    const initialOwnership = await fractionalizedNFT.getOwnershipAmount(owner.address, 0);

    await fractionalizedNFT.transfer(owner.address, user1.address, 0, 500, ethers.utils.formatBytes32String("data"));

    const finalOwnershipOwner = await fractionalizedNFT.getOwnershipAmount(owner.address, 0);
    const finalOwnershipUser1 = await fractionalizedNFT.getOwnershipAmount(user1.address, 0);

    expect(finalOwnershipOwner).to.equal(initialOwnership - 500);
    expect(finalOwnershipUser1).to.equal(500);
  });

  // Test the approval and transferFrom functions
  it("Should approve and transfer ownership of tokens", async function () {
    await fractionalizedNFT.mint(owner.address, ethers.utils.formatBytes32String("data"));
    const initialOwnershipUser1 = await fractionalizedNFT.getOwnershipAmount(user1.address, 0);

    // Approve user1 to spend 500 tokens
    await fractionalizedNFT.approve(0, user1.address, 500);

    // TransferFrom owner to user1
    await fractionalizedNFT.transferFrom(owner.address, user1.address, 0, 500, ethers.utils.formatBytes32String("data"));

    const finalOwnershipUser1 = await fractionalizedNFT.getOwnershipAmount(user1.address, 0);

    expect(finalOwnershipUser1).to.equal(initialOwnershipUser1 + 500);
  });

  // Test the setURI function
  it("Should set the URI by the URI_SETTER_ROLE", async function () {
    const newURI = "https://newexample.com/";

    await fractionalizedNFT.setURI(newURI);
    const updatedURI = await fractionalizedNFT.uri(0);

    expect(updatedURI).to.equal(newURI);
  });

  // Add more tests as needed for other functions

  // ...
});

// Run the test suite
