import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import User from "./User";
import { UserContext } from "./context/UserContext";
import { IoIosSend } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineOnlinePrediction } from "react-icons/md";
import { IoCloudOfflineSharp } from "react-icons/io5";
import { FcExpired } from "react-icons/fc";
export default function Chat() {
  const { setUsername, username, id } = useContext(UserContext);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false); // State for loading messages
  const uniqueMessages = useMemo(() => {
    return [...new Set(messages.map(JSON.stringify))].map(JSON.parse);
  }, [messages]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (selectedUser && selectedUser.trim() !== "") {
      // setLoadingMessages(true); // Set loading to true when fetching messages
      initWebSocket();
    }
    return () => {
      if (webSocket) {
        webSocket.removeEventListener("message", handleMessage);
        webSocket.removeEventListener("close", handleWebSocketClose);
        webSocket.close();
      }
    };
  }, [selectedUser]);

  function handleWebSocketClose() {
    console.log("Connection lost");
    setIsConnected(false);
    setTimeout(() => {
      console.log("Connection is lost. Reconnecting..");
      initWebSocket();
    }, 1000);
  }

  function initWebSocket() {
    if (!webSocket) {
      console.log("Creating a new WebSocket connection...");
      const ws = new WebSocket("ws://localhost:8080/websocket");
      setIsConnected(true);
      setWebSocket(ws);
      ws.addEventListener("message", handleMessage);
      ws.addEventListener("close", handleWebSocketClose);
    }
  }

  useEffect(() => {
    console.log("SelectedUser");
    if (selectedUser) {
      setLoadingMessages(true); // Set loading to true when messages are being fetched
      // Simulate loading time with setTimeout

      axios
        .get("http://localhost:8080/messages/" + selectedUser)
        .then((res) => {
          const messagesFromDb = res.data;
          console.log(messagesFromDb);
          if (messagesFromDb) {
            setMessages(messagesFromDb);
            setLoadingMessages(false);
          }
        })
        .catch((err) => {
          setIsSessionExpired(true);
          console.log(err);
        });
    } else {
      console.log("No selected user");
    }
  }, [selectedUser]);

  useEffect(() => {
    axios.get("/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleSelectedUser = (userId) => {
    setIsSelected(true);
    setMessages([]);
    setSelectedUser(userId);
  };

  const handleMessage = (e) => {
    if (e.data) {
      JSON.parse(e.data);
      setMessages((prev) => [...prev, JSON.parse(e.data)]);
    }
    const uniqueId = crypto.randomUUID();
    const createdAt = new Date();
    const currentMessage = {
      message: message,
      uniqueId,
      sender: id,
      recipient: selectedUser,
      createdAt,
    };
    if (message !== "" && currentMessage.message !== "") {
      webSocket.send(JSON.stringify(currentMessage));
      // setMessage(currentMessage);
      // setMessages((prev) => [...prev, currentMessage]);
    }
    setMessage("");
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/auth/logout")
      .then((res) => {
        setUsername("");
      })
      .finally(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("username");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleMessage(e);
  };
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex flex-col items-center flex-shrink-0 bg-slate-50 md:w-1/4 md:h-screen overflow-y-auto rounded-md shadow-lg">
        <div className="overflow-auto flex-grow w-full">
          {users &&
            users.map((user, id) => (
              <User
                user={user}
                users={users}
                id={id}
                key={id}
                isOnline={true}
                handleSelectedUser={handleSelectedUser}
                handleLogOut={handleLogOut}
                selectedUser={selectedUser}
                setIsSelected={setIsSelected}
                isSelected={isSelected}
              />
            ))}
        </div>
        <div className="flex flex-col justify-evenly gap-4 font-serif items-center font-semibold italic">
          {isSessionExpired && (
            <div className="flex items-center justify-around gap-4">
              <span>Session Expired</span>
              <span>{isSessionExpired && <FcExpired size={25} />}</span>
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
            <span>Connection</span>
            <span>
              {isConnected ? (
                <MdOutlineOnlinePrediction size={30} color="green" />
              ) : (
                <IoCloudOfflineSharp size={30} color="red" />
              )}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center p-4">
          <span className="text-xl">{username}</span>
          <button
            onClick={handleLogOut}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <IoMdLogOut size={25} />
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-3/4 bg-white">
        <div
          className={`overflow-scroll flex-grow p-4 relative ${
            loadingMessages ? "opacity-50" : ""
          }`}
        >
          {!!selectedUser &&
            uniqueMessages?.map((incomingMessage, id) => (
              <div key={id}>
                {incomingMessage.message && (
                  <div
                    className={`p-4 m-3 rounded-lg shadow-md ${
                      incomingMessage.sender === selectedUser
                        ? "bg-blue-100 text-blue-900 self-end"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm font-semibold">
                      {incomingMessage.sender === selectedUser
                        ? "Other Party"
                        : username}
                    </p>
                    <p className="text-base">{incomingMessage.message}</p>
                    {/* <p>{new Date(message.createdAt)}</p> */}
                  </div>
                )}
              </div>
            ))}
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              placeholder="Enter your message here..."
              className="flex-grow py-2 px-4 border rounded-full focus:outline-none focus:ring focus:border-indigo-300"
              onChange={(e) => setMessage(e.target.value)}
              disabled={!selectedUser}
            />
            <button
              className="rounded-full bg-blue-500 text-white p-2"
              type="submit"
              disabled={!selectedUser}
            >
              <IoIosSend size={25} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
