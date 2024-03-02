import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Register from "./pages/Register";
import Chat from "./Chat";
import Logo from "./assets/coders-campus-logo.svg";
export const Routes = () => {
  const { username, token } = useContext(UserContext);
  console.log("Username from userContext: " + username);
  if (username || token) {
    return (
      <>
        <div className="m-2 w-36">
          <img src={Logo} width={125} height={125} alt="" />
        </div>
        <Chat />;
      </>
    );
  }
  return <Register />;
};
