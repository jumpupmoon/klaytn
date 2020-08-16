import {cav, getContractInstance} from './caver';

export default class KlaytnService {
    constructor() {}

    // wallet 초기화
    async init() {
        // json 형태
        const walletFromSession = sessionStorage.getItem('walletInstance');

        if(walletFromSession) {
            try {
                const address = JSON.parse(walletFromSession).address;
                // json 형태의 데이터를 파싱하여 wallet api에 추가하여 관리
                cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
                return address;
            } catch(e) {
                // 에러가 날 경우 데이터 지우기
                sessionStorage.removeItem('walletInstance');
                return false;
            }
        }
    }

    // 잔액 체크
    async getBalance(address) {
        const balance = await cav.klay.getBalance(address);
        return cav.utils.fromPeb(balance, 'KLAY');
    }

    // 키파일로 개인키 반환 받고 integrateWallet 함수 호출
    async loginWithKeystore(keystore, password) {
        const {privateKey: privateKeyFromKeystore} = cav.klay.accounts.decrypt(keystore, password);
        await this.integrateWallet(privateKeyFromKeystore);
        return true;
    }

    // wallet에 계정 추가
    integrateWallet(privateKey) {
        // 개인키를 통해 계정 가져오기
        const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
        // wallet에 계정 추가
        cav.klay.accounts.wallet.add(walletInstance);
        // 계정을 세션에 json 형태로 저장
        sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
        return true;
    }

    // wallet 지우기
    removeWallet() {
        cav.klay.accounts.wallet.clear();
        sessionStorage.removeItem('walletInstance');
        return true;
    }

    // 첫 번째 wallet 가져오기
    getWallet() {
        if(cav.klay.accounts.wallet.length) {
            return cav.klay.accounts.wallet[0];
        }
        return null;
    }

    play(number, amount, dispatch, errorCb) {
        // wallet이 연결되어 있는지 확인하고 연결되어 있다면 인스턴스를 가져온다
        const walletInstance = cav.klay.accounts.wallet && cav.klay.accounts.wallet[0];

        if(!walletInstance) {
            console.log('no walletInstance');
            return;
        }

        // 유저에게 입력 받은 klay를 peb 단위로 변환
        amount = cav.utils.toPeb(amount, 'KLAY');
        // wallet에 연결된 주소 가져오기
        const address = walletInstance.address;
        // contract에 함수 전송
        getContractInstance().methods.play(number).send({
            from: address,
            gas: '100000000',
            value: amount
        })
            // 영수증을 통해 블록 넘버와 트랜잭션 해시를 가져올 수 있음
            .once('transactionHash', txHash => {
                console.log(`
                    sending a transaction...
                    txHash: ${txHash}
                `)
            })
            // 콜백 함수
            .once('receipt', receipt => {
                console.log(`
                    Received receipt! (#${receipt.blockNumber}, ${receipt.transactionHash})
                `, receipt);
                dispatch(receipt);
            })
            // 콜백 함수
            .once('error', error => {
                errorCb(error.message);
            })
    }
}