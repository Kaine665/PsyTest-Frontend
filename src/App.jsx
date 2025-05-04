import { Routes, BrowserRouter, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Chats from "./components/Chats";
import Login from "./components/Login";
import NewChat from "./components/NewChat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chats />} />
        <Route path="login" element={<Login />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chats" element={<Chats />} />
        <Route path="newchat" element={<NewChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
