import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import ChatElement from "./ChatElement";

// ... existing code ...
const NewChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    characterCombinations = [],
    patients = {},
    prompts = {},
  } = location.state || {};

  const handleNewChat = async (patient_id, prompt_id) => {
    const chatHistoryId =
      Date.now().toString() + Math.floor(Math.random() * 10000);
    const userId = localStorage.getItem("account") || ""; // 获取当前登录账号
    const initialContent = [];
    const payload = {
      chat_history_id: chatHistoryId,
      user_id: userId,
      patient_id: patient_id,
      prompt_id: prompt_id,
      update_time: "",
      content: initialContent,
    };

    // 根据这个去创建一个新的chat_history，在后端写逻辑
    await fetch("http://localhost:8001/api/chat_history/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate("/chat", {
      state: {
        chatHistoryId: chatHistoryId,
      },
    });
  };

  return (
    <>
      <div id="header">
        <button id="returnButton" onClick={() => navigate("/chats")}>
          返回
        </button>
        <Header title={"新建聊天"} />
      </div>
      <div id="chatElements">
        {characterCombinations.map((combo) => (
          <ChatElement
            key={combo.patient_id + "_" + combo.prompt_id}
            chat={{
              patient_name:
                patients[combo.patient_id]?.patient_name || combo.patient_id,
              patient_introduce:
                patients[combo.patient_id]?.patient_introduce || "",
              prompt_type:
                prompts[combo.prompt_id]?.prompt_type || combo.prompt_id,
            }}
            onClick={() => handleNewChat(combo.patient_id, combo.prompt_id)}
          />
        ))}
      </div>
    </>
  );
};

export default NewChat;
