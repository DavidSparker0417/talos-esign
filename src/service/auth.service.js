import axios from "axios";
import { API_BASE_URL } from "../config/config";
import authHeader from "./helpers";
// const SERVER = "http://localhost:5000/";
const API_URL = API_BASE_URL + "auth/";

const setUserInfo = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
};

const register = (type, data) => {
  const url = API_URL + `signup?type=${type}`;
  return axios.post(url, { data }).then((response) => {
    if (response.data.accessToken) {
      setUserInfo(response.data);
    }
    return response.data;
  });
}

const signin = (type, data) => {
  const url = API_URL + `signin?type=${type}`;
  return axios.post(url, { data }).then((response) => {
    if (response.data.accessToken) {
      setUserInfo(response.data);
    }
    return response.data;
  });
}

const checkUserValid = () => {
  return axios
    .get(API_URL + "check", { headers: authHeader() })
    .then((response) => {
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  signin,
  checkUserValid,
  logout,
}

export default authService;