import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
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
