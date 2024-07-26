# Hardhat Project Guide

## Getting Started

### Prerequisites

1. **Clone the Repository**

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Create a `.env` File**
   ```sh
   touch .env
   ```
   Add your private key to the `.env` file:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

### Hardhat Configuration

Ensure your `hardhat.config.js` is properly set up with the network configuration:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

    const { PRIVATE_KEY } = process.env;

    module.exports = {
      solidity: "0.8.20",
      networks: {
        swisstronik: {
          url: "https://json-rpc.testnet.swisstronik.com/",
          accounts: [PRIVATE_KEY], // Loaded from the .env file
        },
      },
    };
    ```

## Deploy a Simple Contract Using Hardhat

### 1. Deploy `Deploy.sol`

- Create `Deploy.sol` in the `contracts` directory.
- Create `deploy.js` in the `scripts` directory.
- Run the deployment script:
  ```sh
  npx hardhat run scripts/deploy.js --network swisstronik
  ```

### 2. Set Message

- Create `setMessage.js` in the `scripts` directory.
- Run the script to set the message:
  ```sh
  npx hardhat run scripts/setMessage.js --network swisstronik
  ```

### 3. Get Message

- Create `getMessage.js` in the `scripts` directory.
- Run the script to get the message:
  ```sh
  npx hardhat run scripts/getMessage.js --network swisstronik
  ```

## Mint 100 ERC-20 Tokens

### 1. Deploy `TokenERC20.sol`

- Create `TokenERC20.sol` in the `contracts` directory.
- Create `deployERC20.js` in the `scripts` directory.
- Run the deployment script:
  ```sh
  npx hardhat run scripts/deployERC20.js --network swisstronik
  ```

### 2. Mint ERC-20 Tokens

- Create `mintERC20.js` in the `scripts` directory.
- Run the script to mint tokens:
  ```sh
  npx hardhat run scripts/mintERC20.js --network swisstronik
  ```

### 3. Transfer Tokens

- Create `transfer.js` in the `scripts` directory.
- Run the script to transfer tokens:
  ```sh
  npx hardhat run scripts/transfer.js --network swisstronik
  ```

### 4. Check Balance (Optional)

- Create `balanceOf.js` in the `scripts` directory.
- Run the script to check balance:
  ```sh
  npx hardhat run scripts/balanceOf.js --network swisstronik
  ```

## Mint an ERC-721 Token

### 1. Deploy `TokenERC721.sol`

- Create `TokenERC721.sol` in the `contracts` directory.
- Create `deployERC721.js` in the `scripts` directory.
- Run the deployment script:
  ```sh
  npx hardhat run scripts/deployERC721.js --network swisstronik
  ```

### 2. Mint ERC-721 Tokens

- Create `mintERC721.js` in the `scripts` directory.
- Run the script to mint an NFT:
  ```sh
  npx hardhat run scripts/mintERC721.js --network swisstronik
  ```

### 3. Check Balance (Optional)

- Create `balanceOf.js` in the `scripts` directory.
- Run the script to check balance:
  ```sh
  npx hardhat run scripts/balanceOf.js --network swisstronik
  ```
