import { useState } from "react";
import PropTypes from "prop-types";
import { cbc_logo } from "../../assets/Images";
import "./adminLogin.css";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "administrator" && password === "CBCH123!") {
      onLogin();
    } else {
      alert("Invalid credentials"); // Replace with a better error message or toast
    }
  };

  return (
    <div className="login_container">
      <div className="main_login_container">
        <div className="login_containerHeader">
          <img src={cbc_logo} alt="cbch logo" className="admin_church_logo" />
          <h2 className="church_text">CHRISTIAN BIBLE CHURCH OF HAGONOY</h2>
          <h2 className="heading_text">Administrator Login</h2>
        </div>
        <div className="login_form_container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="input_form"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="input_form"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="login_btn_admin" type="submit">
              Login
            </button>
          </form>
        </div>
        <p className="label_below">
          Please log in below to access the administrator dashboard.
        </p>
      </div>
    </div>
  );
}
AdminLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
export default AdminLogin;
