/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const UserContext = createContext({});
export const UserContextProvider = ({ children }) => {
  // eslint-disable-next-line no-unused-vars
  const [username, setUsername] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(null);

  const [token, setToken] = useState("");
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("token");
    console.log("tokenFromLocalStorage : " + tokenFromLocalStorage);
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    }
    axios
      .get("http://localhost:3001/account")
      .then(({ data }) => {
        setUsername(data.username);
        setId(data.userId);
      }, [])
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        id,
        setId,
        token,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
