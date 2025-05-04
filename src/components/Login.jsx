import "../assets/css/main.css";
import "../assets/css/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + encodeURIComponent(value) + expires + "; path=/";
  };

  const handleLogin = async () => {
    const res = await fetch("https://psytest-backend.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ account, password }),
    });
    const data = await res.json();
    if (data.success) {
      setMsg("登录成功！跳转中...");
      setCookie("account", account, 7); // 用 cookie 保存账号，有效期7天
      setTimeout(() => {
        navigate("/chats");
      }, 1000);
    } else {
      setMsg(data.msg || "登录失败");
    }
  };

  return (
    <div id="Login">
      <p>
        账号：
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
      </p>
      <p>
        密码：
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </p>

      <button onClick={handleLogin}>登录</button>

      {msg && (
        <div style={{ color: "red", marginTop: "20px", fontSize: "1.2rem" }}>
          {msg}
        </div>
      )}
    </div>
  );
};
export default Login;
