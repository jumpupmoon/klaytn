import {cav, MYNFT_CA, AUCTIONS_CA, getMyNFTInstance, getAuctionsInstance} from './caver';

export default class KlaytnService {
    constructor() {}

    async init() {
        const walletFromSession = sessionStorage.getItem('walletInstance');

        if(walletFromSession) {
            try {
                const address = JSON.parse(walletFromSession).address;
                cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
                return address;
            } catch(e) {
                sessionStorage.removeItem('walletInstance');
                return false;
            }
        }
    }

    async getBalance(address) {
        const balance = await cav.klay.getBalance(address);
        return cav.utils.fromPeb(balance, 'KLAY');
    }

    async loginWithKeystore(keystore, password) {
        const {privateKey: privateKeyFromKeystore} = cav.klay.accounts.decrypt(keystore, password);
        await this.integrateWallet(privateKeyFromKeystore);
        return true;
    }

    async integrateWallet(privateKey) {
        const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
        cav.klay.accounts.wallet.add(walletInstance);
        sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
        return true;
    }

    removeWallet() {
        cav.klay.accounts.wallet.clear();
        sessionStorage.removeItem('walletInstance');
        return true;
    }

    getWallet() {
        if(cav.klay.accounts.wallet.length) {
            return cav.klay.accounts.wallet[0];
        }
        return null;
    }

    getAuctions(dispatch) {
        getAuctionsInstance().methods.getCount().call()
        .then(count => {
            if(!count) return [];
            const auctions = [];
            for(let i = count-1; i >= 0; i--) {
                const auction = getAuctionsInstance().methods.getAuctionById(i).call();
                auctions.push(auction);
            }
            return Promise.all(auctions);
        })
        .then(auctions => {
            auctions = auctions.map(async auction => {
                const auctionInfo = {};
                auctionInfo.title = auction[0];
                auctionInfo.price = cav.utils.fromPeb(auction[1], 'KLAY');
                auctionInfo.image = 'https://gateway.ifps.io/ipfs/' + auction[2];
                auctionInfo.tokenId = auction[3];
                auctionInfo.owner = await this.getOwner(auction[3]);
                auctionInfo.active = auctions[6];
                auctionInfo.finalized = auction[7];
                return auctionInfo;
            })
            return Promise.all(auctions);
        })
        .then(async auctions => dispatch(auctions));
    }

    async getOwner(tokenId) {
        const owner = await getMyNFTInstance().methods.ownerOf(tokenId).call();
        return owner;
    }

    async getAuctionOf(address) {
        const reuslt = await getAuctionsInstance().methods.getAuctionOf(address).call();
        return reuslt;
    }

    async getAuctionById(auctionId) {
        const reuslt = await getAuctionsInstance().methods.getAuctionById(auctionId).call();
        const auctionInfo = {};
        auctionInfo.title = result[0];
        auctionInfo.price = cav.utils.fromPeb(result[1], 'KLAY');
        auctionInfo.tokenId = reuslt[3];
        auctionInfo.owner = await this.getOwner(reuslt[3]);
        return auctionInfo;
    }

    createAuction(tokenId, title, metadata, price, dispatch, errorCb) {
        const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0];

        if(!walletInstance) {
            console.log('no walletInstance');
            return;
        }

        price = cav.utils.fromPeb(price, 'KLAY');

        const address = walletInstance.address;
        getAuctionsInstance().methods.createAuction(MYNFT_CA, tokenId, title. metadata, price).send({
            from: address,
            gas: '100000000'
        })
        .once('transactionHash', txHash => {
            console.log(`
                sending a transaction...
                txHash: ${txHash}
            `);
        })
        .once('receipt', receipt => {
            console.log(`
                Received receipt! (#${receipt.blockNumber}, ${receipt.transactionHash})
            `, receipt);
            dispatch(receipt);
        })
        .once('error', error => {
            errorCb(error.message);
        })
    }

    finalizeAuction(auctionId, toAddress, dispatch, errorCb) {
        const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0];

        if(!walletInstance) {
            console.log('no walletInstance');
            return;
        }

        const address = walletInstance.address;
        getAuctionsInstance().methods.finalizeAuction(auctionId, toAddress).send({
            from: address,
            gas: '1000000'
        })
        .once('transactionHash', txHash => {
            console.log(`
                sending a transaction...
                txHash: ${txHash}
            `);
        })
        .once('receipt', receipt => {
            console.log(`
                Received receipt! (#${receipt.blockNumber}, ${receipt.transactionHash})
            `, receipt);
            dispatch(receipt);
        })
        .once('error', error => {
            errorCb(error.message);
        })
    }

    registerUniqueToken(tokenId, dataURI, dispatch, errorCb) {
        const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0];

        if(!walletInstance) {
            console.log('no walletInstance');
            return;
        }

        const address = walletInstance.address;
        getMyNFTInstance().methods.registerUniqueToken(address, tokenId, dataURI).send({
            from: address,
            gas: '100000000'
        })
        .once('transactionHash', txHash => {
            console.log(`
                sending a transaction...
                txHash: ${txHash}
            `);
        })
        .once('receipt', receipt => {
            console.log(`
                Received receipt! (#${receipt.blockNumber}, ${receipt.transactionHash})
            `, receipt);
            dispatch(receipt);
        })
        .once('error', error => {
            errorCb(error.message);
        })
    }

    transferFrom(tokenId, dispatch, errorCb) {
        const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0];

        if(!walletInstance) {
            console.log('no walletInstance');
            return;
        }

        const address = walletInstance.address;
        getMyNFTInstance().methods.transferFrom(address, AUCTIONS_CA, tokenId).send({
            from: address,
            gas: '100000000'
        })
        .once('transactionHash', txHash => {
            console.log(`
                sending a transaction...
                txHash: ${txHash}
            `);
        })
        .once('receipt', receipt => {
            console.log(`
                Received receipt! (#${receipt.blockNumber}, ${receipt.transactionHash})
            `, receipt);
            dispatch(receipt);
        })
        .once('error', error => {
            errorCb(error.message);
        })
    }
}