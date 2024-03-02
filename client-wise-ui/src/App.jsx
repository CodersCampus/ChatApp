import axios from "axios";
import { Routes } from "./Routes";

function App() {
  axios.defaults.baseURL = "http://localhost:8080";
  axios.defaults.withCredentials = true;
  return (
    <div>
      <Routes />
    </div>
  );
}

export default App;
