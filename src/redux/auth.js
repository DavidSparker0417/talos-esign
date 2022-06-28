import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { getBackendErrMsg } from "../helpers/err-msg";
import AuthService from "../service/auth.service";

const user = JSON.parse(localStorage.getItem("user"));
const initialState = {
  pending: false,
  loggedin: user ? true : false,
  err: null,
  user: user 
};


export const register = createAsyncThunk(
  "auth/register",
  async ({ type, data }, thunkAPI) => {
    try {
      const resp = await AuthService.register(type, data);
      return { user: resp };
    } catch (error) {
      const message = getBackendErrMsg(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async ({ type, data }, thunkAPI) => {
    try {
      const resp = await AuthService.signin(type, data);
      return { user: resp };
    } catch (error) {
      let message;
      message = 
        error?.response?.data?.message 
        || error.message 
        || error.toString();
      console.log("[DAVID] Signing :: ERR = ", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "ESIGN-AUTH",
  initialState,
  reducers: {
    login (state, action) {
      localStorage.setItem("user", JSON.stringify({name: "david"}));
      state.loggedin = true;
    },
    logout (state, action) {
      localStorage.removeItem("user");
      state.loggedin = false;
    },
    refresh (state, action) {
      state.err = null;
    }
  },
  extraReducers: {

    // Sign up
    [register.pending]: (state, action) => {
      state.pending = true;
      state.loggedin = false;
      state.err = null;
    },
    [register.rejected]: (state, action) => {
      state.pending = false;
      console.log("[DAVID](Register) rejected : payload = ", action.payload);
      state.err = action.payload;
    },
    [register.fulfilled]: (state, action) => {
      state.pending = false;
      state.loggedin = true;
      console.log("[DAVID](Register) successful : user = ", action.payload.user);
      state.user = action.payload.user;
    },

    // Log in
    [signin.pending]: (state, action) => {
      state.pending = true;
      state.err = null;
    },
    [signin.rejected]: (state, action) => {
      state.pending = false;
      console.log("[DAVID](Login) rejected : payload = ", action.payload);
      state.err = action.payload;
    },
    [signin.fulfilled]: (state, action) => {
      state.pending = false;
      state.loggedin = true;
      state.user = action.payload.user;
    },
  }
});

export const {refresh, login, logout } = authSlice.actions;
export const isLoggedIn = (state) => state.auth.loggedin;
export default authSlice.reducer;