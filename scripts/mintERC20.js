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
    .find((line) => line.startsWith("contractERC20="))
    .split("=")[1];

  if (!contractAddress) {
    throw new Error("ERC-20 contract address not found in contract.txt");
  }

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Create a contract instance
  const contractFactory = await hre.ethers.getContractFactory("tokenERC20");
  const contract = contractFactory.attach(contractAddress);

  // Send a shielded transaction to mint 100 tokens in the contract
  const functionName = "mint100tokens";
  const mint100TokensTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName),
    0
  );

  await mint100TokensTx.wait();

  // It should return a TransactionReceipt object
  console.log("Transaction Receipt: ", mint100TokensTx);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
