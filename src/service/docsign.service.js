import axios from "axios";
import { API_BASE_URL } from "../config/config";
import { getBackendErrMsg } from "../helpers/err-msg";
import authHeader from "./helpers";

const API_URL = API_BASE_URL + "doc-sign/";

const signDoc = async (pdfBuffer, signData) => {
  const url = API_URL + `create`;
  console.log("[DOC SIGN] sending request to ", url, signData);
  try {
    const res = await axios.post(
      url, 
      {pdfBuffer, signData},
      { headers: authHeader() }
    );
    console.log("[DOC SIGN] response = ", res);
    return res;
  } catch(e) {
    const errMsg = getBackendErrMsg(e);
    console.log("[DOC SIGN] err = ", errMsg);
    throw new Error(errMsg);
  }
}

const deliverDoc = async (payload) => {
  const url = API_URL + `deliver`;
  try {
    const res = await axios.post(
      url, 
      {payload},
      { headers: authHeader() }
    );
    return res;
  } catch(e) {
    const errMsg = getBackendErrMsg(e);
    throw new Error(errMsg);
  }
}

const requestDoc = async (token) => {
  const url = API_URL + `payloads`;
  try {
    const res = await axios.post(
      url, 
      {token}
    );
    return res.data;
  } catch(e) {
    const errMsg = getBackendErrMsg(e);
    throw new Error(errMsg);
  }
}

const auth = async (token, contact) => {
  const url = API_URL + `auth`;
  try {
    const res = await axios.post(
      url, 
      {token, contact}
    );
    return res.data;
  } catch(e) {
    const errMsg = getBackendErrMsg(e);
    throw new Error(errMsg);
  }
}

const verify = async (token, code) => {
  const url = API_URL + `verify`;
  try {
    const res = await axios.post(
      url, 
      {token, code}
    );
    return res.data;
  } catch(e) {
    const errMsg = getBackendErrMsg(e);
    throw new Error(errMsg);
  }
}

const sign = async(token, drInfo) => {
  const url = API_URL + 'sign';
  try {
    const res = await axios.post(
      url, 
      {token, drInfo}
    );
    return res.data;
  } catch(e) {
    const errMsg = getBackendErrMsg(e);
    throw new Error(errMsg);
  }
}

const adoptSign = async(token) => {
  const url = API_URL + "adopt";
  try {
    const res = await axios.post(
      url, 
      {token}
    );
    return res.data;
  } catch(e) {
    const errMsg = getBackendErrMsg(e);
    throw new Error(errMsg);
  }
}

const docsignService = {
  signDoc,
  deliverDoc,
  requestDoc,
  adoptSign,
  sign,
  auth,
  verify,
};

export default docsignService;