import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const submitUserLogin = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("http://localhost:3001/register", {
      username,
      password,
    });
    console.log(data);
    setUsername("");
    setPassword("");
  };
  return (
    <div>
      <form onSubmit={submitUserLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-gray-400"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-400"
          />
        </div>
        <button className="border-2 px-4 py-2 rounded m-2">Register</button>
      </form>
    </div>
  );
};

export default Register;
