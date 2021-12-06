import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import useCheckWallet from "./hooks/useWallet.jsx";
import useCheckTotalNFTs from "./hooks/useCheckTotalNFTs.jsx";
import { CONTRACT_ADDRESS } from "./data/constants.jsx"
import EpicNft from './data/contract.abi.json';
import { ethers } from "ethers";
import Spinner from "./Spinner.jsx";
import ErrorMessage from "./ErrorMessage.jsx";
import PreviousNfts from "./PreviousNfts.jsx";
// Constants
const TWITTER_HANDLE = 'pagaia';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  /*
 * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
 */
  //const [currentAccount, setCurrentAccount] = useState("");
  const [currentAccount, connectWallet] = useCheckWallet();
  const [minting, setMinting] = useState(false)

  // when a new NFT has been minted
  const [minted, setMinted] = useState(null);
  const totalNfts = useCheckTotalNFTs();
  const [error, setError] = useState(null);


  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );


  const askContractToMintNft = async () => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        setMinting(true);
        setMinted(false);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, EpicNft.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted",

          (from, tokenId) => {
            setMinted({ from, tokenId })
            // console.log(from, tokenId.toNumber())
            // alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
          });


        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
        setMinting(false)
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log({ error })
      setMinting(false);
      setError(error);
    }
  }

  const renderButton = () => {
    if (currentAccount === "") {
      return (
        renderNotConnectedContainer()
      )
    }
    if (minting) {
      return <Spinner />
    }

    return (
      <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
    )
  }
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Here you can find a collection of NFTs
          </p>
          <p className="italic text-pink-600 m-2">
            Already {totalNfts && totalNfts.toString()} NFTs minted
          </p>
          {renderButton()}
          {minted && <div className="twitter-links">
            <div><a href={`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${minted.tokenId}`}>Look your NFT on OpenSea</a>
            </div>
            <div >
              <a href={`https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${minted.tokenId}`}>Look your NFT on RinkBy</a>
            </div>
          </div>}
          <ErrorMessage message={error && error.error && error.error.message} />
          <PreviousNfts totalNfts={totalNfts} />
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;