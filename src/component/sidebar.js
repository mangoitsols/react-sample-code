import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from '../images/aelix-logo.svg';
import student from '../images/student.svg';
import counsellor from '../images/counsellor.svg';
import pin from '../images/pin.svg';
import chat from './images/chat.svg';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockOpenIcon from '@mui/icons-material/LockOpen';


class Sidebar extends Component {

    
    
    render() {  
        return <React.Fragment >
            <div className='col-md-4 col-lg-3 col-xl-2'>
              <div style={{height:"100%", minHeight:"100vh"}}>
                <div className="sidebar d-flex flex-column flex-shrink-0 pl-0 p-3 " style={{width:'100%', height:"100%", }}>
                        <a href="#" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none logo">
                                <img src={logo} className="" alt="logo" />
                        </a>
        
                        <ul className="nav nav-pills flex-column mb-auto">
                    
                        <li>
                            <Link to="/dashboard" className="nav-link link-dark">
                            <span className='icon'><DashboardIcon/></span>
                            Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className="nav-link link-dark">
                            <span className='icon'><AssignmentIndIcon/></span>
                            My Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/student" className="nav-link link-dark">
                            <span className='icon'> <img src={student} className="" alt="logo" /></span>
                            Students
                            </Link>
                        </li>
                        <li>
                            <Link to="/counsellor" className="nav-link link-dark">
                            <span className='icon'> <img src={counsellor} className="" alt="logo" /> </span>
                            Counsellor
                            </Link>
                        </li>
                        <li>
                            <Link to="/createPin" className="nav-link link-dark">
                            <span className='icon'> <img src={pin} className="" alt="logo" /></span>
                            Pin
                            </Link>
                        </li>
                        <li>
                            <Link to="/changepassword" className="nav-link link-dark">
                            <span className='icon'><LockOpenIcon/></span>
                            Change Password
                            </Link>
                        </li>
                        <li>
                            <Link to="/chat" className="nav-link link-dark">
                            <span className='icon'><img src={chat} className="" alt="logo" /></span>
                            chat
                            </Link>
                        </li>
                        </ul>
        
                </div>
            </div>
         </div>
        </React.Fragment>
    }
}
 
export default Sidebar;