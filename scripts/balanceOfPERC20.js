const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

// Masukkan alamat kontrak secara manual
const contractAddress = "0xB72Bb4913279674008929C841e8EE4Be09806931"; // Ganti dengan alamat kontrak Anda

// Function to send a shielded query using the provided provider, destination, and data
const sendShieldedQuery = async (provider, destination, data) => {
  // Get the RPC link from the network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt call data
  const [encryptedData, usedEncryptionKey] = await encryptDataField(
    rpcLink,
    data
  );

  // Send encrypted call
  const response = await provider.send("eth_call", [
    {
      to: destination,
      data: encryptedData,
    },
    "latest",
  ]);

  // Decrypt the response
  return await decryptNodeResponse(rpcLink, response, usedEncryptionKey);
};

async function main() {
  // Get the provider
  const provider = new hre.ethers.providers.JsonRpcProvider(
    hre.network.config.url
  );

  // Create a contract instance
  const contractFactory = await hre.ethers.getContractFactory("PERC20Sample");
  const contract = contractFactory.attach(contractAddress);

  // Get the balanceOf function data
  const functionName = "balanceOf";
  const functionData = contract.interface.encodeFunctionData(functionName, [
    await provider.getSigner().getAddress(),
  ]);

  // Send a shielded query to retrieve token balance
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
  console.log("Decoded balance:", hre.ethers.utils.formatUnits(balance, 18));
}

// Handle errors properly
main().catch((error) => {
  console.error("Error fetching balance:", error);
  process.exitCode = 1;
});
