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
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={submitUserLogin}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create an Account
        </h2>
        <div className="mb-4">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
            placeholder="Username"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-indigo-300"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 focus:outline-none focus:ring focus:border-indigo-300"
        >
          Register
        </button>
        <p className="mt-4 text-gray-600 text-center">
          Already a member?{" "}
          <button
            type="button"
            className="text-indigo-500 underline hover:text-indigo-600 focus:outline-none"
            onClick={() => alert("Redirect to login page")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
