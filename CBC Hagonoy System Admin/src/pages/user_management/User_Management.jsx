import './User_Management.css'
import {search_ic} from '../../assets/Images'

export default function User_Management() {
    return (
        <div className='main_user_management_cont'>
            <div className="header_user_management">
                <p className="church_name_user_management">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
                <h1 className='user_management_lbl'>User Management</h1>
            </div>

            <div className="search_bar_cont_userManage">
                <input type="text" className="search_bar_userManage" placeholder="Search for users"/>
                <img src={search_ic} alt="search_icon" className='search_icon_userManage'/>
            </div>

            <p className="description-cell">List of all the current users.</p>
            <div className="user_management_container">
                <table className="user-management-accounts-table">
                    <thead className='user-management-table-headers'>
                        <tr className="table-header-row">
                            <th className="table-header">Number</th>
                            <th className="table-header">Name</th>
                            <th className="table-header">Age</th>
                            <th className="table-header">Gender</th>
                            <th className="table-header">Date Archived</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        
                    </tbody>
                </table>
            </div>
            
            {/**Modal Place */}

        </div>
    )
}
