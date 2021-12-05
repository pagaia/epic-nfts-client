import React, { useEffect, useState } from "react";
import { ethers } from "ethers";


const useCheckWallet = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const { ethereum } = window;

  const checkIfWalletIsConnected = async () => {
    try {

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
    * Implement your connectWallet method here
    */
  const connectWallet = async () => {
    try {

      if (!ethereum) {
        alert("In order to connect you wallet please get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return [currentAccount, connectWallet]

}

export default useCheckWallet; 