import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/UserContext";
export default function Chat() {
  const { setUsername, username } = useContext(UserContext);
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
  const [users, setUsers] = useState([
    { username: "Ben", isOnline: true },
    { username: "Jon", isOnline: true },
    { username: "Pete", isOnline: false },
    { username: "Kate", isOnline: false },
  ]);
  useEffect(() => {
    console.log("The message is: ", message);
  }, [username, message]);
  const handleLogOut = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/logout").then((res) => {
      setUsername("");
      console.log(res);
    });
  };

  return (
    <div>
      <div className="flex">
        <div>
          {users.map((user, id) => {
            return (
              <div
                key={id}
                className=" flex justify-around items-center border p-4 m-5 gap-1"
              >
                <p>{user.username}</p>
                <div
                  className={
                    user.isOnline
                      ? "rounded-2xl bg-green-800 w-4 h-4"
                      : "rounded-2xl bg-gray-800 w-4 h-4"
                  }
                >
                  {user.isOnline}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          {messages.map((message, id) => (
            <div key={id} className="border p-4 m-3">
              <p>{message.sender}</p>
              <p>{message.receiver}</p>
              <p>{message.content}</p>
              <p>{message.date}</p>
            </div>
          ))}
        </div>
      </div>
      <form>
        <input
          type="text"
          value={message}
          placeholder="Enter your message here..."
          className="w-full p-4 border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="border p-4 m-3" type="submit">
          Send
        </button>
      </form>
      <button className="border p-4 m-3 bg-blue-200" onClick={handleLogOut}>
        Log Out
      </button>
    </div>
  );
}
