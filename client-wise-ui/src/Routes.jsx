import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Register from "./pages/Register";
import Chat from "./Chat";

export const Routes = () => {
  const { username } = useContext(UserContext);
  if (username) {
    return <Chat />;
  }
  return <Register />;
};
