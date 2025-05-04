import { Routes, HashRouter, Route } from "react-router-dom";
import Chat from "./components/Chat";
import Chats from "./components/Chats";
import Login from "./components/Login";
import NewChat from "./components/NewChat";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Chats />} />
        <Route path="login" element={<Login />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chats" element={<Chats />} />
        <Route path="newchat" element={<NewChat />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
