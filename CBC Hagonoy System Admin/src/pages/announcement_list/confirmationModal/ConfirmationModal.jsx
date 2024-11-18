import PropTypes from "prop-types";
import "./ConfirmationModal.css"; // Add styles for modal if needed

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <div className="confirmation-buttons">
          <button className="cancel_btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm_btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmationModal;
