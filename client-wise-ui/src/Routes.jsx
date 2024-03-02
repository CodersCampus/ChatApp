import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Register from "./pages/Register";
import Chat from "./Chat";

export const Routes = () => {
  const { username, token } = useContext(UserContext);
  console.log("Username from userContext: " + username);
  if (username || token) {
    return <Chat />;
  }
  return <Register />;
};
