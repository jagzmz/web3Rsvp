"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = __importDefault(require("hardhat"));
const main = async () => {
    const rsvpContractFactory = await hardhat_1.default.ethers.getContractFactory("Web3RSVP");
    const rsvpContract = await rsvpContractFactory.deploy();
    await rsvpContract.deployed();
    console.log("Contract deployed to:", rsvpContract.address);
    const [deployer, address1, address2] = await hardhat_1.default.ethers.getSigners();
    let deposit = hardhat_1.default.ethers.utils.parseEther("1");
    let maxCapacity = 3;
    let timestamp = 1718926200;
    let eventDataCID = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";
    let txn = await rsvpContract.createNewEvent(timestamp, deposit, maxCapacity, eventDataCID);
    let wait = await txn.wait();
    console.log("NEW EVENT CREATED:", wait.events[0].event, wait.events[0].args);
    let eventID = wait.events[0].args.eventID;
    console.log("EVENT ID:", eventID);
    txn = await rsvpContract.createNewRSVP(eventID, { value: deposit });
    wait = await txn.wait();
    console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);
    txn = await rsvpContract
        .connect(address1)
        .createNewRSVP(eventID, { value: deposit });
    wait = await txn.wait();
    console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);
    txn = await rsvpContract
        .connect(address2)
        .createNewRSVP(eventID, { value: deposit });
    wait = await txn.wait();
    console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);
    txn = await rsvpContract.confirmAllAttendees(eventID);
    wait = await txn.wait();
    wait.events.forEach((event) => console.log("CONFIRMED:", event.args.attendeeAddress));
    // wait 10 years
    await hardhat_1.default.network.provider.send("evm_increaseTime", [15778800000000]);
    txn = await rsvpContract.withdrawUnclaimedDeposits(eventID);
    wait = await txn.wait();
    console.log("WITHDRAWN:", wait.events[0].event, wait.events[0].args);
};
const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
runMain();
