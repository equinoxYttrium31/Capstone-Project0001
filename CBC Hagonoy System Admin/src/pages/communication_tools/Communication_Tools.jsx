import './Communication_Tools.css'
import {search_ic} from '../../assets/Images'

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

                    <div className="list_of_user_conntainer">
                        <div className="commnunication_user_container">
                            <img src="" alt="user_profile" className="communication_user_profile" />
                            <h3 className="communication_user_name">user</h3>
                        </div>
                    </div>

                </div>
            </div>

        </div>

        </div>
    )
}
