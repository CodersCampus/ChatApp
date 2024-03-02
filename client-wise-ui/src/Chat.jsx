import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import User from "./User";
import { UserContext } from "./context/UserContext";

export default function Chat() {
  const { setUsername, username, id } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  const uniqueMessages = useMemo(() => {
    return [...new Set(messages.map(JSON.stringify))].map(JSON.parse);
  }, [messages]);

  const [users, setUsers] = useState([
    { username: "Ben", isOnline: true },
    { username: "Jon", isOnline: true },
    { username: "Pete", isOnline: false },
    { username: "Kate", isOnline: false },
  ]);

  useEffect(() => {
    if (selectedUser && selectedUser.trim() !== "") {
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
      axios
        .get("http://localhost:8080/messages/" + selectedUser)
        .then((res) => {
          const messagesFromDb = res.data;
          console.log(messagesFromDb);
          if (messagesFromDb) {
            setMessages(messagesFromDb);
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log("No selected user");
    }
  }, [selectedUser]);

  useEffect(() => {
    axios.get("/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const handleSelectedUser = (id) => {
    setIsSelected(true);
    setMessages([]);
    setSelectedUser(id);
  };

  const handleMessage = (e) => {
    if (e) {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, JSON.parse(e.data)]);
      console.log(data);
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
    handleMessage();
  };

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-20 justify-between space-y-6">
        <div className="overflow-scroll h-96 mb-3 w-[175%]  ">
          {users &&
            users.map((user, id) => {
              return (
                user && (
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
                )
              );
            })}
        </div>
        <span>{username}</span>
        <button
          className="w-[50%] bottom-0 border p-2 m-1 bg-blue-200"
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </div>

      <div className="space-y-4">
        <div className="overflow-scroll h-96 w-[300px] mb-3">
          {!!selectedUser &&
            [...uniqueMessages]?.map((incomingMessage, id) => (
              <div key={id}>
                {incomingMessage.message !== "" && (
                  <div className="border p-4 m-3">
                    <p>
                      {incomingMessage?.sender == selectedUser
                        ? "Other Party"
                        : username}
                    </p>

                    <p>{incomingMessage?.message}</p>
                    {/* <p>{new Date(message.createdAt)}</p> */}
                  </div>
                )}
              </div>
            ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              type="text"
              value={message}
              placeholder="Enter your message here..."
              className="w-full py-2 px-4 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
              onChange={(e) => setMessage(e.target.value)}
              disabled={!selectedUser}
            />
            <button
              className="border py-4 px-2 rounded-lg"
              type="submit"
              disabled={!selectedUser}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
