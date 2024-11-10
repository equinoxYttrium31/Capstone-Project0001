import { cbc_loading_gif } from "../../assets/Images";
import PropTypes from "prop-types";
import "./Loading.css";

export default function Loading({ fadeOut }) {
  return (
    <div className={`loadingContainer ${fadeOut ? "fade-out" : ""}`}>
      <img src={cbc_loading_gif} alt="loading" />
    </div>
  );
}

Loading.propTypes = {
  fadeOut: PropTypes.bool.isRequired, // fadeOut should be a boolean and is required
};
