import React from "react";
import { useAppDispatch, useAppSelector } from "./redux/store";
import {
  loadWalletConnect,
  mintNftAsync,
} from "./redux/slices/web3ConnectSlice";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);

  const handleWeb3Connect = () => {
    dispatch(loadWalletConnect());
  };

  const mintNFT = () => {
    dispatch(mintNftAsync());
  };
  return (
    <div className="App">
      {state.web3Connect.web3 ? (
        <div>
          <h6> {state.web3Connect.accounts}</h6>
          <button onClick={mintNFT}>Mint NFT</button>
        </div>
      ) : (
        <button onClick={handleWeb3Connect}>Connect Wallet</button>
      )}
    </div>
  );
}

export default App;