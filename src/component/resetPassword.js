import React,{useState} from 'react';
import { Container } from "@mui/material";
import { useEffect } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import $ from "jquery";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { API } from '../config/config';
import axios from 'axios';
toast.configure();

const ResetPassword = () => {

  const [newPass,setNewPass]=useState("");
  const [confirmPass,setConfirmPass]=useState("");


    useEffect(() =>{
        $(document).ready(function () {
            $("#myform").validate({
              rules: {
                  newPass: {
                    required: true,
                    minlength: 5,
                  },
                  confirmPass: {
                    required: true,
                    minlength: 5,
                    equalTo: "#newPass"
                  },
              },
              messages: {
                newPass: {
                  required: "<p style='color:red'>Please provide a New Password</p>",
                  minlength: "<p style='color:red'>Minimum length 6</p>",
                },
                confirmPass: {
                  required: "<p style='color:red'>Please provide a Confirm Password</p>",
                  minlength: "<p style='color:red'>Minimum length 6</p>",
                  equalTo:"<p style='color:red'>Password must be same as New Password</p>"
                }
              },
            });
          });
    },[])

    const handleSubmit = async(e) => {
        e.preventDefault();
          const requestData = {
            newPassword:newPass,
            confirmPassword:confirmPass,
            token:localStorage.getItem("ForgotPasswordToken")
          }

        const response = await axios
        .post(`${API.changePassword}`,requestData)
        .catch((err) => {});
        if(response.status === 200){
            toast.success("Password update successfully")
            setTimeout(() => {
                window.location = "/";
                }, 500);
            } 
        else{
            toast.error("Password update failed")
        }  
    }

    return ( 
        <>
          <Sidebar/>
          <div className='col-md-8 col-lg-9 col-xl-10 mr-30 '>
             <div className='header'> <ImageAvatars/></div>
          
             <Container maxWidth="100%" style={{padding:"0", display:"inline-block"}}>
             <div className='heading1 mb-5'>
                <h1>Reset Password</h1>
            </div>
            <form id='myform' onSubmit={handleSubmit}>
 
              <div className='row'>
                <div className="form-outline mb-4 col-md-6">
                  <label for="newPass">New Password</label>
                  <input type="text" id="newPass" name="newPass" className="form-control"  value={newPass} onChange={(e) => setNewPass(e.target.value ) } />
                </div>
              </div>
              <div className='row'>  
                <div className="form-outline mb-4 col-md-6">
                  <label for="confirmPass">Confirm Password</label>
                  <input type="text" id="confirmPass" name="confirmPass" className="form-control"  value={confirmPass} onChange={(e) => setConfirmPass( e.target.value ) } />
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
 
export default ResetPassword;