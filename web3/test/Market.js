// Import the necessary libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

const AddressZero = "0x0000000000000000000000000000000000000000";

// Describe the test suite
describe("MarketPlace Contract", function () {
  let fractionalizedNFT;
  let matic;
  let marketplace;
  let owner;
  let user1;
  let user2;
  let tokenId;

  // Deploy the contract before each test
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const FractionalizedNFT = await ethers.getContractFactory(
      "FractionalizedNFT"
    );
    fractionalizedNFT = await FractionalizedNFT.deploy(
      owner.address,
      "https://example.com/"
    );

    const Matic = await ethers.getContractFactory("Matic");
    matic = await Matic.deploy(ethers.parseEther("1000000000"));

    const MarketPlace = await ethers.getContractFactory("MarketPlace");
    marketplace = await MarketPlace.deploy(
      fractionalizedNFT.target,
      matic.target
    );

    console.log(await matic.balanceOf(owner.address));
    await matic.transfer(user2.address, ethers.parseEther("150"));
    console.log(await matic.balanceOf(user2.address));
  });

  it("Should list token for sale", async function () {
    // Mint some tokens to user1
    const mintTx = (
      await fractionalizedNFT.mint(
        user1.address,
        ethers.encodeBytes32String("data")
      )
    ).wait();
    // Listen for the TokenMinted event
    const eventFilter = fractionalizedNFT.filters.TokenMinted();
    const events = await fractionalizedNFT.queryFilter(
      eventFilter,
      mintTx.blockHash
    );
    // Ensure that at least one event was emitted
    expect(events.length).to.be.at.least(1);
    // Get the tokenId from the emitted event
    tokenId = events[0].args.tokenId;
    console.log("Token ID: " + tokenId);

    // Allow the marketplace contract to transfer tokens on behalf of user1
    await fractionalizedNFT
      .connect(user1)
      .approve(tokenId, marketplace.target, 100);

    // List the token for sale
    await marketplace
      .connect(user1)
      .listTokenForSale(tokenId, 100, ethers.parseEther("1"));

    // Check if the token is listed
    const listedToken = await marketplace.listedTokens(tokenId);
    expect(listedToken.tokenId).to.equal(tokenId);
    expect(listedToken.seller).to.equal(user1.address);
    expect(listedToken.amount).to.equal(100);
    expect(listedToken.price).to.equal(ethers.parseEther("1"));
  });

  it("Should remove token from sale", async function () {
    // Mint some tokens to user1
    const mintTx = (
      await fractionalizedNFT.mint(
        user1.address,
        ethers.encodeBytes32String("data")
      )
    ).wait();
    // Listen for the TokenMinted event
    const eventFilter = fractionalizedNFT.filters.TokenMinted();
    const events = await fractionalizedNFT.queryFilter(
      eventFilter,
      mintTx.blockHash
    );
    // Ensure that at least one event was emitted
    expect(events.length).to.be.at.least(1);
    // Get the tokenId from the emitted event
    tokenId = events[0].args.tokenId;
    console.log("Token ID: " + tokenId);

    // Allow the marketplace contract to transfer tokens on behalf of user1
    await fractionalizedNFT
      .connect(user1)
      .approve(tokenId, marketplace.target, 100);

    // List the token for sale
    await marketplace
      .connect(user1)
      .listTokenForSale(tokenId, 100, ethers.parseEther("1"));

    // Remove the token from sale
    await marketplace.connect(user1).removeTokenFromSale(tokenId);
    await fractionalizedNFT
      .connect(user1)
      .removeApproval(marketplace.target, tokenId);

    // Check if the token is removed from sale
    const listedToken = await marketplace.listedTokens(tokenId);
    // Seller
    expect(listedToken[0]).to.equal(AddressZero);
    // TokenId
    expect(listedToken[1]).to.equal(0);
    // Amount
    expect(listedToken[2]).to.equal(0);
    // Price
    expect(listedToken[3]).to.equal(0);
  });

  it.only("Should buy a token", async function () {
    // Mint some tokens to user1
    const mintTx = (
      await fractionalizedNFT.mint(
        user1.address,
        ethers.encodeBytes32String("data")
      )
    ).wait();
    // Listen for the TokenMinted event
    const eventFilter = fractionalizedNFT.filters.TokenMinted();
    const events = await fractionalizedNFT.queryFilter(
      eventFilter,
      mintTx.blockHash
    );
    // Ensure that at least one event was emitted
    expect(events.length).to.be.at.least(1);
    // Get the tokenId from the emitted event
    tokenId = events[0].args.tokenId;
    console.log("Token ID: " + tokenId);

    // Allow the marketplace contract to transfer tokens on behalf of user1
    await fractionalizedNFT
      .connect(user1)
      .approve(tokenId, marketplace.target, 100);

    // List the token for sale
    await marketplace
      .connect(user1)
      .listTokenForSale(tokenId, 100, ethers.parseEther("1"));

    await matic
      .connect(user2)
      .approve(marketplace.target, ethers.parseEther("100"));

    // Buy a token from user1
    await marketplace
      .connect(user2)
      .buyToken(tokenId, 100, ethers.encodeBytes32String("data"));

    // Check if the ownership is transferred and the listed token is updated
    const tokenOwnership = await fractionalizedNFT.getOwnershipAmount(
      user2.address,
      tokenId
    );
    const listedToken = await marketplace.listedTokens(tokenId);

    expect(tokenOwnership).to.equal(100);
    expect(listedToken[2]).to.equal(0);
  });

  // Add more tests for other functions in the MarketPlace contract
});
