import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/UserContext";
import User from "./User";

export default function Chat() {
  const { setUsername, username, id } = useContext(UserContext);
  const [message, setMessage] = useState("Hello world!");
  const [isSelected, setIsSelected] = useState(false);
  const [messages, setMessages] = useState([
    {
      uniqueId: crypto.randomUUID(),
      receiver: "Hello",
      sender: "World",
      chatMessage: "This is messagedfds",
      creationTime: new Date(),
      isOnline: false,
      isSelected: false,
    },
    {
      uniqueId: crypto.randomUUID(),
      receiverId: "Hello1",
      senderId: "World2",
      chatMessage: "This is messagedf Ben",
      creationTime: new Date(),
      isOnline: true,
      isSelected: false,
    },
    {
      uniqueId: crypto.randomUUID(),
      receiverId: "iamTrue",
      senderId: "World4",
      chatMessage: "This is messagedf Jon",
      creationTime: new Date(),
      isOnline: true,
      isSelected: false,
    },
    {
      uniqueId: crypto.randomUUID(),
      receiverId: "Hello33",
      senderId: "World44",
      chatMessage: "This is messages Pete",
      creationTime: new Date(),
      isOnline: false,
      isSelected: false,
    },
    {
      uniqueId: crypto.randomUUID(),
      receiverId: "iamTrue2",
      senderId: "World4a",
      chatMessage: "This is messagef Kate",
      creationTime: new Date(),
      isOnline: false,
      isSelected: false,
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
    // setUsers(prev=>[...prev, prev.filter(user=>))])
    setSelectedUser(id);
  };
  console.log("Selected user is: ", selectedUser);

  const handleMessage = () => {
    const uniqueId = crypto.randomUUID();
    const creationTime = new Date();
    const currentMessage = JSON.stringify({
      chatMessage: message,
      uniqueId,
      senderId: id,
      receiverId: selectedUser,
      creationTime,
    });
    const newMessage = {
      chatMessage: message,
      uniqueId,
      senderId: id,
      receiverId: selectedUser,
      creationTime,
    };
    console.log("The handleMessage message is: ", currentMessage);
    webSocket.send(currentMessage);
    setMessage("");

    setMessages((prev) => [...prev, newMessage]);
  };
  useEffect(() => {
    console.log("Created number is!!!: ", crypto.randomUUID());
    const ws = new WebSocket("ws://localhost:3001");
    setWebSocket(ws);

    ws.addEventListener("message", handleMessage);
  }, [username, message]);

  useEffect(() => {
    axios.get("http://localhost:3001/users").then((res) => {
      setUsers((prev) => [...prev, res.data]);
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
  console.log("new messages: ", messages);
  console.log("select", selectedUser);
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
              <p>{message.senderId}</p>
              <p>{message.receiverId}</p>
              <p>{message.chatMessage}</p>
              <p>{message.uniqueId}</p>
              <p>{message.creationTime.toString()}</p>
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
