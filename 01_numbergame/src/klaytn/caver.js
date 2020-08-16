import Caver from 'caver-js';

const deployedABI = require('./deployedABI.json');

const TEST_NET = 'https://api.baobab.klaytn.net:8651';
export const config = {
    rpcURL: TEST_NET
}
const DEPLOY_ADDRESS = '0x515889628e48A6cB1d8c7cd9114BF39ad1d4294d';

const cav = new Caver(config.rpcURL);

// abi와 address가 있을 경우 17번 실행
const getContractInstance = () => {
    const contractInstance = deployedABI
    && DEPLOY_ADDRESS
    && new cav.klay.Contract(deployedABI, DEPLOY_ADDRESS);
    return contractInstance;
}

export {cav, getContractInstance}