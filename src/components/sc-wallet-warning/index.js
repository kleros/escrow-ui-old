import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react'
import { web3 } from '../../bootstrap/dapp-api';
import './sc-wallet-warning.css';

const storageKey = "@kleros/escrow/alert/smart-contract-wallet-warning";

export default function SmartContractWalletWarning() {
  const { account } = useWeb3React();
  const [isSmartContractWallet, setIsSmartContractWallet] = useState(false);
  const [showWarning, setShowWarning] = useState(() => {
    try {
      const storedValue = localStorage.getItem(storageKey);
      if (storedValue === null) return true;
      return JSON.parse(storedValue);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    web3.eth.getCode(account).then((code) => {
      setIsSmartContractWallet(code !== "0x");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  if (!showWarning || !isSmartContractWallet) {
    return null;
  }

  const handleClose = () => {
    setShowWarning(false);
    localStorage.setItem(storageKey, false);
  }

  return (
    <div className="sc-wallet-warning">
      <p>You are using a smart contract wallet. This is not recommended.</p>
      <button onClick={handleClose}>X</button>
    </div>
  );
}