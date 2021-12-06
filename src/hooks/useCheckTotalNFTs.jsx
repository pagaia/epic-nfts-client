import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../data/constants.jsx"
import EpicNft from '../data/contract.abi.json';

const useCheckTotalNFTs = () => {
  // provided by the wallet
  const { ethereum } = window;

  const [totalNFTs, setTotalNFTs] = useState(null);

  const checkTotal = async () => {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, EpicNft.abi, signer);
      console.log("Checking the number of NFTs")
      const total = await connectedContract.getTotalNFTsMintedSoFar();
      setTotalNFTs(total);
    }
  }


  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkTotal();
  }, [])

  return totalNFTs;

}

export default useCheckTotalNFTs; 