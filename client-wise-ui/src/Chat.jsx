import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import User from "./User";

export default function Chat() {
  const { setUsername, username, id } = useContext(UserContext);
  const [message, setMessage] = useState("Hello world!");
  const [messages, setMessages] = useState([
    {
      receiver: "Hello",
      sender: "World",
      content: "This is messagedfds",
      date: "2021-09-01",
    },
    {
      receiver: "Hello1",
      sender: "World2",
      content: "This is messagedf Ben",
      date: "2021-09-01",
    },
    {
      receiver: "Hello3",
      sender: "World4",
      content: "This is messagedf Jon",
      date: "2021-09-01",
    },
    {
      receiver: "Hello33",
      sender: "World44",
      content: "This is messages Pete",
      date: "2021-09-01",
    },
    {
      receiver: "Hello32",
      sender: "World4a",
      content: "This is messagef Kate",
      date: "2021-09-01",
    },
  ]);
  const [webSocket, setWebSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([
    { username: "Ben", isOnline: true },
    { username: "Jon", isOnline: true },
    { username: "Pete", isOnline: false },
    { username: "Kate", isOnline: false },
  ]);

  const handleSelectedUser = (id) => {
    setSelectedUser(id);
  };
  console.log("Selected user is: ", selectedUser);

  const handleMessage = () => {
    const currentMessage = JSON.stringify({
      chatMessage: message,
      uniqueId: crypto.randomUUID(),
      senderId: id,
      receiverId: selectedUser,
      date: new Date(),
    });
    console.log("The handleMessage message is: ", currentMessage);
    webSocket.send(currentMessage);
    console.log("The message is: ", message);
  };
  useEffect(() => {
    console.log("Created number is!!!: ", crypto.randomUUID());
    const ws = new WebSocket("ws://localhost:3001");
    setWebSocket(ws);

    ws.addEventListener("message", handleMessage);
  }, [username, message]);

  useEffect(() => {
    axios.get("http://localhost:3001/users").then((res) => {
      setUsers(res.data);
      console.log(res.data);
    });
  }, []);

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
                    id={id}
                    key={id}
                    isOnline={true}
                    handleSelectedUser={handleSelectedUser}
                    handleLogOut={handleLogOut}
                  />
                )
              );
            })}
        </div>
        <button
          className="w-[50%] bottom-0 border p-2 m-1 bg-blue-200"
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </div>

      <div className="space-y-4">
        <div className="overflow-scroll h-96 w-[300px] mb-3">
          {messages.map((message, id) => (
            <div key={id} className="border p-4 m-3">
              <p>{message.sender}</p>
              <p>{message.receiver}</p>
              <p>{message.content}</p>
              <p>{message.date}</p>
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
            />
            <button className="border py-4 px-2 rounded-lg" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
