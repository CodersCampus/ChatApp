import axios from "axios";
import { useContext, useEffect, useState } from "react";
import User from "./User";
import { UserContext } from "./context/UserContext";

export default function Chat() {
  const { setUsername, username, id } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    { username: "Ben", isOnline: true },
    { username: "Jon", isOnline: true },
    { username: "Pete", isOnline: false },
    { username: "Kate", isOnline: false },
  ]);

  useEffect(() => {
    initWebSocket();
  }, [selectedUser]);

  function initWebSocket() {
    const ws = new WebSocket("ws://localhost:3001");
    setWebSocket(ws);

    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      console.log("Connection lost");
      setTimeout(() => {
        console.log("Connection is lost. Reconnecting..");
        initWebSocket();
      }, 1000);
    });
  }
  useEffect(() => {
    if (selectedUser) {
      axios
        .get("http://localhost:3001/messages/" + selectedUser)
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
    // setUsers(prev=>[...prev, prev.filter(user=>))])
    setSelectedUser(id);
  };
  console.log("Selected user is: ", selectedUser);

  const handleMessage = (e) => {
    console.log("Incoming messages: ", e);

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
      setMessage(currentMessage);
      setMessages((prev) => [...prev, currentMessage]);
    } else {
      setMessages((prev) => [...prev, JSON.parse(e.data)]);
    }
    setMessage("");
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/logout").then((res) => {
      setUsername("");
      console.log(res);
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleMessage();
  };

  return (
    <div className="flex justify-evenly">
      <div className="flex flex-col items-center space-y-4">
        <div className="overflow-scroll h-96 mb-3 ">
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
          {messages?.map((incomingMessage, id) => (
            <>
              {incomingMessage.message !== "" && (
                <div key={id} className="border p-4 m-3">
                  <p>{incomingMessage?.sender}</p>
                  <p>{incomingMessage?.recipient}</p>
                  <p>{incomingMessage?.message}</p>
                  {/* <p>{new Date(message.createdAt)}</p> */}
                </div>
              )}
            </>
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
