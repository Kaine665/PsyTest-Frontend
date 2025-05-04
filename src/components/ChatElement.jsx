const ChatElement = ({ chat, onClick, onDelete, isChatHistory }) => {
  return (
    <div
      className="chatElement"
      onClick={onClick}
      style={{ position: "relative" }}
    >
      {isChatHistory && (
        <button
          style={{
            border: "none",
            backgroundColor: "white",
            cursor: "pointer",
            borderRadius: "4px",
            position: "absolute",
            right: "0.5rem",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("确定要删除该练习吗？")) {
              onDelete(chat.chat_history_id);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
          </svg>
        </button>
      )}
      <p style={{ textAlign: "center", fontSize: "1.1rem" }}>来访者</p>
      <p>姓名：{chat.patient_name}</p>
      <p>简介：{chat.patient_introduce}</p>
      <p>练习类型：{chat.prompt_type}</p>
      {isChatHistory && <p>最后练习时间：{chat.update_time || "未开始练习"}</p>}
    </div>
  );
};
export default ChatElement;
