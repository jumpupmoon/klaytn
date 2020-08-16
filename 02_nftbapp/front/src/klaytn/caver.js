import Caver from 'caver-js';

const AuctionsABI = require('@/contracts/Auctions.json').abi;
const MyNFTABI = require('@/contracts/MyNFT.json').abi;

const TEST_NET = 'https://api.baobab.klaytn.net:8651';

export const config = {
    rpcURL: TEST_NET
}

const MYNFT_CA = '0x355aa06969a5fbf92fbb6abac3941e62d9d9fae6';
const AUCTIONS_CA = '0x690fe1d2b5ac55e807295a72c1f40cb106b625cb';

const cav = new Caver(config.rpcURL);

const getMyNFTInstance = () => {
    const contractInstance = MyNFTABI
        && MYNFT_CA
        && new cav.klay.Contract(MyNFTABI, MYNFT_CA);
    return contractInstance;
}

const getAuctionsInstance = () => {
    const contractInstance = AuctionsABI
        && AUCTIONS_CA
        && new cav.klay.Contract(AuctionsABI, AUCTIONS_CA);
    return contractInstance;
}

export {cav, MYNFT_CA, AUCTIONS_CA, getMyNFTInstance, getAuctionsInstance}