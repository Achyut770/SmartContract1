const REACT_APP_ALCHEMY_KEY = "wss://polygon-mainnet.g.alchemy.com/v2/4Zil_C6vjzk3vvFSKHFV9R6ts8Jt63rB";
const SMART_CONTRACT_ADDRESS = "0xAC18EAB6592F5fF6F9aCf5E0DCE0Df8E49124C06";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(REACT_APP_ALCHEMY_KEY);

const contractABI = require("./jsonData.json"); // update the path to where you save the abi.json file provided at the bottom of this document or can be fetched from the contract address

export const testContract = new web3.eth.Contract(
 contractABI,
 SMART_CONTRACT_ADDRESS
 );



 