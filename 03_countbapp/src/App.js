import React, {useEffect, useState} from 'react';
import {cav, getContractInstance} from './klaytn/caver';

const useInput = (initialState) => {
  const [value, setValue] = useState(initialState);
  const onChange = e => {
    setValue(e.target.value);
  }
  return {value, onChange};
}

export default function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState();
  const [blockNumber, setBlockNumber] = useState('loading...');
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(false); // 펜딩 중인지 여부 체크
  const [flag, setFlag] = useState(true); // true 개인키 입력 false 키스토어
  const [keystore, setKeystore] = useState();
  const privateKey = useInput('');
  const password = useInput('');

  // 입력된 개인키로 지갑 연동
  const integrate = async () => {
    if(keystore) {
      console.log('123',keystore, password.value)
      let resule = await cav.klay.accounts.decrypt(keystore, password.value);
      console.log(resule)
      return;
      //privateKey.value = cav.klay.accounts.decrypt(keystore, password.value);
    }

    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey.value);
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
    setValue(walletInstance);
  }

  // 지갑 연동 공통 부분 및 필요한 값 셋팅(address / balance / count)
  const setValue = (wallet) => {
    cav.klay.accounts.wallet.add(wallet);
    setAddress(wallet.address);
    checkBalance(wallet.address);
    getCount();
  }

  // 클레이 잔액 확인
  const checkBalance = async (address) => {
    const balance = await cav.klay.getBalance(address);
    setBalance(cav.utils.fromPeb(balance, 'KLAY'));
  }

  // 계정 연동 해제
  const removeWallet = () => {
    cav.klay.accounts.wallet.clear();
    sessionStorage.clear();
    setAddress(null);
  }

  // 블록 번호 확인
  const getBlockNumber = async () => {
    setBlockNumber(await cav.klay.getBlockNumber());
  }

  // count 값 확인
  const getCount = async () => {
    setCount(await getContractInstance().methods.count().call());
  }

  // count +1 tx
  const plusCount = () => {
    setPending(true);
    getContractInstance().methods.plus().send({
      from: address,
      gas: '200000'
    })
    .once('receipt', receipt => {
      setPending(false);
      getCount();
      console.log(receipt);
    })
    .once('error', error => {
      setPending(false);
      alert(error.message);
    })
  }

  // count -1 tx
  const minusCount = () => {
    setPending(true);
    getContractInstance().methods.minus().send({
      from: address,
      gas: '200000'
    })
    .once('receipt', receipt => {
      setPending(false);
      getCount();
      console.log(receipt);
    })
    .once('error', error => {
      setPending(false);
      alert(error.message);
    })
  }

  // 키파일로 개인키 추출
  const changeKeyfile = e => {
    const keyfile = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = e =>  {
      try {
        if(!checkValidKeystore(e.target.result)) {
          alert('Invalid keystore file.');
          return;
        }
        setKeystore(e.target.result);
      } catch(e) {
        alert('Invalid keystore file.');
        return;
      }
    }

    fileReader.readAsText(keyfile);
  }

  // 올바른 키파일인지 체크
  const checkValidKeystore = (keystore) => {
    const parsedKeystore = JSON.parse(keystore);
    const isValidKeystore = parsedKeystore.version
      && parsedKeystore.id
      && parsedKeystore.address
      && crypto;
    
    return isValidKeystore;
  }

  // 연동시 사용할 값 변경(prvatekey or keystore)
  const changeFlag = (f) => {
    setFlag(f);
    console.log(keystore);
    setKeystore(null);
  }

  // 세션에 저장된 계정이 있는지 체크
  useEffect(() => {
    // 1초마다 블록 번호 확인
    setInterval(getBlockNumber, 1000);
    const walletFromSession = sessionStorage.getItem('walletInstance');

    // 저장된 계정이 있을 경우 계정 연동
    if(walletFromSession) {
      try {
        setValue(JSON.parse(walletFromSession));
      } catch(e) {
        sessionStorage.removeItem('walletInstance');
      }
    }
  }, [])

  return (
    <div>
      <div>block number : {blockNumber}</div>

      {address ?
        <div>
          <div>address : {address}</div>
          <div>KLAY : {balance}</div>
          <div><button onClick={removeWallet}>연동 해제</button></div>
          <hr />
          <div>현재 값 : {count}</div>
          {pending ?
            <div>pending...</div>
          :
            <div>
              <button onClick={plusCount}>+ 1</button>
              <button onClick={minusCount}>- 1</button>
            </div>
          }
          
        </div>
      :
        <div>
          <div>
            <button onClick={() => changeFlag(true)}>private key</button>
            <button onClick={() => changeFlag(false)}>key store</button>
          </div>
          {flag ?
            <input type="text" {...privateKey} />
          :
            <div>
              <input type="file" onChange={changeKeyfile} />
              <br />
              <input type="password" {...password} />
            </div>
          }
          <button onClick={integrate}>연동</button>
        </div>
      }
    </div>
  );
}