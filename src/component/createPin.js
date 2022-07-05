import React, { Component } from 'react';
import ImageAvatars from './header';
import Sidebar from './sidebar';
import { Container } from "@mui/material";
import { createPin} from "../action/auth";
import { connect } from "react-redux";
import $ from "jquery";
import validate from "jquery-validation";
import PinInput from 'react-pin-input';
import { toast } from "react-toastify";
import pin from '../images/pin.svg';
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class CreatePin extends Component {
    state = {
      pint:"",
      pintt:""
       } 
      
      handleSubmit = (e) => {
      e.preventDefault();
      const {pint,pintt} = this.state;
      if(pint === "" || pintt === ""){
        toast.error("Pin can't be null");
    }
    else if(pint === pintt){ 
      const requestData = {
        pin:(pint+pintt),
      }
      this.props.createPin(requestData,(res)=>{
        if(res.status === 200){
          toast.success("Pin insert successfully");
        }
      })
    }
    else if(pint !== pintt){
      toast.error("Both pin must be same");
    }
  }

  render() { 
    
    return (<>
          <Sidebar/>
          <div className='col-md-8 col-lg-9 col-xl-10 mr-30 '>
          
             <div className='header'> <ImageAvatars/></div>
          
             <Container maxWidth="100%" style={{padding:"0", display:"inline-block"}}>
             <div className='heading1'>
                <h1>
                <span className='counsellor-logo'> <img src={pin} className="" alt="logo" /></span>Manage Pin</h1>
            </div>
            <form id='myform' onSubmit={this.handleSubmit}>
            <div className='pinbox mt-4'>
              <div className="form-outline mb-4" name="rrr">
                <label for="createPin">Create a safe pin</label>
                <div className='createPin'>
                  <div>
                  <PinInput 
                      length={4} 
                      initialValue="0000"
                      // secret 
                      // onChange={ (value, index) => {this.setState({ pint: value })}} 
                      type="numeric" 
                      inputMode="number"
                      style={{padding: '10px'}}  
                      // inputStyle={{borderColor: 'red'}}
                      // inputFocusStyle={{borderColor: 'blue'}}
                      onComplete={(value, index) => {this.setState({ pintt: value })}}
                      autoSelect={true}
                      regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    />
                  </div>
                </div>  
              </div>
              <div className="form-outline mb-4">
                <label for="confirmPin">Confirm Pin</label>
                <div className='confirmPin'>
                  <div>
                  <PinInput 
                      length={4} 
                      initialValue="0000"
                      // secret 
                      // onChange={ (value, index) => {this.setState({ pint: value })}} 
                      type="numeric" 
                      inputMode="number"
                      style={{padding: '10px'}}  
                      // inputStyle={{borderColor: 'red'}}
                      // inputFocusStyle={{borderColor: 'blue'}}
                      onComplete={(value, index) => {this.setState({ pint: value })}}
                      autoSelect={true}
                      regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    />
                  </div>  
                </div>  
              </div>
            
              <div className='text-right pinSave'>
                <input type="submit" className="btn btn-primary btn-block mb-4 mr-0"  value="SAVE" />
                
              </div>
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
    createPin
})(CreatePin);