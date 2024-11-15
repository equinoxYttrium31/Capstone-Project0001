import PropTypes from "prop-types";
import "./TermsAndCondition.css";

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
          <h2 className="church_name_heade">
            CHRISTIAN BIBLE CHURCH OF HAGONOY
          </h2>
          <h1 className="header_title">Terms and Conditions</h1>
        </div>
        <img src="" alt="closeButton" className="close_btn" onClick={onClose} />
      </div>

      <div className="terms_condition_content">
        <h5 className="main_title_of_contents">
          Terms and Conditions for CHRISTIAN BIBLE CHURCH OF HAGONOY Web-Based
          Recording and Monitoring System:
        </h5>
        <p className="update_date">Last Updated: November 2024</p>
        <p className="introduction_of_terms_context">
          {/* Terms content here */}
        </p>
        <hr />
        <div className="terms_condition_footer">
          <div className="checkbox_holder">
            <input
              type="checkbox"
              className="checkbox-input"
              id="modal-terms"
              checked={termsChecked} // Controlled by shared state
              onChange={handleModalCheckboxChange} // Updates shared state
            />
            <label htmlFor="modal-terms" className="agreement_label">
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
