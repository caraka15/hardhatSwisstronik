const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy the contract
  const contract = await hre.ethers.deployContract("privateNFT");

  await contract.waitForDeployment();

  const contractAddress = contract.target;
  console.log(`Contract deployed to ${contractAddress}`);

  // Prepare the text data
  const key = "contractPrivateNFT"; // Change this key based on the contract type (e.g., "contractERC721" for ERC-721 contracts)
  const newData = `${key}=${contractAddress}`;

  // Define the path to the text file
  const filePath = path.join(__dirname, "../storage/contract.txt");

  // Read the current content of the file
  let currentData = "";
  if (fs.existsSync(filePath)) {
    currentData = fs.readFileSync(filePath, "utf8");
  }

  // Prepare updated content
  // Create a regex pattern to match the current key entry if it exists
  const regex = new RegExp(`^${key}=.*$`, "m");

  // If the key already exists, replace the line, otherwise append new data
  if (regex.test(currentData)) {
    currentData = currentData.replace(regex, newData);
  } else {
    // Append new data with a newline
    currentData = currentData.trim() + (currentData ? "\n" : "") + newData;
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, currentData, "utf8");

  console.log(`Contract address saved to ${filePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
