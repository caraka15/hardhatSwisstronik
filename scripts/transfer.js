// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

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

// Function to prompt user input
const promptUserInput = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
};

async function main() {
  // Prompt for recipient address and amount
  const recipientAddress = await promptUserInput("Masukkan alamat penerima: ");
  const amount = await promptUserInput(
    "Masukkan jumlah (tanpa desimal, misalnya 1 untuk 1 token): "
  );

  // Convert amount to Wei (assuming 18 decimal places)
  const amountInWei = (BigInt(amount) * BigInt(10 ** 18)).toString();

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

  // Encode the function call data
  const replace_functionName = "transfer";
  const replace_functionArgs = [recipientAddress, amountInWei];
  const encodedData = contract.interface.encodeFunctionData(
    replace_functionName,
    replace_functionArgs
  );

  // Send a shielded transaction to execute a transaction in the contract
  const transaction = await sendShieldedTransaction(
    signer,
    contractAddress,
    encodedData,
    0
  );

  await transaction.wait();

  // It should return a TransactionResponse object
  console.log("Transaction Response: ", transaction);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
