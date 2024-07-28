// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

// Function to send a shielded transaction using the provided signer, destination, data, and value
const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpcLink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  // Path to the contract address file
  const filePath = path.join(__dirname, "../storage/contract.txt");

  // Read the contract address from the file
  const contractData = fs.readFileSync(filePath, "utf8");
  const contractAddress = contractData
    .split("\n")
    .find((line) => line.startsWith("contractPrivateNFT="))
    .split("=")[1];

  if (!contractAddress) {
    throw new Error("ERC-721 contract address not found in contract.txt");
  }

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Create a contract instance
  const contractFactory = await hre.ethers.getContractFactory("privateNFT");
  const contract = contractFactory.attach(contractAddress);

  // Encode mint function call
  const functionName = "mint";
  const recipient = "0xba3BBfdae95753be6B11EF1eaf1b9cbB2cd9b1ac"; // Replace with the actual recipient address
  const data = contract.interface.encodeFunctionData(functionName, [recipient]);

  // Send a shielded transaction to mint a new token
  const mintTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    data,
    0
  );

  await mintTx.wait();

  // It should return a TransactionReceipt object
  console.log("Transaction Receipt: ", mintTx);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
