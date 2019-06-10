"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
  Call zap server to let it knows oracle is still online
*/
const Config = __importStar(require("./Config.json"));
const Web3 = require('web3');
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const io = require("socket.io-client");
const rq = require("request-promise");
const ZAP_SERVER = "http://localhost:8000";
exports.updateStatus = function (web3, oracle, endpoint) {
    update(web3, oracle, endpoint);
    setInterval(() => {
        update(web3, oracle, endpoint);
    }, 3 * 60 * 1000); //every  minutes
};
async function update(web3, oracle, endpoint) {
    console.log("update status");
    try {
        let time = new Date().getTime();
        const data = endpoint + ":" + time;
        console.log(data);
        let signature = await web3.eth.sign(data, oracle);
        let options = {
            method: "POST",
            uri: ZAP_SERVER + "/update",
            body: {
                data,
                signature
            },
            json: true
        };
        const result = await rq(options);
        console.log(result);
    }
    catch (e) {
        console.error(e);
    }
}
exports.connectStatus = async (web3, endpoint) => {
    let accounts = await web3.eth.getAccounts();
    let oracle = accounts[0];
    console.log(oracle);
    let socket = io(Config.STATUS_URL, { path: "/ws/", secure: true });
    socket.on("connect", async () => {
        const signature = await web3.eth.sign(endpoint, oracle);
        console.log(signature);
        socket.emit("authentication", { endpoint: "TrendSignals", signature });
    });
    socket.on("authenticated", () => {
        console.log("authenticated");
    });
    socket.on("unauthorized", () => {
        console.log("unauthorized");
    });
};
