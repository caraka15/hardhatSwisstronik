const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const contract = await hre.ethers.deployContract("PERC20Sample");
  await contract.waitForDeployment();

  const contractAddress = contract.target;
  console.log(`tokenPERC20 was deployed to ${contractAddress}`);

  // Path to the contract address file
  const filePath = path.join(__dirname, "../storage/contract.txt");

  // Read the existing file content
  let fileContent = "";
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, "utf8");
  }

  // Prepare the new entry for the ERC-721 contract address
  const newEntry = `contractPERC20=${contractAddress}`;

  // Update or append the new contract address entry
  const lines = fileContent.split("\n");
  const updatedLines = lines.filter(
    (line) => !line.startsWith("contractPERC20=")
  );
  updatedLines.push(newEntry);

  // Write the updated content to the file
  fs.writeFileSync(filePath, updatedLines.join("\n") + "\n", "utf8");
  console.log(`Contract address saved to ${filePath}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
