import React from 'react';
import { CONTRACT_ADDRESS } from "./data/constants.jsx"

const PreviousNfts = ({ totalNfts }) => {
  if (!totalNfts) {
    return null;
  }

  const links = [];
  for (let nft = 0; nft < totalNfts; nft++) {
    links.push(<div key={nft} className="italic text-pink-600 m-2">
      <a href={`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${nft}`} target="_blank" rel="noreferrer">{`Look your #${nft} NFT on OpenSea`}</a>
    </div>)
  }

  return (<article>
    <h2 className="text-white-600">Previous NFTs</h2>
    {links}
  </article>
  );
}

export default PreviousNfts;