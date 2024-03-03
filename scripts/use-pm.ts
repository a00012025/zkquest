import { createWalletClient, http, parseEther } from "viem";
import { eip712WalletActions } from "viem/zksync";
import { utils } from "zksync-ethers";
import { zkSyncSepoliaTestnet } from "viem/zksync";
import { hexlify } from "ethers";
import { privateKeyToAccount } from "viem/accounts";

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

// Initialize and extend the wallet client
const walletClient = createWalletClient({
  account,
  chain: zkSyncSepoliaTestnet,
  transport: http(),
}).extend(eip712WalletActions());

const paymasterAddress = "0x5605861a1B057394026640f048c22B3763837E03"; // Replace with your paymaster address
const params = utils.getPaymasterParams(paymasterAddress, {
  type: "General",
  innerInput: new Uint8Array(),
});
console.log(hexlify(params.paymasterInput));

async function main() {
  // Send the transaction example
  const hash = await walletClient.sendTransaction({
    chain: zkSyncSepoliaTestnet,
    account,
    to: "0xFac041BCF2c4b43319c2C0a39ABA53F4CbE44Fe5",
    value: parseEther("0.005"),
    paymaster: paymasterAddress as `0x${string}`,
    paymasterInput: hexlify(params.paymasterInput) as `0x${string}`,
    gasPerPubdata: BigInt(utils.DEFAULT_GAS_PER_PUBDATA_LIMIT) + 60000n,
    maxFeePerGas: parseEther("0.0000001"),
  });
  console.log(`Transaction hash: ${hash}`);
}

main().catch(console.error);
