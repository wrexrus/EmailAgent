import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/")
      .then(res => setMessage(res.data))
      .catch(err => setMessage("Backend not connected"));
  }, []);

  return <h1>{message}</h1>;
}

export default App;
