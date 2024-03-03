import * as zk from "zksync-ethers";
import { Contract } from "ethers";
import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// Get private key from the environment variable
const PRIVATE_KEY: string = process.env.ZKS_PRIVATE_KEY || "";
if (!PRIVATE_KEY) {
  throw new Error("Please set ZKS_PRIVATE_KEY in the environment variables.");
}

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);
  const boxContract = await deployer.loadArtifact("Box");

  const beacon = await hre.zkUpgrades.deployBeacon(
    deployer.zkWallet,
    boxContract
  );
  await beacon.waitForDeployment();
  const beaconAddress = await beacon.getAddress();
  console.log("Beacon deployed!!!");
  console.log(
    "Old beacon implementation address",
    (await beacon.implementation()).toString()
  );
  console.log("Beacon owner:", (await beacon.owner()).toString());

  const beaconProxy = await hre.zkUpgrades.deployBeaconProxy(
    deployer.zkWallet,
    beaconAddress,
    boxContract,
    []
  );
  await beaconProxy.waitForDeployment();
  const beaconProxyAddress = await beaconProxy.getAddress();
  console.log("BOX beacon proxy deployed!!!");
  // console.log("old name", (await beaconProxy.name()).toString());

  const boxV2Implementation = await deployer.loadArtifact("NewBox");
  await hre.zkUpgrades.upgradeBeacon(
    deployer.zkWallet,
    beaconAddress,
    boxV2Implementation
  );
  console.log("BOX upgraded to NewBox!!!");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // try to update again
  // await beacon.upgradeTo(boxV2Implementation);

  console.log(
    "New beacon implementation address",
    (await beacon.implementation()).toString()
  );
  const attachTo = new zk.ContractFactory<any[], Contract>(
    boxV2Implementation.abi,
    boxV2Implementation.bytecode,
    deployer.zkWallet,
    deployer.deploymentType
  );
  const upgradedBox = attachTo.attach(beaconProxyAddress);
  upgradedBox.connect(wallet);

  console.log("New name", (await upgradedBox.name()).toString());
  console.log("New name", (await beaconProxy.name()).toString());

  const newBeaconImplAddress = await beacon.implementation();
  console.log("newBeaconImplAddress", newBeaconImplAddress);
  const newImplBox = attachTo.attach(newBeaconImplAddress);
  newImplBox.connect(wallet);
  console.log("New impl box name", (await newImplBox.name()).toString());
}
