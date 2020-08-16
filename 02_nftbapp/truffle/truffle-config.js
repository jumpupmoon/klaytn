const HDWalletProvider = require('truffle-hdwallet-provider-klaytn');
const NETWORK_ID = '1001';
const URL = 'https://api.baobab.klaytn.net:8651';
const PRIVATE_KEY = '0x7799f99c68259cec434d35cbaf419bc1c3f8dce0b4db6f2e6a972ade4a58bdac';
require('babel-register');
//require('babel-polyfill');

module.exports = {
  networks: {
    klaytn: {
      provider: () => new HDWalletProvider(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: '8500000',
      gasPrice: null,
    }
  }
}