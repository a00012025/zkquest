import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { formatEther } from "viem";

// Get private key from the environment variable
const PRIVATE_KEY: string = process.env.ZKS_PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  throw new Error("Please set ZKS_PRIVATE_KEY in the environment variables.");
}

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("NFT2");

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, [
    "ZK_QUEST",
    "ZKQ",
    "baseUri",
  ]);
  const parsedFee = formatEther(deploymentFee);
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const contract = await deployer.deploy(artifact, [
    "ZK_QUEST",
    "ZKQ",
    "baseUri",
  ]);

  //obtain the Constructor Arguments
  console.log(
    "constructor args:" +
      contract.interface.encodeDeploy(["ZK_QUEST", "ZKQ", "baseUri"])
  );

  // Show the contract info.
  const contractAddress = await contract.getAddress();
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
