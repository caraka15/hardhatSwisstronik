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

// Function to send a shielded transaction using the provided signer, destination, data, and value
const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  // Get the contract address from the contract.txt file
  const contractAddress = getContractAddress("deploy"); // Adjust the name as needed

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Create a contract instance
  const contractFactory = await hre.ethers.getContractFactory("Swisstronik");
  const contract = contractFactory.attach(contractAddress);

  // Set the message
  const functionName = "setMessage";
  const messageToSet = "Hello Swisstronik!!";
  const setMessageTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, [messageToSet]),
    0
  );

  // Wait for the transaction to be mined
  await setMessageTx.wait();

  // Output the transaction receipt
  console.log("Transaction Receipt: ", setMessageTx);
}

// Handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
