import { useState, useEffect } from "react";

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

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie("cookie_consent"); // 改为用 cookie
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie("cookie_consent", "true", 365); // 存一年
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#222",
        color: "#fff",
        padding: "16px",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      {" "}
      本站使用 Cookie 保存用户登录信息。点击“同意”表示您接受该Cookie 政策。
      <button
        style={{ marginLeft: "1rem", fontSize: "1.5rem" }}
        onClick={handleAccept}
      >
        同意
      </button>
    </div>
  );
};

export default CookieConsent;
