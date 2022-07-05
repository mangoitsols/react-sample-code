import React, { Component } from 'react';
import { Link } from "react-router-dom";
import logo from '../../images/aelix-logo.svg';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import chat from '../images/chat.svg';

class Sidebar extends Component {

    render() { 
        return <React.Fragment > 
            <div style={{height:"100%", minHeight:"100vh"}}>
                <div className="sidebar d-flex flex-column flex-shrink-0 pl-0 p-3  " style={{width:'100%', height:"100%"}}>
                        <a href="#" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none logo">
                                <img src={logo} className="" alt="logo" />
                        </a>
        
                        <ul className="nav nav-pills flex-column mb-auto">
                    
                        <li>
                            <Link to="/councellordash" className="nav-link link-dark">
                            <span className='icon'><DashboardIcon/></span>
                            Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/councellorchat" className="nav-link link-dark">
                            <span className='icon'><img src={chat} className="" alt="logo" /></span>
                            chat
                            </Link>
                        </li>
                       
                        </ul>
        
                </div>
            </div>
        </React.Fragment>
    }
}
 
export default Sidebar;