// Import the necessary libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");
const bs58 = require("bs58");
const { UintBigInt64 } = require("@nomicfoundation/ethereumjs-util/dist/ssz");
// const { bytesToBigInt } = require("@nomicfoundation/ethereumjs-util");

// const keccak256 = require("keccak256");

// Describe the test suite
describe("FractionalizedNFT Contract", function () {
  let fractionalizedNFT;
  let reserver;
  let owner;
  let user1;
  let user2;

  // Deploy the contract before each test
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();



    const WalletBalance = await ethers.getContractFactory("WalletBalance");
    const walletBalance = await WalletBalance.deploy();


    const Reserver = await ethers.getContractFactory("Reserver");

    reserver = await Reserver.deploy(walletBalance.target);

    const FractionalizedNFT = await ethers.getContractFactory(
      "FractionalizedNFT"
    );
    fractionalizedNFT = await FractionalizedNFT.deploy(
      owner.address,
      reserver.target,
      "https://example.com/"
    );
    // await fractionalizedNFT.deployed();
  });

  // Test the mint function
  it.only("Should mint a new token with the correct ownership", async function () {
    // [owner, user1, user2] = await ethers.getSigners();
    // Mint a new token
    const ipfsCid = "QmVd9NV6QDK2MoEEcj2RtUbiXC3MaNjHmud2xFUMTs9xmZ";
    let metadata = ipfsCid;
    let id = 0;
    id = ethers.keccak256("0x" + bs58.decode(ipfsCid).toString("hex"));

    console.log(id);


    await reserver.reserve(id);


    const mintTx = (
      await fractionalizedNFT.mint(
        owner.address,
        id,
        metadata,
        true,
        ethers.encodeBytes32String("data")
      )
    ).wait();
    // Wait for the transaction to be mined
    // await mintTx.wait();

    // Listen for the TokenMinted event
    const eventFilter = fractionalizedNFT.filters.TokenMinted();
    const events = await fractionalizedNFT.queryFilter(
      eventFilter,
      mintTx.blockHash
    );
    // Ensure that at least one event was emitted
    expect(events.length).to.be.at.least(1);
    // Get the tokenId from the emitted event
    const tokenId = events[0].args.tokenId;
    console.log("Token ID: " + tokenId);

    // Verify the state after minting
    const finalBalance = await fractionalizedNFT.balanceOf(
      owner.address,
      tokenId
    );
    const ownershipAmount = await fractionalizedNFT.getOwnershipAmount(
      owner.address,
      tokenId
    );
    const ownershipPercentage = await fractionalizedNFT.getOwnershipPercentage(
      owner.address,
      tokenId
    );

    const tokenMetadata = await fractionalizedNFT.getMetadata(tokenId);

    const maxAmount = await fractionalizedNFT.MAX_TOKEN_AMOUNT();
    expect(finalBalance).to.equal(ownershipAmount);
    expect(finalBalance).to.equal(maxAmount);
    expect(ownershipPercentage).to.equal(100);
    expect(tokenMetadata).to.equal(metadata);
  });

  it("Should return uri of the token correctly", async function () {
    // Mint a new token
    const ipfsCid = "QmVd9NV6QDK2MoEEcj2RtUbiXC3MaNjHmud2xFUMTs9xmZ";
    let metadata = ipfsCid;
    const tokenId = ethers.keccak256(
      "0x" + bs58.decode(ipfsCid).toString("hex")
    );

    console.log(tokenId);

    const mintTx = (
      await fractionalizedNFT.mint(
        owner.address,
        tokenId,
        metadata,
        false,
        ethers.encodeBytes32String("data")
      )
    ).wait();
    // Wait for the transaction to be mined
    // await mintTx.wait();

    const publicUri = "https://example.com/";
    const tokenMetadata = await fractionalizedNFT.getMetadata(tokenId);
    const tokenUri = publicUri + tokenMetadata;
    console.log(tokenUri);

    const uri = await fractionalizedNFT.uri(tokenId);
    expect(uri).to.equal(tokenUri);
  });

  it("Should not mint a new token with repetitive token ID", async function () {
    // Mint a new token
    const ipfsCid = "QmVd9NV6QDK2MoEEcj2RtUbiXC3MaNjHmud2xFUMTs9xmZ";
    let metadata = ipfsCid;
    let id = 0;
    id = ethers.keccak256("0x" + bs58.decode(ipfsCid).toString("hex"));

    console.log(id);

    await fractionalizedNFT.mint(
      owner.address,
      id,
      metadata,
      false,
      ethers.encodeBytes32String("data")
    );

    await expect(
      fractionalizedNFT.mint(
        owner.address,
        id,
        metadata,
        false,
        ethers.encodeBytes32String("data")
      )
    ).to.be.revertedWith("Invalid token ID");
  });

  // Test the mintBatch function
  it("Should mint multiple tokens with the correct ownership", async function () {
    const count = 5;
    // const data = ethers.encodeBytes32String("data");
    [owner, user1, user2] = await ethers.getSigners();

    const mintBatchTx = await fractionalizedNFT.mintBatch(
      owner.address,
      count,
      ethers.encodeBytes32String("batch mint data")
    );

    // Wait for the transaction to be mined
    await mintBatchTx.wait();

    // Listen for the TokenMinted event
    const eventFilter = fractionalizedNFT.filters.TokenMinted();
    const events = await fractionalizedNFT.queryFilter(
      eventFilter,
      mintBatchTx.blockHash
    );
    // Ensure that at least one event was emitted
    expect(events.length).to.be.at.least(1);
    let tokenIds = [];
    for (i = 0; i < count; i++) {
      // Get the tokenId from the emitted event
      tokenIds.push(events[i].args.tokenId);
      console.log(`Token ID ${i} is: ${tokenIds[i]}`);
    }
    const maxAmount = await fractionalizedNFT.MAX_TOKEN_AMOUNT();

    for (i = 0; i < count; i++) {
      // Verify the state after minting
      const finalBalance = await fractionalizedNFT.balanceOf(
        owner.address,
        tokenIds[i]
      );
      const ownershipAmount = await fractionalizedNFT.getOwnershipAmount(
        owner.address,
        tokenIds[i]
      );
      const ownershipPercentage =
        await fractionalizedNFT.getOwnershipPercentage(
          owner.address,
          tokenIds[i]
        );

      expect(finalBalance).to.equal(ownershipAmount);
      expect(finalBalance).to.equal(maxAmount);
      expect(ownershipPercentage).to.equal(100);
    }
  });

  // Test the transfer function
  it("Should transfer ownership of tokens", async function () {
    [owner, user1, user2] = await ethers.getSigners();
    // Mint a new token
    const mintTx = (
      await fractionalizedNFT.mint(
        owner.address,
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
    const tokenId = events[0].args.tokenId;
    console.log("Token ID: " + tokenId);

    const initialOwnership = await fractionalizedNFT.getOwnershipAmount(
      owner.address,
      tokenId
    );

    await fractionalizedNFT.transfer(
      owner.address,
      user1.address,
      tokenId,
      500,
      ethers.encodeBytes32String("data")
    );

    const finalOwnershipOwner = await fractionalizedNFT.getOwnershipAmount(
      owner.address,
      tokenId
    );
    const finalOwnershipUser1 = await fractionalizedNFT.getOwnershipAmount(
      user1.address,
      tokenId
    );

    expect(initialOwnership).to.equal(10000);
    expect(finalOwnershipOwner).to.equal(
      BigInt(initialOwnership) - BigInt(500)
    );
    expect(finalOwnershipUser1).to.equal(500);
  });

  // Test the approval and transferFrom functions
  it("Should approve and transfer ownership of tokens", async function () {
    [owner, user1, user2] = await ethers.getSigners();
    // Mint a new token
    const mintTx = (
      await fractionalizedNFT.mint(
        owner.address,
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
    const tokenId = events[0].args.tokenId;
    console.log("Token ID: " + tokenId);

    const initialOwnership = await fractionalizedNFT.getOwnershipAmount(
      owner.address,
      tokenId
    );

    // Approve user1 to spend 1000 tokens
    await fractionalizedNFT.approve(tokenId, user1.address, 1000);

    const initialAllowance = await fractionalizedNFT.allowance(
      tokenId,
      user1.address
    );

    // TransferFrom owner to user1
    await fractionalizedNFT
      .connect(user1)
      .transferFrom(
        owner.address,
        user2.address,
        tokenId,
        500,
        ethers.encodeBytes32String("data")
      );

    const finalOwnershipOwner = await fractionalizedNFT.getOwnershipAmount(
      owner.address,
      tokenId
    );

    const finalOwnershipUser2 = await fractionalizedNFT.getOwnershipAmount(
      user2.address,
      tokenId
    );

    const finalAllowance = await fractionalizedNFT.allowance(
      tokenId,
      user1.address
    );

    expect(initialAllowance).to.equal(1000);
    expect(finalAllowance).to.equal(500);

    expect(initialOwnership).to.equal(10000);
    expect(finalOwnershipOwner).to.equal(
      BigInt(initialOwnership) - BigInt(500)
    );
    expect(finalOwnershipUser2).to.equal(500);
  });

  // Test the setURI function
  it("Should set the URI by the URI_SETTER_ROLE", async function () {
    const newURI = "https://newexample.com/";

    await fractionalizedNFT.setURI(newURI);
    const updatedURI = await fractionalizedNFT.uri(0);

    expect(updatedURI).to.equal(newURI);
  });

  it("Should convert CID to uint as tokenId", async function () {
    const ipfsCid = "QmVd9NV6QDK2MoEEcj2RtUbiXC3MaNjHmud2xFUMTs9xmZ";

    // const ipfsCid = "QmVd9NV6QDK2MoEEcj2RtUb";
    // const bytes = ipfsCid.slice(2);
    // Decode the Base58 encoded CID to bytes
    // const bytes = bs58.decode(ipfsCid).slice(2);

    // console.log("bytes: ", bytes);
    // const byteArray = Array.from(bytes);
    // console.log(byteArray);

    // const stringNumber = byteArray
    //   .map((byte) => byte.toString(16).padStart(2, "0"))
    //   .join("");
    // const hexNumber = "0x" + stringNumber;
    // console.log(hexNumber);
    // 0x6c3b826288a48a18dca292b7dc28fe6a4ceed9ac0478a1c1594d332e9f67edf4

    // const bigIntValue = BigInt("0x" + stringNumber);
    // 48954931507304710041103942192293271063133409996476669491657153276541992955380

    // console.log(cleanedBytes);
    // Convert bytes to a hexadecimal string with a specific length (64 characters)
    // const hexString = bytes.toString("hex").padStart(64, "0");
    // console.log(stringNumber);
    // 0x01a9499b87006b6d54ac77045c5d523a87ef2764a3034b68a8cf99132e9f67edf4
    // Convert the hexadecimal string to a BigInt
    // const bigIntValue = BigInt(stringNumber);
    const bigIntValue = BigInt(
      "0x" + bs58.decode(ipfsCid).slice(2).toString("hex")
    );
    // console.log(bigIntValue);
    // 192363013893937782652106313025255034271424069164663277553715655256553673977332n

    console.log("Let's mint ---------------------");

    const mintTx = (
      await fractionalizedNFT.mint(
        owner.address,
        bigIntValue,
        "metadata",
        false,
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
    const tokenId = events[0].args.tokenId;
    console.log("Token ID: " + tokenId);
  });
});
