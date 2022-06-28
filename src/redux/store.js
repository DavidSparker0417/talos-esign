import {configureStore} from "@reduxjs/toolkit";
import nftReducer from "./nft";
import authReducer from "./auth";
import messageReducer from "./messages";

const reducer = {
  auth: authReducer,
  nft: nftReducer,
  messages: messageReducer
}

const store = configureStore({
  reducer: reducer,
});

export default store;