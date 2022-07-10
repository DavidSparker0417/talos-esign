import {configureStore} from "@reduxjs/toolkit";
import nftReducer from "./nft";
import authReducer from "./auth";
import messageReducer from "./messages";
import tabsReducer from "./tabs";

const reducer = {
  auth: authReducer,
  nft: nftReducer,
  messages: messageReducer,
  tabs: tabsReducer,
}

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});

export default store;