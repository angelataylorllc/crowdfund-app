const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Crowdfunding", function () {
  // Fixture to deploy the contract and set up the testing environment
  async function deployCrowdfundingFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    // Deploy the contract
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    const targetFunding = ethers.utils.parseEther("10.0"); // Target funding of 10 ETH
    const duration = 60 * 60 * 24 * 30; // Duration of 30 days (in seconds)
    const crowdfunding = await Crowdfunding.deploy(targetFunding, duration);

    await crowdfunding.deployed();

    return { crowdfunding, targetFunding, duration, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the correct target funding and duration", async function () {
      const { crowdfunding, targetFunding, duration } = await loadFixture(deployCrowdfundingFixture);

      expect(await crowdfunding.targetFunding()).to.equal(targetFunding);
      expect(await crowdfunding.duration()).to.equal(duration);
    });

    it("Should set the correct owner", async function () {
      const { crowdfunding, owner } = await loadFixture(deployCrowdfundingFixture);

      expect(await crowdfunding.owner()).to.equal(owner.address);
    });
  });

  describe("Contributions", function () {
    it("Should accept contributions and update total funds", async function () {
      const { crowdfunding, otherAccount } = await loadFixture(deployCrowdfundingFixture);

      const contributionAmount = ethers.utils.parseEther("1.0");
      await crowdfunding.connect(otherAccount).contribute({ value: contributionAmount });

      const totalFunds = await crowdfunding.totalContributions();
      expect(totalFunds).to.equal(contributionAmount);
    });

    it("Should emit an event on contribution", async function () {
      const { crowdfunding, otherAccount } = await loadFixture(deployCrowdfundingFixture);

      const contributionAmount = ethers.utils.parseEther("1.0");
      await expect(crowdfunding.connect(otherAccount).contribute({ value: contributionAmount }))
        .to.emit(crowdfunding, "ContributionReceived")
        .withArgs(otherAccount.address, contributionAmount);
    });

    it("Should not allow contributions after the deadline", async function () {
      const { crowdfunding, otherAccount, duration } = await loadFixture(deployCrowdfundingFixture);

      // Advance time beyond the duration
      await ethers.provider.send("evm_increaseTime", [duration + 1]);
      await ethers.provider.send("evm_mine");

      const contributionAmount = ethers.utils.parseEther("1.0");
      await expect(
        crowdfunding.connect(otherAccount).contribute({ value: contributionAmount })
      ).to.be.revertedWith("The funding period has ended");
    });
  });

  describe("Withdrawals", function () {
    it("Should allow the owner to withdraw funds after the goal is met", async function () {
      const { crowdfunding, owner, otherAccount, targetFunding } = await loadFixture(deployCrowdfundingFixture);

      // Contribute enough to meet the funding goal
      await crowdfunding.connect(otherAccount).contribute({ value: targetFunding });

      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      const tx = await crowdfunding.connect(owner).withdraw();
      await tx.wait();
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);

      expect(finalOwnerBalance).to.be.gt(initialOwnerBalance);
    });

    it("Should revert if a non-owner tries to withdraw funds", async function () {
      const { crowdfunding, otherAccount } = await loadFixture(deployCrowdfundingFixture);

      await expect(crowdfunding.connect(otherAccount).withdraw()).to.be.revertedWith("You aren't the owner");
    });

    it("Should revert if goal is not met before withdrawal", async function () {
      const { crowdfunding, owner } = await loadFixture(deployCrowdfundingFixture);

      await expect(crowdfunding.connect(owner).withdraw()).to.be.revertedWith("Funding goal not reached");
    });
  });

  describe("Refunds", function () {
    it("Should allow contributors to claim refunds if the goal is not met", async function () {
      const { crowdfunding, otherAccount } = await loadFixture(deployCrowdfundingFixture);

      const contributionAmount = ethers.utils.parseEther("1.0");
      await crowdfunding.connect(otherAccount).contribute({ value: contributionAmount });

      // Advance time beyond the funding duration
      await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 30 + 1]);
      await ethers.provider.send("evm_mine");

      const initialBalance = await ethers.provider.getBalance(otherAccount.address);
      const tx = await crowdfunding.connect(otherAccount).claimRefund();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
      const finalBalance = await ethers.provider.getBalance(otherAccount.address);

      expect(finalBalance.add(gasUsed)).to.equal(initialBalance.add(contributionAmount));
    });

    it("Should revert if a non-contributor tries to claim a refund", async function () {
      const { crowdfunding, otherAccount } = await loadFixture(deployCrowdfundingFixture);

      await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 30 + 1]);
      await ethers.provider.send("evm_mine");

      await expect(crowdfunding.connect(otherAccount).claimRefund()).to.be.revertedWith("No contributions found");
    });
  });
});
