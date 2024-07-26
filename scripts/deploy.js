const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy the Swisstronik contract
  const contract = await hre.ethers.deployContract("Swisstronik", [
    "Hello Swisstronik!!",
  ]);
  await contract.waitForDeployment();

  // Get the contract address
  const contractAddress = contract.target;
  console.log(`Swisstronik contract deployed to ${contractAddress}`);

  // Path to the contract address file
  const filePath = path.join(__dirname, "../storage/contract.txt");

  // Read the existing file content
  let fileContent = "";
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, "utf8");
  }

  // Prepare the new entry for the deploy address
  const newEntry = `deploy=${contractAddress}`;

  // Update or append the new contract address entry
  const lines = fileContent.split("\n");
  const updatedLines = lines.filter((line) => !line.startsWith("deploy="));
  updatedLines.push(newEntry);

  // Write the updated content to the file
  fs.writeFileSync(filePath, updatedLines.join("\n"), "utf8");
  console.log(`Contract address saved to ${filePath}`);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
