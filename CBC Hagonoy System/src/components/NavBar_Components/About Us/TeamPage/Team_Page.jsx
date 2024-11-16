import "./Team_Page.css";
import PropTypes from "prop-types";
import { close_ic } from "../../../../../../CBC Hagonoy System Admin/src/assets/Images";
import {
  camille_s,
  dexter_r,
  drex_p,
  janna_o,
  john_f,
  johnel_g,
} from "../../../../assets/GUIsq/GUIsq";
import { facebook_icon_dark, linkedin_ic } from "../../../../assets/Assets";

export default function Team_Page({ handleGUIsqBTN }) {
  return (
    <div className="main_container_teamPage">
      <div className="teamPage_header">
        <div className="header_texts">
          <h3 className="introduction_team">Meet the Team</h3>
          <h2 className="team_name">GUIsq</h2>
        </div>
        <img
          src={close_ic}
          alt="close_button"
          className="close_button"
          onClick={handleGUIsqBTN}
        />
      </div>

      <div className="teamPage_content">
        <div className="team_adviser_cont">
          <div className="team_members">
            <img
              src=""
              alt="Marcus Louis N. Marcos"
              className="formal_picture"
            />
            <p className="member_role">Capstone Project Design Adviser</p>
            <h2 className="member_name">Mr. Marcus Louis N. Marcos, MITM</h2>
            <div className="social_icons_container">
              <img
                src={facebook_icon_dark}
                alt="facebook_icon"
                className="facebook_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/louis.marcos.1")
                }
              />
              <img
                src={linkedin_ic}
                alt="linkedIn_icon"
                className="linkedIn_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/@cbchofficial/")
                }
              />
            </div>
          </div>
        </div>

        <div className="team_members_cont">
          <div className="team_members">
            <img
              src={dexter_r}
              alt="Marc Dexter Raymundo"
              className="formal_picture"
            />
            <p className="member_role">Team Leader</p>
            <h2 className="member_name">Marc Dexter C. Raymundo</h2>
            <div className="social_icons_container">
              <img
                src={facebook_icon_dark}
                alt="facebook_icon"
                className="facebook_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/dexxrayearth")
                }
              />
              <img
                src={linkedin_ic}
                alt="linkedIn_icon"
                className="linkedIn_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.linkedin.com/in/marc-dexter-raymundo-3976b9261/")
                }
              />
            </div>
          </div>

          <div className="team_members">
            <img
              src={janna_o}
              alt="Janna Noehlla Odiada"
              className="formal_picture"
            />
            <p className="member_role">System Analyst</p>
            <h2 className="member_name">Janna Noehlla L. Odiada</h2>
            <div className="social_icons_container">
              <img
                src={facebook_icon_dark}
                alt="facebook_icon"
                className="facebook_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/odiadajanna")
                }
              />
              <img
                src={linkedin_ic}
                alt="linkedIn_icon"
                className="linkedIn_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/@cbchofficial/")
                }
              />
            </div>
          </div>

          <div className="team_members">
            <img
              src={john_f}
              alt="John Mark Flameño"
              className="formal_picture"
            />
            <p className="member_role">Developer</p>
            <h2 className="member_name">John Mark E. Flameño</h2>
            <div className="social_icons_container">
              <img
                src={facebook_icon_dark}
                alt="facebook_icon"
                className="facebook_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/flameno.john31")
                }
              />
              <img
                src={linkedin_ic}
                alt="linkedIn_icon"
                className="linkedIn_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.linkedin.com/in/john-mark-flameño-845b5030b/")
                }
              />
            </div>
          </div>

          <div className="team_members">
            <img
              src={johnel_g}
              alt="Johnel J. Guevarra"
              className="formal_picture"
            />
            <p className="member_role">Documenter</p>
            <h2 className="member_name">Johnel J. Guevarra</h2>
            <div className="social_icons_container">
              <img
                src={facebook_icon_dark}
                alt="facebook_icon"
                className="facebook_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/johnel.guevarra.9")
                }
              />
              <img
                src={linkedin_ic}
                alt="linkedIn_icon"
                className="linkedIn_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/@cbchofficial/")
                }
              />
            </div>
          </div>

          <div className="team_members">
            <img
              src={camille_s}
              alt="Camille S. Santiago"
              className="formal_picture"
            />
            <p className="member_role">Graphic Designer</p>
            <h2 className="member_name">Camille S. Santiago</h2>
            <div className="social_icons_container">
              <img
                src={facebook_icon_dark}
                alt="facebook_icon"
                className="facebook_icon icon"
                onClick={() =>
                  (window.location.href = "https://www.facebook.com/badguy.fr")
                }
              />
              <img
                src={linkedin_ic}
                alt="linkedIn_icon"
                className="linkedIn_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/@cbchofficial/")
                }
              />
            </div>
          </div>

          <div className="team_members">
            <img
              src={drex_p}
              alt="Drex Dhenzel T. Plamenco"
              className="formal_picture"
            />
            <p className="member_role">Documenter</p>
            <h2 className="member_name">Drex Dhenzel T. Plamenco</h2>
            <div className="social_icons_container">
              <img
                src={facebook_icon_dark}
                alt="facebook_icon"
                className="facebook_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/drex.dhenzel.9")
                }
              />
              <img
                src={linkedin_ic}
                alt="linkedIn_icon"
                className="linkedIn_icon icon"
                onClick={() =>
                  (window.location.href =
                    "https://www.facebook.com/@cbchofficial/")
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Team_Page.propTypes = {
  handleGUIsqBTN: PropTypes.func.isRequired,
};
