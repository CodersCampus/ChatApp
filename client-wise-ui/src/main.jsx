import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeContextProvider } from "./context/ThemeContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <ThemeContextProvider>
         <UserContextProvider>
        <App />
         </UserContextProvider>
      </ThemeContextProvider> 
  </React.StrictMode>
);
