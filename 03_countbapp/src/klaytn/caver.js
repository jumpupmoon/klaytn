import Caver from 'caver-js';

const TEST_NET = 'https://api.baobab.klaytn.net:8651';
const deployedABI = require('./deployedABI.json');
const DEPLOY_ADDRESS = '0xb4bF60383C64D47F2E667f2fE8F7ED0c9380f770';

const cav = new Caver(TEST_NET);

const getContractInstance = () => {
    const contractInstance = deployedABI
        && DEPLOY_ADDRESS
        && new cav.klay.Contract(deployedABI, DEPLOY_ADDRESS);
    
    return contractInstance;
}

export {cav, getContractInstance}