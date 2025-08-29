import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react'
import './sc-wallet-warning.css';

const EIP7702_PREFIX = '0xef0100'
const STORAGE_KEY = "@kleros/escrow/alert/smart-contract-wallet-warning";

export default function SmartContractWalletWarning() {
  const { account, library } = useWeb3React();
  const [isSmartContractWallet, setIsSmartContractWallet] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  const updateAccountWarningDismissalState = (account) => {
    try {
      const storedValue = localStorage.getItem(`${STORAGE_KEY}:${account}`)
      if (storedValue === null) {
        setShowWarning(true)
      } else {
        setShowWarning(JSON.parse(storedValue))
      }
    } catch {
      setShowWarning(true)
    }
  }

  const checkIfSmartContractWallet = (account, library) => {
    library.eth.getCode(account).then((code) => {
      const formattedCode = code.toLowerCase()
      const isEip7702Eoa = formattedCode.startsWith(EIP7702_PREFIX)

      //Do not show warning for EIP-7702 EOAs
      setIsSmartContractWallet(code !== '0x' && !isEip7702Eoa)
    }).catch((error) => {
      console.error('Error checking smart contract wallet', error)
      setIsSmartContractWallet(false)
    });
  }

  useEffect(() => {
    if (!account || !library) {
      setIsSmartContractWallet(false)
      return;
    }

    updateAccountWarningDismissalState(account);
    checkIfSmartContractWallet(account, library);
  }, [account, library]);

  if (!showWarning || !isSmartContractWallet) {
    return null;
  }

  const handleClose = () => {
    setShowWarning(false);
    localStorage.setItem(`${STORAGE_KEY}:${account}`, false);
  }

  return (
    <div className="sc-wallet-warning">
      <p>
        You are using a smart contract wallet. This is not recommended.{" "}
        <a
          href="https://docs.kleros.io/kleros-faq#can-i-use-a-smart-contract-account-to-stake-in-the-court"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more.
        </a>
      </p>
      <button onClick={handleClose}>X</button>
    </div>
  );
}