import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../assets/css/main.css";
import "../assets/css/chat.css";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  // 变量类型1
  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const location = useLocation();
  const { chatHistoryId } = location.state || {};
  // 变量类型2
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  // 接收到传入参数后，将参数传给后端
  useEffect(() => {
    const loadPage = async () => {
      const response = await fetch(
        "https://psytest-backend.onrender.com/api/load_chat_page",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 添加跨域Cookie支持
          body: JSON.stringify({
            chat_history_id: chatHistoryId,
          }),
        }
      );
      const data = await response.json();
      const chatHistory = data.messages;
      setMessages(chatHistory);
    };

    loadPage();
  }, [chatHistoryId]);

  // 有内容更新后，下滑到最下方
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // 这个方法接受用户的最新输入，输出ai的最新回复。
  const fetchAiResponse = async () => {
    const response = await fetch(
      "https://psytest-backend.onrender.com/api/process_message",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 添加跨域Cookie支持
        body: JSON.stringify({
          chat_history_id: chatHistoryId,
          inputValue: inputValue,
        }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  };

  const fetchFeedback = async () => {
    const response = await fetch(
      "https://psytest-backend.onrender.com/api/get_feedback",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 添加跨域Cookie支持
        body: JSON.stringify({
          chat_history_id: chatHistoryId,
          inputValue: inputValue,
        }),
      }
    );
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  };

  const postMessages = async (messagesToSend) => {
    const response = await fetch(
      "https://psytest-backend.onrender.com/api/post_messages",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 添加跨域Cookie支持
        body: JSON.stringify({
          chat_history_id: chatHistoryId,
          messagesToSend: messagesToSend,
        }),
      }
    );
    const data = await response.json();

    return data;
  };

  // 按下enter键，提交输入框内容
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUserSubmit();
    }
  };

  // 按下提交按钮，提交输入框输入
  const handleUserSubmit = async () => {
    if (!inputValue) {
      return;
    }

    // 存储当前输入值
    const currentInput = inputValue;

    // 立即清空输入框
    setInputValue("");

    // 1. 立即显示用户输入
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: currentInput },
    ]);

    try {
      // 2. 并行请求
      const [feedbackResponse, inputResponse] = await Promise.all([
        fetchFeedback(currentInput),
        fetchAiResponse(currentInput),
      ]);

      // 3. 收集新消息
      const newMsgs = [];
      if (
        feedbackResponse.messages &&
        feedbackResponse.messages.trim() !== "继续"
      ) {
        newMsgs.push({ role: "feedback", content: feedbackResponse.messages });
      }
      if (inputResponse.messages) {
        newMsgs.push({ role: "assistant", content: inputResponse.messages });
      }

      // 4. 合并到历史消息
      setMessages((prevMessages) => [...prevMessages, ...newMsgs]);

      // 5. 保存到 newMessages
      const toSend = [{ role: "user", content: currentInput }, ...newMsgs];
      postMessages(toSend);
    } catch (error) {
      alert(error.message || "AI服务暂时不可用，请稍后重试");
      console.log("请求出错: ", error);
    }
  };

  return (
    <>
      <div id="header">
        <button id="returnButton" onClick={() => navigate("/chats")}>
          返回
        </button>
        <Header title={"练习"} />
      </div>

      <div id="chat">
        <div id="chatBox" ref={chatBoxRef}>
          {/* 这个div是消息记录展示框 */}
          {messages.map((entry, index) => (
            <div key={index}>
              {entry.role === "user" && (
                <>
                  <p className="role user">你</p>
                  <div className="say user-say">
                    <ReactMarkdown>{entry.content}</ReactMarkdown>
                  </div>
                </>
              )}

              {entry.role === "feedback" && (
                <>
                  <p className="role supervisor">督导师</p>
                  <div className="say supervisor-say">
                    <ReactMarkdown>{entry.content}</ReactMarkdown>
                  </div>
                </>
              )}

              {entry.role === "assistant" && (
                <>
                  <p className="role patient">AI来访者</p>
                  <div className="say">
                    <ReactMarkdown>{entry.content}</ReactMarkdown>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div id="input-container">
          {/* 这个div是消息输入框 */}
          <input
            type="text"
            id="chat-input"
            placeholder="请输入"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" id="send-button" onClick={handleUserSubmit}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};
export default Chat;
