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

const deliverDoc = async (payload, coordinates) => {
  const url = API_URL + `deliver`;
  try {
    const res = await axios.post(
      url, 
      {payload, coordinates},
      { headers: authHeader() }
    );
    return res;
  } catch(e) {
    const errMsg = getBackendErrMsg(e);
    throw new Error(errMsg);
  }
}

const requestDoc = async () => {
  const url = API_URL + `payloads`;
  try {
    const res = await axios.post(
      url, 
    );
    return res.data;
  } catch(e) {
    const errMsg = getBackendErrMsg(e);
    throw new Error(errMsg);
  }
}

const sign = async(who, behavior, drInfo) => {
  const url = API_URL + 'sign';
  try {
    const res = await axios.post(
      url, 
      {who, behavior, drInfo}
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
  sign
};

export default docsignService;