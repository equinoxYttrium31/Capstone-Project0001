import "./TermsAndCondition.css";
import { useState } from "react";
import PropTypes from "prop-types";

export default function TermsAndCondition({ isOpen, onClose }) {
  if (!isOpen) return null;
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
    </div>
  );
}

TermsAndCondition.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
