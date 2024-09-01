import React, { useState } from 'react';
import { Login_Signup_bg, cbc_logo, bck_btn } from '../../assets/Assets';
import './Login_Signup.css';

function Login_Signup({ type, onClose, toggleOverlayType, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary credentials for demonstration
    const demoEmail = 'user@example.com';
    const demoPassword = 'password123';

    if (email === demoEmail && password === demoPassword) {
      onLoginSuccess(); // Call the login success callback
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className='main_container'>
      {/* Login Form */}
      {type === 'login' && (
        <div className="login_container">
          <div className="img_holder">
            <img src={bck_btn} alt="back_btn" className="backbutton" onClick={onClose} />
            <img src={Login_Signup_bg} alt="login_background" className="login_img" />
          </div>
          <div className="input_holder">
            <div className="logo_holder">
              <img src={cbc_logo} alt="cbc_logo" className="reg_logo" />
            </div>
            <div className="text_holder">
              <h3 className='greetings'>Welcome Back!</h3>
            </div>
            <div className="input_fields">
              <form onSubmit={handleLogin}>
                <input
                  className='email'
                  type='text'
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className='email_text'>Email</label>
                <input
                  className='password'
                  type={showPassword ? 'text' : 'password'} // Toggle between text and password
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                      onChange={() => setShowPassword(!showPassword)} // Toggle password visibility
                    />
                    <label htmlFor="showPass" className="checkfield_label">Show Password</label>
                  </div>
                  <div className="checkbox-item">
                    <input type="checkbox" id="keepMe" className="checkbox-input" />
                    <label htmlFor="keepMe" className="checkfield_label">Keep Me Logged In</label>
                  </div>
                </div>
                <button className='Login_btn' type='submit'>Login</button>
              </form>
              <a href=''>Forgot Password</a>
            </div>
            <div className="no_acc_container">
              <p className='no_acc_text'>Don't have an account yet?</p>
              <button className="no_acc_link" onClick={toggleOverlayType}>Sign Up</button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Form */}
      {type === 'signup' && (
        <div className="signup_container">
          <div className='registration_field'>
            <div className="reg_back_btn_cont">
              <img src={bck_btn} alt="back_btn" className="reg_backbutton" onClick={onClose} />
            </div>
            <div className="input_fields">
              <div className="reg_logo_holder">
                <img src={cbc_logo} alt="cbc_logo" className="reg_logo" />
              </div>
              <div className="text_holder">
                <h3 className='greetings'>Welcome Brethren!</h3>
              </div>
              <div className="general_cont">
                <div className="row_cont">
                  <input type='text' className='F_name' placeholder=" " required />
                  <label className='F_name_text'>First Name</label>

                  <input type='text' className='L_name' placeholder=" " required />
                  <label className='L_name_text'>Last Name</label>
                </div>
                <div className="row_cont">
                  <input type='email' className='Email_Add' placeholder=" " required />
                  <label className='Email_Add_text'>Email Address</label>

                  <input type='date' className='B_Date' placeholder=" " required />
                  <label className='B_date_text'>Birthdate</label>
                </div>
                <div className="row_cont">
                  <input type='password' className='reg_pass' placeholder=" " required />
                  <label className='reg_pass_text'>Password</label>

                  <input type='password' className='conf_pass' placeholder=" " required />
                  <label className='conf_pass_text'>Confirm Password</label>
                </div>
              </div>
              <div className="checkbox_holder">
                <input type='checkbox' className='checkbox-input' id='agreement' />
                <label htmlFor='agreement' className='agreement_label'>I agree on the Privacy Policy and Terms of Service Agreement</label>
              </div>
              <button className="signup_btn" type='submit'>Sign Up</button>
              <div className="has_acc_container">
                <p className='has_acc_text'>Already have an account?</p>
                <button className="has_acc_link" onClick={toggleOverlayType}>Login</button>
              </div>
            </div>
          </div>
          <div className="img_holder_signup">
            <img src={Login_Signup_bg} alt="signup_background" className="signup_img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Login_Signup;
