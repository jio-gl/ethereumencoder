const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy ERC20 Token
  console.log("\nDeploying ExampleToken (ERC20)...");
  const ExampleToken = await hre.ethers.getContractFactory("ExampleToken");
  const token = await ExampleToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`ExampleToken deployed to: ${tokenAddress}`);
  
  // Mint ERC20 tokens
  const mintAmount = hre.ethers.parseEther("1000000"); // 1 million tokens
  await token.mint(deployer.address, mintAmount);
  console.log(`Minted ${hre.ethers.formatEther(mintAmount)} ERC20 tokens to ${deployer.address}`);

  // Deploy ERC1155 Token
  console.log("\nDeploying ExampleMultiToken (ERC1155)...");
  const ExampleMultiToken = await hre.ethers.getContractFactory("ExampleMultiToken");
  const multiToken = await ExampleMultiToken.deploy();
  await multiToken.waitForDeployment();
  const multiTokenAddress = await multiToken.getAddress();
  console.log(`ExampleMultiToken deployed to: ${multiTokenAddress}`);

  // Mint some ERC1155 tokens
  console.log("\nMinting example ERC1155 tokens...");
  
  // Mint single tokens
  const tokenIds = [1, 2, 3, 4, 5];
  const amounts = [100, 200, 300, 400, 500];
  
  for (let i = 0; i < tokenIds.length; i++) {
    await multiToken.mint(deployer.address, tokenIds[i], amounts[i], "0x");
    console.log(`Minted ${amounts[i]} tokens of id ${tokenIds[i]}`);
  }

  // Mint batch
  const batchIds = [10, 11, 12];
  const batchAmounts = [1000, 2000, 3000];
  await multiToken.mintBatch(deployer.address, batchIds, batchAmounts, "0x");
  console.log(`Batch minted tokens: [${batchIds}] with amounts [${batchAmounts}]`);

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("ExampleToken (ERC20):", tokenAddress);
  console.log("ExampleMultiToken (ERC1155):", multiTokenAddress);
  console.log("\nNow you can test array parameters with the mintBatch function!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 