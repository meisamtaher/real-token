const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const reserver = await hre.ethers.deployContract("Reserver")
  console.log(`Reserver deployed to: ${reserver.target}`)


  const fractionalizedNFT = await hre.ethers.deployContract("FractionalizedNFT", [deployer.address, reserver.target, "https://ipfs/"])
  console.log(`FractionalizedNFT deployed to: ${fractionalizedNFT.target}`)

  // let totalSupply = hre.ethers.parseEther(1_000_000);

  const matic = await hre.ethers.deployContract("Matic", [ethers.parseEther("1000000000")]);
  console.log(`matic deployed to: ${matic.target}`)

  const marketplace = await hre.ethers.deployContract("MarketPlace", [fractionalizedNFT.target, matic.target])
  console.log(`Marketplace deployed at ${marketplace.target}`)

  
  // fractionalizedNFT verified contract address: 0x4b3C572d006882148E165582D00505Bb8A42F4BF
  // matic verified contract address: 0xE2FAdAA12Eb035F3ec6DF726E0b851ed85961eCF
  // marketplace verified contract address: 0x3f44a9C092222779feECA72B3dEcC36133F3Eb18


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
