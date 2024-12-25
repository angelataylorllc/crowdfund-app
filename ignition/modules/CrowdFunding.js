const hre = require("hardhat");
//0x5FbDB2315678afecb367f032d93F642f64180aa3


async function main() {
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy(); // Deploy the contract

  // Use waitForDeployment() instead of deployed()
  await crowdFunding.waitForDeployment();

  // Use the target property instead of address
  console.log(`CrowdFunding deployed to ${crowdFunding.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
