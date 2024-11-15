import "./TermsAndCondition.css";
import PropTypes from "prop-types";
import { close_ic } from "../../../../CBC Hagonoy System Admin/src/assets/Images";

export default function TermsAndCondition({
  isOpen,
  onClose,
  termsChecked,
  setTermsChecked,
}) {
  if (!isOpen) return null;

  const handleModalCheckboxChange = (e) => {
    setTermsChecked(e.target.checked); // Update the shared state
  };
  return (
    <div className="terms-and-condition">
      <div className="terms_condition_header">
        <div className="text_header_container">
          <h2 className="church_name_header">
            CHRISTIAN BIBLE CHURCH OF HAGONOY
          </h2>
          <h1 className="header_title">Terms and Conditions</h1>
        </div>
        <img
          src={close_ic}
          alt="closeButton"
          className="close_btn"
          onClick={onClose}
        />
      </div>

      {/*this is where the content will render*/}
      <div className="terms_condition_content">
        <h5 className="main_title_of_contents">
          Terms and Conditions for CHRISTIAN BIBLE CHURCH OF HAGONOY Web-Based
          Recording and Monitoring System:
        </h5>
        <p className="update_date">Last Updated: November 2024</p>
        <p className="introduction_of_terms_context">
          Welcome to the Christian Bible Church of Hagonoy (CBCH) Web-Based
          Recording and Monitoring System. By signing up and creating an
          account, you agree to abide by the following Terms and Conditions.
          Please read them carefully:
        </p>
        <hr></hr>
        <div className="contents_container">
          <div className="contents">
            <h3 className="contents_title">1. Account Responsibility</h3>
            <p className="content_text">
              You are responsible for maintaining the confidentiality of your
              login credentials. CBCH is not liable for any unauthorized use of
              your account.
            </p>
          </div>
          <div className="contents">
            <h3 className="contents_title">2. Data Privacy</h3>
            <p className="content_text">
              CBCH respects your privacy. Personal information collected through
              this system is used solely for church-related purposes, such as
              attendance tracking, announcements, and prayer requests. CBCH will
              not share your information with third parties without your
              consent, unless required by law.
            </p>
          </div>
          <div className="contents">
            <h3 className="contents_title">3. Use of the System</h3>
            <p className="content_text">
              You agree to use this system only for legitimate church-related
              activities. Unauthorized use, including any attempt to access
              restricted areas, modify data without permission, or interfere
              with other users&apos; accounts, is strictly prohibited.
            </p>
          </div>
          <div className="contents">
            <h3 className="contents_title">4. Content Submission</h3>
            <p className="content_text">
              Any information or data submitted, including prayer requests and
              attendance records, should be truthful and accurate. CBCH reserves
              the right to remove or modify any content that violates these
              terms or is deemed inappropriate.
            </p>
          </div>
          <div className="contents">
            <h3 className="contents_title">5. Modifications and Updates</h3>
            <p className="content_text">
              CBCH reserves the right to update or modify these Terms and
              Conditions as needed. Notifications of changes will be posted on
              the system, and continued use of the system after such updates
              implies your acceptance of the revised terms.
            </p>
          </div>
          <div className="contents">
            <h3 className="contents_title">6. Account Termination</h3>
            <p className="content_text">
              CBCH may suspend or terminate your account if there is evidence of
              misuse or a violation of these terms.
            </p>
          </div>
          <div className="contents">
            <h3 className="contents_title">7. Limitation of Liability</h3>
            <p className="content_text">
              CBCH is not liable for any data loss, technical issues, or other
              damages resulting from the use of this system. Users are
              encouraged to report issues promptly to ensure efficient
              resolution.
            </p>
          </div>
        </div>
        <hr></hr>
        <div className="terms_condition_footer">
          <div className="checkbox_holder">
            <input
              type="checkbox"
              className="checkbox-input"
              id="terms"
              required
              checked={termsChecked} // Controlled by shared state
              onChange={handleModalCheckboxChange} // Updates shared state
            />
            <label htmlFor="terms" className="agreement_label">
              I agree
            </label>
          </div>
          <button className="continue_button" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

TermsAndCondition.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  termsChecked: PropTypes.bool.isRequired,
  setTermsChecked: PropTypes.func.isRequired,
};
