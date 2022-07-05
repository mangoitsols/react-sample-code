import React, { Component } from 'react';
import ImageAvatars from './header';
import Sidebar from './sidebar';
import { Container } from "@mui/material";
import { changePassword} from "../action/auth";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class ChangePassword extends Component {
    state = {
      oldPass:"",
      newPass:"",
      confirmPass:"",
       } 

     componentDidMount() {
        $(document).ready(function () {
          $("#myform").validate({
            rules: {
                oldPass: {
                  required: true,
                },
                newPass: {
                  required: true,
                },
                confirmPass: {
                  required: true,
                },
            },
            messages: {
              oldPass: {
                required: "<p style='color:red'>Please provide a Old Password</p>",
              },
              newPass: {
                required: "<p style='color:red'>Please provide a New Password</p>",
              },
              confirmPass: {
                required: "<p style='color:red'>Please provide a Confirm Password same as New Password</p>"
              }
            },
          });
        });
      }

      handleSubmit = (e) => {
      e.preventDefault();
      const {oldPass,newPass,confirmPass} = this.state;
     
        const requestData = {
          oldPassword:oldPass,
          newPassword:newPass,
          confirmPassword:confirmPass,
          id:localStorage.getItem("id"),
        }
        this.props.changePassword(requestData,(res)=>{
          if(res.status === 200){
          toast.success("Password update successfully");
          }
        })
     
  }

    render() { 
   
        return (<>
          <Sidebar/>
          <div className='col-md-8 col-lg-9 col-xl-10 mr-30 '>
             <div className='header'> <ImageAvatars/></div>
          
             <Container maxWidth="100%" style={{padding:"0", display:"inline-block"}}>
             <div className='heading1 mb-5'>
             
                <h1>
                <span className='counsellor-logo'><LockOpenIcon/></span>Change Password</h1>
            </div>
            <form id='myform' onSubmit={this.handleSubmit}>
 
              <div className='row'>
                <div className="form-outline mb-4 col-md-6">
                  <label for="oldPass">Old Password</label>
                  <input type="text" id="oldPass" name="oldPass" className="form-control" value={this.state.oldPass} onChange={(e) => this.setState({ oldPass: e.target.value }) } />
                </div>
              </div>
              <div className='row'>
                <div className="form-outline mb-4 col-md-6">
                  <label for="newPass">New Password</label>
                  <input type="text" id="newPass" name="newPass" className="form-control"  value={this.state.newPass} onChange={(e) => this.setState({ newPass: e.target.value }) } />
                </div>
              </div>
              <div className='row'>  
                <div className="form-outline mb-4 col-md-6">
                  <label for="confirmPass">Confirm Password</label>
                  <input type="text" id="confirmPass" name="confirmPass" className="form-control"  value={this.state.confirmPass} onChange={(e) => this.setState({ confirmPass: e.target.value }) } />
                </div>
              </div>
              <div className='mt-4'>
              <button type="button" className="btn btn-transparent btn-block mb-4" >CANCEL</button>
              <input type="submit" className="btn btn-primary btn-block mb-4" value="SAVE" />
            </div>
          </form>
          </Container>
        </div>
        </>
        );
    }
}
 
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  changePassword
})(ChangePassword);