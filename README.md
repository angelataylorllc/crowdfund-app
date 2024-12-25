# Crowdfund DApp

This project is a decentralized crowdfunding platform built using Solidity, Hardhat, and Next.js. Users can create campaigns, view existing campaigns, and donate to campaigns directly on the blockchain.

## Features
- **Create Campaigns**: Users can create crowdfunding campaigns with a title, description, funding target, and deadline.
- **View Campaigns**: All active campaigns are displayed with details like title, description, target amount, amount raised, and days left.
- **Donate to Campaigns**: Users can contribute to campaigns using Ether.
- **Blockchain Integration**: The platform uses smart contracts for campaign management and transactions.

## Technology Stack
- **Frontend**: React with Next.js and Tailwind CSS
- **Backend**: Solidity smart contracts deployed using Hardhat
- **Blockchain**: Local Ethereum network simulated using Hardhat

## Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js
- npm or yarn
- MetaMask browser extension

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/angelataylorllc/crowdfund-app.git
   cd crowdfund-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start a local blockchain:
   ```bash
   npx hardhat node
   ```

4. Deploy the smart contracts:
   ```bash
   npx hardhat run ignition/modules/CrowdFunding.js --network localhost
   ```
   This will display the contract address. Note this address as it needs to be configured in the frontend.

5. Update the frontend configuration:
   Open `Context/CrowdFunding.js` and update the contract address to match the one from the deployment.

6. Start the development server:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to use the application.

### Usage
1. Connect your MetaMask wallet to the local blockchain network.
2. Create a campaign by filling in the required details.
3. View campaigns and donate Ether to support them.

## File Structure
- **Components/**: Contains reusable React components like `NavBar`, `Hero`, `Footer`, etc.
- **Context/**: Includes the Ethereum smart contract interface and provider logic.
- **contracts/**: Solidity source files for the Crowdfunding smart contract.
- **ignition/**: Deployment scripts for Hardhat.
- **test/**: Test files for smart contracts using Hardhat.

## Smart Contract Details
The `CrowdFunding.sol` smart contract handles:
- Creating campaigns
- Storing campaign details
- Accepting and tracking donations

## Key Scripts
- `npx hardhat compile`: Compiles the Solidity smart contracts.
- `npx hardhat node`: Starts a local blockchain for testing.
- `npx hardhat run <script>`: Runs a specific Hardhat script (e.g., deployment).

## Known Issues
If you encounter issues with MetaMask or transaction errors:
- Ensure MetaMask is connected to the correct local network.
- Restart the Hardhat node if necessary.
- Double-check the contract address configuration in the frontend.

## License
This project is open source and available under the [MIT License](LICENSE).

## Contributions
Contributions are welcome! Feel free to submit issues or pull requests to enhance the project.



