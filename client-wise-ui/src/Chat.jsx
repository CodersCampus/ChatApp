import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import User from "./User";
import { UserContext } from "./context/UserContext";
import { IoIosSend } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";

export default function Chat() {
  const { setUsername, username, id } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
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
    setTimeout(() => {
      console.log("Connection is lost. Reconnecting..");
      initWebSocket();
    }, 1000);
  }

  function initWebSocket() {
    if (!webSocket) {
      console.log("Creating a new WebSocket connection...");
      const ws = new WebSocket("ws://localhost:8080/websocket");
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
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoadingMessages(false);
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
    axios.post("http://localhost:3001/logout").then((res) => {
      setUsername("");
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
          {loadingMessages ? (
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 flex justify-center items-center">
              <div className="spinner-border text-blue-500" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            !!selectedUser &&
            uniqueMessages.map((incomingMessage, id) => (
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
            ))
          )}
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
