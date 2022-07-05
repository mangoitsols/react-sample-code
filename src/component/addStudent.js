import React, { Component } from 'react';
import ImageAvatars from './header';
import Sidebar from './sidebar';
import {Fade, Modal, Backdrop, Box, FormControl, MenuItem, Select, Container } from "@mui/material";
import { createClass,getClass} from "../action/index";
import {addStudent} from "../action/student";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import Example from '../comman/loader';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class AddStudent extends Component {
    state = {
      nameC:'',
      openmodel: false,
      openmodelNumber: false,
      name: "",
			lastname: "",
      fatherName: "",
			dob: "",
			phonename1: "",
      phonename2: "",
      phonename3: "",
      phone:"",
      phone1:"",
      phone2:"",
      photo:"",
      file: "",
      medical:"",
      address:"",
      emergency:[],
      getclasses:[],
      classSelect:"",
      addName:"",
      addNumber:"",
      database:[],
      checked:false,
      
       } 

       handleChange = (event) => {
        let checkedbox = event.target.checked 
         this.setState({
          checked: checkedbox 
        })
      }
      

     componentDidMount() {

      $('input[name="phone"]').keyup(function(e){
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
              name: {
                required: true,
                },
              lastname: {
                required: true,
              },
              fatherName: {
                required: true,
              },
              dob: {
                required: true,
              },
              phonename1: {
                required: true,
              },
              phone:{
                required:true,
              },
              photo:{
                required:true,
              },
             
              address: {
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
              fatherName: {
                required: "<p style='color:red'>Please provide a Father Name</p>",
              },
              dob: {
                required: "<p style='color:red'>Please select your Date of Birth</p>",
              },
              phonename1: {
                required: "<p style='color:red'>Please provide a name for emergency no.</p>",
              },
              phone: {
                required: "<p style='color:red'>Please provide a Emergency No.</p>",
              },
              photo: {
                required: "<p style='color:red'>Please select a photo</p>",
              },
             
              address: {
                required: "<p style='color:red'>Please provide a address</p>",
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
      const {name,lastname,fatherName,dob,phonename1,phone,phone1,phone2,phonename2,phonename3,emergency,medical,address,classSelect,file} = this.state;
      emergency.push({Ename:phonename1,number:phone},{Ename:phonename2,number:phone1},{Ename:phonename3,number:phone2})
      
      const formData = new FormData();
      if(classSelect === ""){
          toast.error("Please assign a class");
      }
       if(file.size >= 6000) {
        toast.error("Profile size should be less than 6kb");
      }
      else{
        const requestData = {
          name: name,
          lastName: lastname,
          fatherName: fatherName,
          DOB: dob,
          address: address,
          image: file,
          assignClass: classSelect,
          medical: medical,
          emergency:JSON.stringify(emergency),    
        };
        for (var key in requestData) {
          formData.append(key, requestData[key]);
        }
        this.props.addStudent(formData, (res) => {
         
          if (res.status === 200) {
            toast.success("Student Added Successfully");
            setTimeout(
              () => {
              window.location.replace("/student");
              }, 500)
          } else if (res.status === 400 ) {
            toast.error("Student Added Failed");
          }
      
        });
      }
    }
    
    handleClose = () => this.setState({ openmodel: false });
    handleOpen = () => this.setState({ openmodel: true });
    handleAddNumber = () => this.setState({ openmodelNumber: true });
    handleCloseNumber = () => this.setState({ openmodelNumber: false });
    modelEmergency = (e) => {
      this.setState({ addNumber : e.target.value })
      $('input[name="phone"]').keyup(function(e){
        if (/\D/g.test(this.value))
        {
          // Filter non-digits from input value.
          this.value = this.value.replace(/\D/g, '');
        }
        });
    }
    
    handleCreateClass = (e) => {
    e.preventDefault()
    const { nameC } = this.state;
    if(!nameC.startsWith("class")){
      toast.error("classname must start with class ex: 'class A'");
    }
    else{
      const requestData = {
        className: nameC
      };
      this.props.createClass(requestData, (res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          this.setState({openmodel:false})
        } else if (res.status === 400) {
          toast.error(res.data.message);
        }
      });
    }
  }
  
  handleAddNewNumber = (e) => {
    e.preventDefault()
    const { addName,addNumber,database,emergency } = this.state;
    
    if(addName === "" || addNumber === ""){
      toast.error("Fields are required");
    }
    else{
      emergency.push({
        Ename: addName,
        number: addNumber,
      });
      this.setState({database:emergency})
      if(emergency.length !== 0){
        this.setState({openmodelNumber:false});
        toast.success("Number added successfully");
      }else{
        toast.error("Number added failed");
      }      
    }
    
  }
  
  _handleImageChange(e) {
    e.preventDefault();
    
		let reader = new FileReader();
		let file = e.target.files[0];

		reader.onloadend = () => {
      this.setState({
        file: file,
				photo: reader.result
			});
		}
		reader.readAsDataURL(file)
    
	}
  
  render() { 
    const {openmodel,openmodelNumber,classSelect,getclasses,photo,phone,phone1,phone2,phonename1,phonename2,phonename3,medical,address,name,lastname,fatherName,dob,database} = this.state;
    let $imagePreview = null;
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "background.paper",
      borderRadius: "15px",
      p: 4,
    };

    const content = (this.state.checked === true ) ? "display form-outline mb-4 col-md-12 medicaltextarea" : "no-display form-outline mb-4 col-md-12 medicaltextarea";

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return (<>
          <Sidebar/>
          <div className='col-md-8 col-lg-9 col-xl-10 mr-30 '>
             <div className='header'> <ImageAvatars/></div>
             <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openmodel}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openmodel}>
            <Box sx={style}>
            <form className="mui-form" onSubmit={this.handleCreateClass}> 
                <legend >Add Class</legend>
                <div className="mui-textfield">
                  <input type="text" placeholder='class E' onChange={(e) => this.setState({ nameC: e.target.value })}/>
                </div>
                <div className="btndesign text-right">
                <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={this.handleClose}
                  >CLOSE</button>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="SAVE"
                  />      
                
                </div>
              </form>
            </Box>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openmodelNumber}
          onClose={this.handleCloseNumber}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openmodelNumber}>
            <Box sx={style}>
            <form className="mui-form" onSubmit={this.handleAddNewNumber}> 
                <legend >Add Number</legend>
                <div className="mui-textfield">
                  <input type="text" placeholder='Please enter your name' onChange={(e) => this.setState({ addName : e.target.value })}/>
                  <input type="tel" name="phone" placeholder='Please enter your mobile no.' onChange={(e) => this.modelEmergency(e)}/>
                </div>
                <div className="btndesign text-right">
                <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={this.handleCloseNumber}
                  >CLOSE</button>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="SAVE"
                  />      
                
                </div>
              </form>
            </Box>
          </Fade>
        </Modal>
             <Container maxWidth="100%" style={{padding:"0", display:"inline-block"}}>
             <div className='heading1 mb-5' >
                <h1>Add Student</h1>
            </div>
            <form id='myform' onSubmit={this.handleSubmit}>
            <div className='row'>   
              <div className="form-outline mb-4 col-md-6">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" className="form-control" value={name} onChange={(e) => this.setState({ name: e.target.value }) } />
              </div>
              <div className="form-outline mb-4 col-md-6 ">
                <label htmlFor="lastname">Last Name</label>
                <input type="text" id="lastname" name="lastname" className="form-control"  value={lastname} onChange={(e) => this.setState({ lastname: e.target.value }) } />
              </div>
            </div>
            <div className='row'>
              <div className="form-outline mb-4 col-md-6">
                <label htmlFor="fatherName">Father Name</label>
                <input type="text" id="fatherName" name="fatherName" className="form-control"  value={fatherName} onChange={(e) => this.setState({ fatherName: e.target.value }) } />
              </div>
              <div className="form-outline mb-4 col-md-6">
                <label htmlFor="dob">Date of Birth</label>
                <input type="text" id="dob" name="dob" className="form-control"  value={dob} onChange={(e) => this.setState({ dob: e.target.value }) } />
              </div>
            </div>
            <div className='row'>
              <div className="form-outline mb-4 col-md-6">
                <div className='col-md-12 pl-0 pr-0 mb-4'>
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" name="address" className="form-control" value={address} onChange={(e) => this.setState({ address: e.target.value }) } />
                </div>
                <div className='col-md-12 pl-0 pr-0'>
                <div className="form-outline mb-4">
                    <label className='w-100' htmlFor="assign">Assign</label>
                    <FormControl sx={{ m: 1, minWidth: 120 }} className="filter ml-0 mb-3 w-100 select-box">
                      <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          value={classSelect}
                          label="Filter"
                          onChange={(e) => this.setState({ classSelect: e.target.value })}
                          inputProps={{ 'aria-label': 'Without label' }}
                          className="w-100"
                          >
                          
                          {getclasses.map((item)=>{ 
                            return(
                              <MenuItem key={item._id} value={item._id}>{item.className}</MenuItem> 
                          ) })} 
                          
                      </Select>
                    </FormControl>
                    <a  className='float-right pointer blue' onClick={this.handleOpen}>Add new class</a>
                </div>
                </div>
              </div>
              <div className="form-outline mb-4 col-md-6">
                <label htmlFor="emergency">Emergency</label>
                <div className='phoneNo'>
                  <input type="text" id="phonename1" name="phonename1" placeholder='Name' className="form-control mb-3 col-md-4 mr-2" value={phonename1} onChange={(e) => this.setState({ phonename1: e.target.value})} />
                  <input type="tel" id="phone" name="phone" className="form-control mb-3 col-md-8" value={phone} onChange={(e) => this.setState({ phone:e.target.value }) } />
                </div>
                <div className='phoneNo'>
                  <input type="text" id="phonename2" name="phonename1" placeholder='Name' className="form-control mb-3 col-md-4 mr-2" value={phonename2} onChange={(e) => this.setState({ phonename2: e.target.value})} />
                  <input type="tel" id="phone1" name="phone" className="form-control mb-3 col-md-8" value={phone1} onChange={(e) => this.setState({ phone1:e.target.value }) } />
                </div>
                <div className='phoneNo'>  
                  <input type="text" id="phonename3" name="phonename1" placeholder='Name' className="form-control mb-3 col-md-4 mr-2" value={phonename3} onChange={(e) => this.setState({ phonename3: e.target.value})} />
                  <input type="tel" id="phone2" name="phone" className="form-control mb-3 col-md-8" value={phone2} onChange={(e) => this.setState({ phone2:e.target.value }) } />
                </div>  
                {database ? 
                <>
                {database.map((data)=>{
                  return( 
                    <div className='phoneNo'>  
                   <input type="text" className="form-control mb-3 col-md-4 mr-2" value={data.Ename}/>
                  <input type="tel"  className="form-control mb-3 col-md-8" value={data.number} />
                    </div>
                )})}</>
                :""}
                
                
                <a className='float-right pointer blue' onClick={this.handleAddNumber}>Add new</a>

              </div>
            </div>
            
             <div className='row'>
               <div className="form-outline mb-4 col-md-6">
                <label className='w-100'> Photo</label>

								<label htmlFor="photo">
									{photo ? (
										$imagePreview = <img src={photo} alt="dummy" width="80px" height="80px" />
									) : (
										$imagePreview = <div className="previewText1"> <strong>Upload image</strong></div>
									)}
								</label>
								<input
									type="file"
									id="photo"
                  name="photo"
                  className="form-control"
									style={{ display: "none" }}
									onChange={(e) => this._handleImageChange(e)}
								/>
						</div>
            </div>
             <div className='row'>
             <div className="form-outline mb-4 col-md-6 medicalCheckbox">
              
               {/* <Checkbox {...label} className="medicalChe" id="medicalcheck" checked={ this.state.checked }  /> */}
               <input 
                  type="checkbox" 
                  className='checkbox'
                  checked={ this.state.checked } 
                  onChange={ this.handleChange } />

            
              <label htmlFor='medicalCheckbox' className='medicalLabel'> Enter Medical Information</label>
              <div className={content}> 
              <label htmlFor="medical">Medical</label>
                <textarea id="medical" name="medical" rows="4" cols="50" value={medical} onChange={(e) => this.setState({ medical: e.target.value })}></textarea>
              </div>
             </div>
            </div>
            
            <div>
             <a href="/student" className="btn btn-transparent btn-block mb-4" >CANCEL</a>
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
  createClass,getClass,addStudent,
})(AddStudent);