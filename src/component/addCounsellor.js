import React, { Component } from 'react';
import ImageAvatars from './header';
import Sidebar from './sidebar';
import { FormControl, MenuItem, Select, Container } from "@mui/material";
import { createClass,getClass,createCounsellorandManager} from "../action/index";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class AddCounsellor extends Component {
    state = {
        openmodel: false,
        uname: "",
        password: "",
        mobile: "",
        lastname: "",
        name: "",
        getclasses:[],
        classSelect:"",  
       } 


      

     componentDidMount() {
      
      $('input[name="mobile"]').keyup(function(e){
        if (/\D/g.test(this.value))
        {
          // Filter non-digits from input value.
          this.value = this.value.replace(/\D/g, '');
        }
        });

      this.getClassData();
         $(document).ready(function () {
             $("#myform").validate({
            rules: {
                uname: {
                    required: true,
                  },
                  lastname: {
                    required: true,
                  },
                  name: {
                required: true,
              },
              mobile: {
                required: true,
              },
              password: {
                required: true,
                address: true,
              },
              classSelect: {
                required: true,
              },
            },
            messages: {
              name: {
                  required: "<p style='color:red'>Please provide a Name</p>",
              },
              lastname: {
                required: "<p style='color:red'>Please provide a Last Name</p>",
              },
              uname: {
                required: "<p style='color:red'>Please provide a User Name</p>",
              },
              mobile: {
                required: "<p style='color:red'>Please provide a Contact Number</p>",
              },
              password: {
                  required: "<p style='color:red'>Please provide a Password</p>",
              },
              classSelect: {
                  required: "<p style='color:red'>Please select a CLass Name</p>",
                },
            },
          });
        });
      }
      
      getClassData = () => {
      this.props.getClass((res)=>{
          this.setState({getclasses:res.data.data})
      })
    }

      handleSubmit = (e) => {
          e.preventDefault();
        const {classSelect,mobile,name,lastname,password,uname} = this.state;
        if(classSelect && mobile && name && lastname && password && uname === ""){
            toast.error("All fields are required");
        }
        else{
            const requestData = {
                role: "counsellor",
                name: name,
                phone: mobile,
                username: uname,
                password: password,
                classId:classSelect,
                lastname:lastname,
              };
              this.props.createCounsellorandManager(requestData, (res) => {
                if (res.status === 200) {
                  toast.success("New Counsellor Added");
                  this.setState({uname: "",
                  password: "",
                  mobile: "",
                  lastname: "",
                  name: "",
                  classSelect:""})
                  window.location.replace("/counsellor");
                  
                } else if (res.status === 400) {
                  // toast.error(res.data.message);
                }
              });
      }
     
  }

    render() { 
      
        return (<>
          <Sidebar/>
          <div className='col-md-8 col-lg-9 col-xl-10 mr-30 '>
             <div className='header'> <ImageAvatars/></div>
             <Container maxWidth="100%" style={{padding:"0", display:"inline-block"}}>
             <div className='heading1 mb-5'>
                <h1>Add Counsellor</h1>
            </div>
            <form id='myform' onSubmit={this.handleSubmit} >
 
            <div className='row'>
              <div className="form-outline mb-4 col-md-6">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" className="form-control" placeholder='Please enter your name' value={this.state.name} onChange={(e) => this.setState({ name: e.target.value }) } />
              </div>
              <div className="form-outline mb-4 col-md-6">
                <label for="lastname">Last Name</label>
                <input type="text" id="lastname" name="lastname" className="form-control" placeholder='Please enter your lastname'  value={this.state.lastname} onChange={(e) => this.setState({ lastname: e.target.value }) } />
              </div>
            </div>
            <div className='row'>
            <div className="form-outline mb-4 col-md-6">
              <label for="mobile">Mobile No.</label>
              <input type="tel" id="mobile" name="mobile" className="form-control" placeholder="Please enter your mobile number"  value={this.state.mobile} onChange={(e) => this.setState({ mobile: e.target.value }) } />

              {/* <input type="text" id="mobile" name="mobile" className="form-control"  value={this.state.mobile} onChange={(e) => this.setState({ mobile: e.target.value }) } /> */}
            </div>
            <div className="form-outline mb-4 col-md-6">
            <label for="assign" className='w-100'>Assign</label>
            <FormControl sx={{ m: 0, minWidth: 120 }} className="filterbox w-100">
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={this.state.classSelect}
                                label="Filter"
                                onChange={(e) => this.setState({ classSelect: e.target.value })}
                                inputProps={{ 'aria-label': 'Without label' }}
                               
                                >
                                  {this.state.getclasses.map((item)=>{ 
                                    return(
                                     <MenuItem value={item._id}>{item.className}</MenuItem> 

                                 ) })} 
                            </Select>
                        </FormControl>
            </div>
            </div>
            <div className='row'> <div className="form-outline mb-4 col-md-6">
              <label for="uname">User Name</label>
              <input type="text" id="uname" name="uname" className="form-control" placeholder='Please enter a username' value={this.state.uname} onChange={(e) => this.setState({ uname: e.target.value }) } />
            </div>
            <div className="form-outline mb-4 col-md-6">
            <label for="password">Password</label>
              <input type="password" id="password" name="password" className="form-control" placeholder='Please enter a strong password' value={this.state.password} onChange={(e) => this.setState({ password: e.target.value }) } />
            </div>   
            </div> 
            <a href='/counsellor' className="btn btn-transparent btn-block mb-4" >CANCEL</a>          
            <input type="submit" className="btn btn-primary btn-block mb-4" value="SAVE" />
            
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
  createClass,getClass,createCounsellorandManager,
})(AddCounsellor);