"use client"; // <-- Add this at the top

import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { Contract, ethers, JsonRpcProvider, formatUnits } from "ethers";


// INTERNAL IMPORT
import { CrowdFundingABI, CrowdFundingAddress } from "./contents";

// FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
    new Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
    const titleData = "Crowd Funding Contract";
    const [currentAccount, setCurrentAccount] = useState("");

    const createCampaign = async (campaign) => {
        
        const { title, description, amount, deadline } = campaign;
        console.log("Raw input amount in Ether:", amount); // Ensure `amount` is logged correctly

    
        // Initialize Web3Modal and connect
        const web3Modal = new Web3Modal();
        await web3Modal.connect(); // Removed unused variable `connection`
        const provider = new ethers.BrowserProvider(window.ethereum); // Correct usage
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signer); // Fetch the contract instance
    
        try {
            // Log the input for debugging purposes
            console.log("Creating campaign with:", {
                title,
                description,
                amount,
                deadline,
            });
    
            // Ensure `deadline` is converted to seconds
            const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
    
            // Ensure `amount` is formatted correctly
            const formattedAmount = ethers.parseEther(String(amount));
            
    
            // Log transaction details before sending
            console.log("Transaction payload:", {
                owner: await signer.getAddress(),
                title,
                description,
                target: formattedAmount.toString(),
                deadline: deadlineTimestamp,
            });
    
            // Make the contract call
            const transaction = await contract.createCampaign(
                await signer.getAddress(), // Fetch the address from the signer
                title,
                description,
                formattedAmount, // Convert amount to Wei
                deadlineTimestamp // Use the converted timestamp
            );
    
            // Wait for the transaction to complete
            await transaction.wait();
            console.log("Contract call success", transaction);
        } catch (error) {
            console.error("Contract call failure", error);
    
            // Log detailed error information
            if (error.code && error.data) {
                console.error("Error code:", error.code);
                console.error("Error data:", error.data);
            } else {
                console.error("Error details:", error);
            }
        }
    };
    
    
    
      
    

    const getCampaigns = async () => {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
        const contract = fetchContract(provider);
      
        try {
          const campaigns = await contract.getCampaigns();
      
          const parsedCampaigns = campaigns.map((campaign, i) => {
            console.log("Original Target in Wei:", campaign.target.toString());
      
            let targetInWei = BigInt(campaign.target.toString());
            
            // Detect and correct overinflated values
            if (targetInWei > BigInt("1000000000000000000000000")) {
              console.log("Detected inflated target, correcting...");
              targetInWei = targetInWei / BigInt("1000000000000000000"); // Divide by 10^18 only once
            }
      
            const formattedTarget = ethers.formatUnits(targetInWei.toString(), 18);
            console.log("Formatted Target in ETH:", formattedTarget);
      
            return {
              owner: campaign.owner,
              title: campaign.title,
              description: campaign.description,
              target: formattedTarget, // Corrected target
              deadline: Number(campaign.deadline),
              amountCollected: ethers.formatUnits(
                campaign.amountCollected.toString(),
                18
              ),
              pId: i,
            };
          });
      
          return parsedCampaigns;
        } catch (error) {
          console.error("Error fetching campaigns:", error);
        }
      };
      
    
    

    const getUserCampaigns = async () => {
        const provider = new JsonRpcProvider("http://127.0.0.1:8545/");
        const contract = fetchContract(provider);
    
        try {
            // Fetch all campaigns from the contract
            const allCampaigns = await contract.getCampaigns();
    
            // Get the current user's account from MetaMask
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
            const currentUser = accounts[0];
    
            // Filter campaigns belonging to the current user
            const filteredCampaigns = allCampaigns.filter(
                (campaign) => campaign.owner.toLowerCase() === currentUser.toLowerCase()
            );
    
            // Map the filtered campaigns into a structured format
            const userData = filteredCampaigns.map((campaign, i) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: formatUnits(campaign.target.toString(), 18), // Convert target from wei to Ether
                deadline: Number(campaign.deadline), // Ensure deadline is a number
                amountCollected: formatUnits(
                    campaign.amountCollected.toString(), 18 // Convert collected amount from wei to Ether
                ),
                pId: i, // Assign a unique ID
            }));
    
            return userData;
        } catch (error) {
            console.error("Error fetching user campaigns:", error);
            throw error;
        }
    };
    

    const donate = async (pId, amount) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = fetchContract(signer);
    
        try {
            const campaignData = await contract.donateToCampaign(pId, {
                value: ethers.parseEther(amount),
            });
    
            await campaignData.wait();
            location.reload();
    
            return campaignData;
        } catch (error) {
            console.log("Donation failed", error);
        }
    };

    const getDonations = async (pId) => {
        const provider = new ethers.JsonRpcProvider();
        const contract = fetchContract(provider);

        const donations = await contract.getDonators(pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donations: ethers.formatUnits(donations[1][i].toString(), 18),
            });
        }

        return parsedDonations;
    };

    // CHECK IF WALLET IS CONNECTED
    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum)
                return console.log("Install MetaMask");

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log("No Account Found");
            }
        } catch (error) {
            console.log("Error connecting wallet", error);
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    // CONNECT WALLET FUNCTION
    const connectWallet = async () => {
        try {
            if (!window.ethereum) return console.log("Install MetaMask");

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log("Error connecting wallet", error);
        }
    };

    return (
        <CrowdFundingContext.Provider
            value={{
                titleData,
                currentAccount,
                createCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                connectWallet,
            }}
        >
            {children}
        </CrowdFundingContext.Provider>
    );
};
