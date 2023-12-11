const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const walletBalance = await hre.ethers.deployContract("WalletBalance")
  console.log(`WalletBalance deployed to: ${walletBalance.target}`)

  const reserver = await hre.ethers.deployContract("Reserver", [walletBalance.target])
  console.log(`Reserver deployed to: ${reserver.target}`)

  const fractionalizedNFT = await hre.ethers.deployContract("FractionalizedNFT", [deployer.address, reserver.target, "https://ipfs/"])
  console.log(`FractionalizedNFT deployed to: ${fractionalizedNFT.target}`)
  // 0xF373be196cc08599Bf3aC9033fC3E46426237FFE

  const matic = await hre.ethers.deployContract("Matic", [ethers.parseEther("1000000000")]);
  console.log(`matic deployed to: ${matic.target}`)

  const priceConsumerV3 = await hre.ethers.deployContract("PriceConsumerV3");
  console.log(`priceConsumerV3 deployed to: ${priceConsumerV3.target}`)

  const marketplace = await hre.ethers.deployContract("MarketPlace", [fractionalizedNFT.target, matic.target, priceConsumerV3.target])
  console.log(`Marketplace deployed at ${marketplace.target}`)


  // Verify contracts on Mumbai testnet after deployment
  // if (hre.network.name === "mumbai") {
  //   console.log("Verifying contracts...");
  //   await hre.run("verify", {
  //     address: fractionalizedNFT.target,
  //     constructorArguments: [deployer.address, "https://meisamtaher.github.io/real-token/"]
  //   });
  //   await hre.run("verify", {
  //     address: matic.target,
  //     constructorArguments: [1_000_000_000_000_000]
  //   });
  //   await hre.run("verify", {
  //     address: marketplace.target,
  //     constructorArguments: [fractionalizedNFT.address, matic.address]
  //   });

  //   console.log("Contracts verified successfully!");
  // }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
