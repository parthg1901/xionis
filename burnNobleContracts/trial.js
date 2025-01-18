const { ethers } = require('ethers');
require('dotenv').config();

// USDC Contract ABI - Only including transfer function
const USDC_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)"
];

// Arbitrum Sepolia USDC contract address
const USDC_CONTRACT_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";

async function transferUSDC(recipientAddress) {
    try {
        // Connect to Arbitrum Sepolia
        const provider = new ethers.providers.JsonRpcProvider(
            "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
        );

        // Connect wallet using private key
        const signer = new ethers.Wallet('6b99711d264ac83b798ec10389f34afe53e6f6c6fdbb821b139aba9fd4cf9f2c', provider);

        // Initialize USDC contract
        const usdcContract = new ethers.Contract(
            USDC_CONTRACT_ADDRESS,
            USDC_ABI,
            signer
        );

        // USDC has 6 decimals
        const amount = ethers.utils.parseUnits("1.5", 6);

        // Send transaction
        const tx = await usdcContract.transfer(recipientAddress, amount);
        console.log("Transaction hash:", tx.hash);

        // Wait for transaction confirmation
        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);

        return receipt;

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Example usage
async function main() {
    const recipientAddress = "0xaC6DF62364e0A8359E5687AfB743f92750c25aD0"; // Replace with actual recipient address
    try {
        await transferUSDC(recipientAddress);
        console.log("Transfer successful!");
    } catch (error) {
        console.log("Transfer failed:", error.message);
    }
}

main();