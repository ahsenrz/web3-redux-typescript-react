import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import WalletConnectProvider from "@walletconnect/web3-provider";
import EthContract from "web3-eth-contract";
import { WritableDraft } from "immer/dist/internal";

import {
  MARKETPLACE_ABI,
  MARKETPLACE_ADDRESS,
} from "../../contract/marketplace";
import { RootStateType } from "../store";

export type StateType = {
  web3: null | Web3;
  contract: null | EthContract.Contract;
  address: null;
  accounts: string[];
  web3LoadingErrorMessage: string;
  web3Loading: boolean;
  ErrorMessage: string;
  provider: null;
};

type Web3ConnectPayloadType = {
  web3: Web3;
  accounts: string[];
  web3Loading: boolean;
  marketPlaceContract: EthContract.Contract;
};

export const initialState: StateType = {
  web3: null,
  contract: null,
  address: null,
  accounts: [],
  web3LoadingErrorMessage: "",
  web3Loading: false,
  ErrorMessage: "",
  provider: null,
};

// Connect with Wallet of users choice
export const loadWalletConnect = createAsyncThunk(
  "LoadWalletConnect",
  async (_, thunkAPI) => {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          4: "https://rinkeby.infura.io/v3/8e698f819a0f44179feeddd651f2aadc",
        },
        chainId: 4,
      });
      console.log("Provider", provider);
      if (provider) {
        await provider.enable();
        const web3 = new Web3(provider as any);
        console.log("Web3", web3);
        const accounts = await web3.eth.getAccounts();
        console.log("accounts", accounts);
        const marketPlaceContract: EthContract.Contract = new web3.eth.Contract(
          MARKETPLACE_ABI as AbiItem[],
          MARKETPLACE_ADDRESS
        );
        console.log("Contract", marketPlaceContract);
        return {
          web3,
          accounts,
          marketPlaceContract,
        };
      } else {
        return {
          web3LoadingErrorMessage:
            "Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!",
        };
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const mintNftAsync = createAsyncThunk("NftMint", async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootStateType;
  const { contract, accounts, web3 } = state.web3Connect;
  const result = async () => {
    let runLoop = true;
    let requiredData;
    try {
      console.log("Started Minting NFT");
      let result = await contract ?.methods
        .mintNFT()
        .send({
          from: accounts[0],
          value: "10000000000000000",
          // gasPrice: web3?.utils.toHex(web3.utils.toWei("30", "gwei")),
        }, async (err: any, transactionHash: any) => {

        });
      return result;

    } catch (error) {
      console.log("User rejected the transaction");
      return error

    }
  }
  const resulss = await result();
  console.log("RESULT OF RETURN___", resulss)

});



const web3ConnectSlice = createSlice({
  name: "Web3Connect",
  initialState,
  reducers: {},
  extraReducers: {
    [loadWalletConnect.fulfilled.toString()]: (
      state: WritableDraft<StateType>,
      { payload }: PayloadAction<Web3ConnectPayloadType>
    ) => {
      state.web3 = payload ?.web3;
      state.accounts = payload ?.accounts;
      state.web3Loading = false;
      state.contract = payload ?.marketPlaceContract;
    },
  },
});

export const web3Reducer = web3ConnectSlice.reducer;