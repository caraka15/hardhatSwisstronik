const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const { ethers, JsonRpcProvider } = require("ethers"); // Tambahkan ini untuk memastikan ethers diimpor dengan benar
const fs = require("fs");
const path = require("path");
// Masukkan alamat kontrak secara manual
const contractAddress = "0xB72Bb4913279674008929C841e8EE4Be09806931"; // Ganti dengan alamat kontrak Anda

// Function to send a shielded query using the provided provider, destination, and data
const sendShieldedQuery = async (provider, destination, data) => {
  try {
    // Get the RPC link from the network configuration
    const rpcLink = hre.network.config.url;
    console.log(`RPC Link: ${rpcLink}`);

    // Encrypt call data
    console.log("Encrypting data...");
    const [encryptedData, usedEncryptionKey] = await encryptDataField(
      rpcLink,
      data
    );
    console.log(`Encrypted Data: ${encryptedData}`);
    console.log(`Encryption Key: ${usedEncryptionKey}`);

    // Send encrypted call
    console.log("Sending encrypted call...");
    const response = await provider.send("eth_call", [
      {
        to: destination,
        data: encryptedData,
      },
      "latest",
    ]);
    console.log(`Raw Response: ${response}`);

    // Decrypt the response
    console.log("Decrypting response...");
    const decryptedResponse = await decryptNodeResponse(
      rpcLink,
      response,
      usedEncryptionKey
    );
    console.log(`Decrypted Response: ${decryptedResponse}`);

    return decryptedResponse;
  } catch (error) {
    console.error("Error in sendShieldedQuery:", error);
    throw error;
  }
};

async function main() {
  try {
    // Get the provider
    const provider = new JsonRpcProvider(hre.network.config.url);
    console.log("Provider initialized.");

    // Create a contract instance
    const contractFactory = await hre.ethers.getContractFactory("PERC20Sample");
    const contract = contractFactory.attach(contractAddress);
    console.log(`Contract attached at address: ${contractAddress}`);

    // Get the balanceOf function data
    const functionName = "balanceOf";
    const signerAddress = "0xba3BBfdae95753be6B11EF1eaf1b9cbB2cd9b1ac";
    console.log(`Signer address: ${signerAddress}`);
    const functionData = contract.interface.encodeFunctionData(functionName, [
      signerAddress,
    ]);
    console.log(`Function Data: ${functionData}`);

    // Send a shielded query to retrieve token balance
    console.log("Fetching balance...");
    const responseMessage = await sendShieldedQuery(
      provider,
      contractAddress,
      functionData
    );

    // Decode and display the result
    const balance = contract.interface.decodeFunctionResult(
      functionName,
      responseMessage
    )[0];
    console.log("Decoded balance:", ethers.utils.formatUnits(balance, 18));
  } catch (error) {
    console.error("Error fetching balance:", error);
    process.exitCode = 1;
  }
}

// Handle errors properly
main().catch((error) => {
  console.error("Error in main function:", error);
  process.exitCode = 1;
});
