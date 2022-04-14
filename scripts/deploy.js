const {ethers} = require("hardhat");

async function main() {
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  const deployedContract = await whitelistContract.deploy(10);

  await deployedContract.deployed();

  console.log("Whitelist Contract Address: " , deployedContract.address );
}



main()
  .then( () => process.exit(0))
  .catch(error => {
  console.log(error);
  process.exit(1);
  }) 
