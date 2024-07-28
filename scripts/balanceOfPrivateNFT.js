const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const fs = require("fs");
const path = require("path");

// Function to read contract address from the file
const getContractAddress = (contractName) => {
  const filePath = path.join(__dirname, "../storage/contract.txt");
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const fileContent = fs.readFileSync(filePath, "utf8");
  const regex = new RegExp(`^${contractName}=(0x[0-9a-fA-F]{40})$`, "m");
  const match = fileContent.match(regex);
  if (match) {
    return match[1];
  } else {
    throw new Error(
      `Contract address for ${contractName} not found in ${filePath}`
    );
  }
};

// Function to send a shielded query using the provided provider, destination, and data
const sendShieldedQuery = async (provider, destination, data) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData, usedEncryptionKey] = await encryptDataField(
    rpcLink,
    data
  );
  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });
  return await decryptNodeResponse(rpcLink, response, usedEncryptionKey);
};

async function main() {
  // Get the contract address from the contract.txt file
  const contractAddress = getContractAddress("contractPrivateNFT");

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Create a contract instance
  const contractFactory = await hre.ethers.getContractFactory("privateNFT");
  const contract = contractFactory.attach(contractAddress);

  // Address to check balance for
  const addressToCheck = signer.address; // You can replace this with any address you want to check

  // Send a shielded query to retrieve balance data from the contract
  const functionName = "balanceOf";
  const functionArgs = [addressToCheck];
  const responseMessage = await sendShieldedQuery(
    signer.provider,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, functionArgs)
  );

  // Decode and display the result
  console.log(
    "Decoded response:",
    contract.interface
      .decodeFunctionResult(functionName, responseMessage)[0]
      .toString()
  );
}

// Handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
