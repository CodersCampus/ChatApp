import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Register from "./pages/Register";

export const Routes = () => {
  const { username } = useContext(UserContext);
  if (username) {
    return <div>Logged in as {username}</div>;
  }
  return <Register />;
};
