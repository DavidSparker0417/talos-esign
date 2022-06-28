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

const docsignService = {
  signDoc,
};

export default docsignService;