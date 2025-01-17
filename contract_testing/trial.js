import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";

// Contract and network details
const key = "7a3b2934d1bc22357906a3cb26fd28779e2bdae96496548c3a94d8b7d12a5c63";
const rpcEndpoint = 'https://rpc.xion-testnet-1.burnt.com:443';
const contractAddress = "xion1hy7p8aq7nlvg2j4v57z5dlwtvvz7awz2wl0sx3d3qrfelt99z8uqd9p6er"; // Replace with your contract address

// Transaction details
const gasPrice = GasPrice.fromString("0.001uxion");
const recipientAddress = "noble1zh527pkk4qqzk4k3cumwgeqxz796zfzk0rmufn";
const amount = "100";
const denom = "ibc/57097251ED81A232CE3C9D899E7C8096D6D87EF84BA203E12E424AA4C9B57A64";
const timeoutSeconds = 300;

async function main() {
    // Create a wallet from the private key
    const wallet = await DirectSecp256k1Wallet.fromKey(
        Buffer.from(key, 'hex'),
        "xion"
    );

    // Fetch account details
    const [account] = await wallet.getAccounts();

    // Create the SigningCosmWasmClient
    const client = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        wallet,
        { gasPrice }
    );

    // Construct the message
    const executeMsg = {
        ibc_transfer: {
            recipient: recipientAddress,
            amount: amount,
            denom: denom,
            timeout_seconds: timeoutSeconds,
        },
    };


    try {
        // Execute the contract
        const result = await client.execute(
            account.address,
            contractAddress,
            executeMsg,
            "auto",
            "Executing IBC Transfer"
        );

        console.log("Transaction hash:", result.transactionHash);
        console.log("Gas used:", result.gasUsed);
        console.log("Full result:", result);
    } catch (error) {
        console.error("Error executing contract:", error);
        // Log more detailed error information
        if (error.message) {
            console.error("Error message:", error.message);
        }
        if (error.response) {
            console.error("Error response:", error.response);
        }
    }
}

main().catch(console.error);