import "./App.css";
import Register from "./pages/Register";
import axios from "axios";

function App() {
  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.withCredentials = true;
  return (
    <>
      <Register />
    </>
  );
}

export default App;
