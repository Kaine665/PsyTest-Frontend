import { useNavigate } from "react-router-dom";
import "../assets/css/main.css";
import "../assets/css/chats.css";
import Header from "./Header";
import ChatElement from "./ChatElement";
import { useEffect, useState } from "react";
import CookieConsent from "./CookieConsent";

const CHARACTER_COMBINATIONS = [
  { patient_id: "1", prompt_id: "3" },
  { patient_id: "2", prompt_id: "3" },
  { patient_id: "3", prompt_id: "3" },
];

const Chats = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [patients, setPatients] = useState({});
  const [prompts, setPrompts] = useState({});

  useEffect(() => {
    const fetchChats = async () => {
      const account = localStorage.getItem("account");
      if (!account) {
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(
          `https://psytest-backend.onrender.com/api/chat_history/user/${account}`
        );
        const data = await response.json();
        if (data.success) {
          const chatsWithDetails = await getChatsWithDetails(data.data);
          setChats(chatsWithDetails);
        } else {
          setChats([]);
        }
      } catch (error) {
        console.error(error);
        setChats([]);
      }
    };

    // 获取所有来访信息
    const fetchPatients = async () => {
      try {
        // 尝试不同的 API 路径
        const response = await fetch(
          "https://psytest-backend.onrender.com/api/patient/all"
        );
        const data = await response.json();
        const dict = {};
        if (data.data) {
          data.data.forEach((item) => (dict[item.patient_id] = item));
        }
        setPatients(dict);
      } catch (error) {
        console.error("获取病人信息出错:", error);
      }
    };

    // 获取所有练习类型信息
    const fetchPrompts = async () => {
      const response = await fetch(
        "https://psytest-backend.onrender.com/api/prompt/all"
      );
      const data = await response.json();
      const dict = {};
      if (data.data) {
        data.data.forEach((item) => (dict[item.prompt_id] = item));
      }
      setPrompts(dict);
    };

    // 从data中取出要在chatElement里面展示的缩略信息
    const getChatsWithDetails = async (chats) => {
      return await Promise.all(
        chats.map(async (chat) => {
          const patientRes = await fetch(
            `https://psytest-backend.onrender.com/api/patient/${chat.patient_id}`
          );
          const patientData = await patientRes.json();
          const promptRes = await fetch(
            `https://psytest-backend.onrender.com/api/prompt/${chat.prompt_id}`
          );
          const promptData = await promptRes.json();
          return {
            ...chat,
            patient_name: patientData.data?.patient_name || "",
            patient_introduce: patientData.data?.patient_introduce || "",
            prompt_type: promptData.data?.prompt_type || "",
          };
        })
      );
    };

    fetchChats();
    fetchPatients();
    fetchPrompts();
  }, [navigate]);

  // 点击chatElements时的处理函数
  const handleChatClick = (chat) => {
    navigate("/chat", {
      state: {
        chatHistoryId: chat.chat_history_id,
        patientId: chat.patient_id,
        promptId: chat.prompt_id,
      },
    });
  };

  const handleGoToNewChatPage = () => {
    navigate("/newchat", {
      state: {
        characterCombinations: CHARACTER_COMBINATIONS,
        patients,
        prompts,
      },
    });
  };

  const handleDelete = async (chat_history_id) => {
    try {
      console.log(
        `[Frontend] Attempting to delete chat history: ${chat_history_id}`
      ); // 添加日志
      const response = await fetch(
        "https://psytest-backend.onrender.com/api/chat_history/delete",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_history_id }),
        }
      );
      const data = await response.json();
      console.log("[Frontend] Delete response from backend:", data); // 添加日志
      if (data.success) {
        // 如果删除成功，更新 chats 状态
        setChats((prevChats) =>
          prevChats.filter((chat) => chat.chat_history_id !== chat_history_id)
        );
      } else {
        // 可以选择在这里处理删除失败的情况，例如显示错误消息
        console.error("[Frontend] Failed to delete chat history:", data.msg);
      }
    } catch (err) {
      console.error("[Frontend] Error deleting chat history:", err); // 添加错误日志
      console.error(err);
    }
  };

  return (
    <>
      <div id="header">
        <Header title={"练习"} />
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("account");
            navigate("/login");
          }}
          style={{
            position: "absolute",
            right: "1rem",
            fontSize: "1rem",
            padding: "5px",
          }}
        >
          退出登录
        </button>
        <CookieConsent />
      </div>

      <div id="chatElements">
        {/* 新建聊天按钮 */}
        <button className="chatElement newChat" onClick={handleGoToNewChatPage}>
          新建聊天
        </button>

        <h2>历史聊天</h2>
        {chats.map((chat, index) => (
          <ChatElement
            chat={chat}
            key={chat.chat_history_id || index} // 优先使用 chat_history_id 作为 key
            onClick={() => handleChatClick(chat)}
            onDelete={handleDelete} // 修改：直接传递handleDelete函数，不再封装
            isChatHistory={true} // 添加：标记为聊天记录
          />
        ))}
      </div>
    </>
  );
};
export default Chats;
