import './Communication_Tools.css'
import {search_ic, user_placeholder} from '../../assets/Images'

export default function Communication_Tools() {
    //Implementations


    //Functions

    return (
        <div className="communication_tools_container"> {/**This will be the acting global of the communication tools*/}

        <div className="communication_main_container"> {/**This will be the main container*/}
            {/**Header Part */}
            <div className="communication_header_container">
                <p className="communication_church_name">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
                <h1 className="communication_header_Lbl">Communication Tools</h1>
            </div>

            {/**Main Communication Progress*/}
            <div className="communication_main_comms">
                <div className="list_of_contacts"> {/**This will be where the contacts from user will be shown which is most likely their prayer request */}
                    <div className="list_of_contacts_header">
                        <input type="text" className='communication_search_bar'>
                        </input>
                        <img src={search_ic} alt="" className="communication_search_ic" />
                    </div>

                    <div className="list_of_user_container">
                        <div className="communication_user_container">
                            <img src={user_placeholder} alt="user_profile" className="communication_user_profile" />
                            <h3 className="communication_user_name">Username</h3>
                        </div>
                    </div>
                </div>
                <div className="prayer_request_area">
                    <div className="header_prayer_request_area">
                        <img src={user_placeholder} alt="userprofile" className="profile_prayer_request_area" />
                        <h3 className="username_prayer_request_area">Username</h3>
                    </div>
                    <div className="prayer_request_area_cont">
                        
                    </div>
                </div>
            </div>

        </div>

        </div>
    )
}
