import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../service/auth.service";
export const GlobalContext = createContext();
export function GlobalProvider({ children }) {  
  const [config, setConfig] = useState();

  function loadConfig() {
    fetch("/config.json")
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        localStorage.setItem("config", JSON.stringify(data));
        setConfig(data);
      })
      .catch(function (err) {
        console.log("[DAVID] Loading config failed! err = ", err);
      });
  }

  useEffect(() => {
    loadConfig();  
    const ac = new AbortController();
    const callCheckLoginState = async() => {
      checkLoginState().then(() => {
        if (ac.signal.aborted === false) {
          setTimeout(() => callCheckLoginState(), 1000*60*5) // check every 5 minutes
        }
      })
    }

    callCheckLoginState();
    return () => ac.abort();
  }, []);

  // check login status
  async function checkLoginState() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user)
      return;

    // check if current user is expired
    AuthService.checkUserValid()
      .then((response) => {
      })
      .catch(e => {
        if (e.response) {
          const eStatus = e.response.status;
          if (eStatus === 401) {
            console.log("[DAVID] checkLoginState :: checkFailed = ", e.response);
            const errorOnServer = e.response.data.error;
            if (errorOnServer && errorOnServer.name === "TokenExpiredError") {
              console.log("[DAVID] User expired! logging out... ");
            }
            AuthService.logout();
            window.location.reload();
          }
        }
      });
  }

  return (
    <GlobalContext.Provider value={{config}}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const data = useContext(GlobalContext);
  return data;
}
