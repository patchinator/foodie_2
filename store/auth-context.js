import { useState } from "react";
import React from "react";

const AuthContext = React.createContext({
  token: "",
  email: "",
  displayName: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  let initialToken, initialEmail, initialDisplayName;

  if (typeof window !== "undefined") {
    initialToken = localStorage.getItem("token");
    initialEmail = localStorage.getItem("email");
    initialDisplayName = localStorage.getItem("displayName");
  }

  const [token, setToken] = useState(initialToken);
  const [email, setEmail] = useState(initialEmail);
  const [displayName, setDisplayName] = useState(initialDisplayName);

  const userIsLoggedIn = !!token;

  const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjustedExpTime = new Date(expirationTime).getTime();
    const remainingDuration = adjustedExpTime - currentTime;
    return remainingDuration;
  };

  const loginHandler = (token, email, displayName, expirationTime) => {
    setToken(token);
    setEmail(email);
    setDisplayName(displayName);

    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("displayName", displayName);

    const remainingTime = calculateRemainingTime(expirationTime);
    setTimeout(logoutHandler, remainingTime);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const contextValue = {
    token: token,
    email: email,
    displayName: displayName,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
