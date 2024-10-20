import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Login_Signup_bg, cbc_logo, bck_btn } from "../../assets/Assets";
import "./Login_Signup.css";

function Login_Signup({ type, onClose, toggleOverlayType, onLoginSuccess }) {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = data;
    try {
      const { data } = await axios.post(
        "https://capstone-project0001-2.onrender.com/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Login Successfuly!");
        setData({});
        onLoginSuccess();
      }
    } catch (error) {
      toast.error("Login failed:", error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, birthDate } =
      data;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://capstone-project0001-2.onrender.com/register",
        {
          firstName,
          lastName,
          email,
          password,
          birthDate,
        }
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({ firstName, lastName, email, password, birthDate });
        toast.success("Account Registered. Welcome!");
        toggleOverlayType();
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main_container">
      {type === "login" && (
        <div className="login_container">
          <div className="img_holder">
            <img
              src={bck_btn}
              alt="Back"
              className="backbutton"
              onClick={onClose}
            />
            <img
              src={Login_Signup_bg}
              alt="Login Background"
              className="login_img"
            />
          </div>
          <div className="input_holder">
            <div className="logo_holder">
              <img src={cbc_logo} alt="CBC Logo" className="reg_logo" />
            </div>
            <div className="text_holder">
              <h3 className="greetings">Welcome Back!</h3>
            </div>
            <div className="input_fields">
              <form onSubmit={handleLogin}>
                <input
                  name="email"
                  className="email"
                  type="text"
                  placeholder=" "
                  required
                  value={data.email}
                  onChange={handleChange}
                />
                <label className="email_text">Email</label>
                <input
                  name="password"
                  className="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  required
                  value={data.password}
                  onChange={handleChange}
                />
                <label className="password_text">Password</label>

                {error && <p className="error_message">{error}</p>}

                <div className="checkboxes-container">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="showPass"
                      className="checkbox-input"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <label htmlFor="showPass" className="checkfield_label">
                      Show Password
                    </label>
                  </div>
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="keepLoggedIn"
                      className="checkbox-input"
                    />
                    <label htmlFor="keepLoggedIn" className="checkfield_label">
                      Keep me logged in
                    </label>
                  </div>
                </div>
                <button className="Login_btn" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <a href="">Forgot Password?</a>
            </div>
            <div className="no_acc_container">
              <p className="no_acc_text">Don't have an account yet?</p>
              <button className="no_acc_link" onClick={toggleOverlayType}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {type === "signup" && (
        <div className="signup_container">
          <div className="registration_field">
            <div className="reg_back_btn_cont">
              <img
                src={bck_btn}
                alt="Back"
                className="reg_backbutton"
                onClick={onClose}
              />
            </div>
            <div className="input_fields">
              <div className="reg_logo_holder">
                <img src={cbc_logo} alt="CBC Logo" className="reg_logo" />
              </div>
              <div className="text_holder">
                <h3 className="greetings">Welcome Brethren!</h3>
              </div>
              <form onSubmit={handleSignup}>
                <div className="general_cont">
                  <div className="row_cont">
                    <input
                      name="firstName"
                      type="text"
                      className="F_name"
                      placeholder=" "
                      required
                      value={data.firstName}
                      onChange={handleChange}
                    />
                    <label className="F_name_text">First Name</label>

                    <input
                      name="lastName"
                      type="text"
                      className="L_name"
                      placeholder=" "
                      required
                      value={data.lastName}
                      onChange={handleChange}
                    />
                    <label className="L_name_text">Last Name</label>
                  </div>
                  <div className="row_cont">
                    <input
                      name="email"
                      type="email"
                      className="Email_Add"
                      placeholder=" "
                      required
                      value={data.email}
                      onChange={handleChange}
                    />
                    <label className="Email_Add_text">Email Address</label>

                    <input
                      name="birthDate"
                      type="date"
                      className="B_Date"
                      placeholder=" "
                      required
                      value={data.birthDate}
                      onChange={handleChange}
                    />
                    <label className="B_date_text">Birthdate</label>
                  </div>
                  <div className="row_cont">
                    <input
                      name="password"
                      type="password"
                      className="reg_pass"
                      placeholder=" "
                      required
                      value={data.password}
                      onChange={handleChange}
                    />
                    <label className="reg_pass_text">Password</label>

                    <input
                      name="confirmPassword"
                      type="password"
                      className="conf_pass"
                      placeholder=" "
                      required
                      value={data.confirmPassword}
                      onChange={handleChange}
                    />
                    <label className="conf_pass_text">Confirm Password</label>
                  </div>
                </div>
                <div className="checkbox_holder">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    id="agreement"
                    required
                  />
                  <label htmlFor="agreement" className="agreement_label">
                    I agree to the Privacy Policy and Terms of Service Agreement
                  </label>
                </div>
                <button className="signup_btn" type="submit" disabled={loading}>
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
              <div className="has_acc_container">
                <p className="has_acc_text">Already have an account?</p>
                <button className="has_acc_link" onClick={toggleOverlayType}>
                  Login
                </button>
              </div>
            </div>
          </div>
          <div className="img_holder_signup">
            <img
              src={Login_Signup_bg}
              alt="Signup Background"
              className="signup_img"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login_Signup;
