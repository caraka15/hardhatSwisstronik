// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

// Function to send a shielded query using the provided provider, destination, and data
const sendShieldedQuery = async (provider, destination, data) => {
  // Get the RPC link from the network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt the call data using the SwisstronikJS function
  const [encryptedData, usedEncryptionKey] = await encryptDataField(
    rpcLink,
    data
  );

  // Execute the call/query using the provider
  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });

  // Decrypt the call result using the SwisstronikJS function
  return await decryptNodeResponse(rpcLink, response, usedEncryptionKey);
};

async function main() {
  // Path to the contract address file
  const filePath = path.join(__dirname, "../storage/contract.txt");

  // Read the contract address from the file
  const contractData = fs.readFileSync(filePath, "utf8");
  const contractAddress = contractData
    .split("\n")
    .find((line) => line.startsWith("contractERC721="))
    .split("=")[1];

  if (!contractAddress) {
    throw new Error("ERC-20 contract address not found in contract.txt");
  }
  // Address of the deployed contract

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Create a contract instance
  const replace_contractFactory = await hre.ethers.getContractFactory(
    "tokenERC20"
  );
  const contract = replace_contractFactory.attach(contractAddress);

  // Send a shielded query to retrieve balance data from the contract
  const replace_functionName = "balanceOf";
  const replace_functionArgs = ["0xe757ef385b2a4e1e0f259d442d9978f38f5fab5d"];
  const responseMessage = await sendShieldedQuery(
    signer.provider,
    contract,
    contract.interface.encodeFunctionData(
      replace_functionName,
      replace_functionArgs
    )
  );

  // Decode the Uint8Array response into a readable string
  console.log(
    "Decoded response:",
    contract.interface.decodeFunctionResult(
      replace_functionName,
      responseMessage
    )[0]
  );
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
