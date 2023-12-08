import axios from "axios";
import { Routes } from "./Routes";

function App() {
  axios.defaults.baseURL = "http://localhost:3001";
  axios.defaults.withCredentials = true;
  return (
    <div className="flex justify-center mt-8">
      <Routes />
    </div>
  );
}

export default App;
