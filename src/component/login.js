import React, { Component } from 'react';
import logo from '../images/aelix-logo.svg';
import $ from "jquery";
import validate from "jquery-validation";
import { connect } from "react-redux";
import { login } from "../action/auth";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './css/login.css';
import Example1 from '../comman/loader1';

toast.configure();

<head>
  <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.min.js"></script>
 
  
</head>;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));
class Login extends Component {
	state = { 
		email: "",
		password: "",
    loading:false,
     } 

    componentDidMount() {
        $(document).ready(function () {
          $("#myform").validate({
            rules: {
              password: {
                required: true,
              },
            },
            messages: {
              password: {
                required: "<p style='color:red'>Please provide a password</p>",
                minlength:
                  "<p style='color:red'>Your password must be at least 5 characters long</p>",
              },
            },
          });
        });
      }
     
    he = ()=> {
      {localStorage.getItem("token") != null ? (
        <div className='welcome'>
        <div className='welcome-center'>
          <img src={require("./images/welcome-icon.png")} />
          <h2>Welcome {localStorage.getItem("lastname")}</h2>
        </div>
       </div>
      ) : (
        <div className='welcome' style={{display:"none"}}>
      <div className='welcome-center'>
        <img src={require("./images/welcome-icon.png")} />
        <h2>Welcome {localStorage.getItem("lastname")}</h2>
      </div>
     </div>
      )}
    }  
	  handleSubmit = (e) => {
		  e.preventDefault();
      this.setState({loading:true})
        const {email,password} = this.state;
        let ex = email.includes("@") && email.includes(".") ? true :false; 
        
        if ((email == "", password == "")) {
          toast.error("Email & Password is required");
        } else {
          if(ex === true){
          const requestData = {
            password: password,
            email:email,
          };
          this.props.login(requestData,(res) => {
           
            if (res.status === 200) {
              localStorage.setItem("token", JSON.stringify(res.data.token));
               localStorage.setItem("name", res.data.name);
               localStorage.setItem("role", res.data.role);
               localStorage.setItem("id", res.data._id);
               this.he()
              
              setTimeout(() => {
                window.location = "/welcome";
                }, 500);
            } 
          })
        }
        else{
          const requestData = {
            password: password,
            username:email,
          };

         this.props.login(requestData,(res) => {
            
            console.log(res,"Rrrrrrrrrrrrrrrrrrrrr")
            if (res.status === 200) {
              this.setState({loading:false})
              localStorage.setItem("token", JSON.stringify(res.data.token));
               localStorage.setItem("name", res.data.name);
               localStorage.setItem("lastname", res.data.lastname);
               localStorage.setItem("role", res.data.role);
               localStorage.setItem("id", res.data._id);
               this.he()
              toast.success( "Success Login");

              setTimeout(() => {
                
                window.location = "/welcome";
                }, 500);
            } 
          })
        }
        }
    }
  
    render() { 
     
        return (
           <React.Fragment>
             
            <div className='loginBox'>  
              <div className='loginLeft col-md-6 col-lg-7 '>
                <div className='banner-bg'>
                  <div className='bg-circle orange1'></div> 
                  <div className='bg-circle orange2'></div>
                  <div className='bg-circle blue1'></div>
                  <div className='bg-circle blue2'></div>
                  <div className='bg-circle blue2'></div>
                </div>
                <div id="demo" className="carousel slide" data-ride="carousel" style={{width:"100%"}}>
                
                      <ul className="carousel-indicators">
                        <li data-target="#demo" data-slide-to="0" className="active"></li>
                        <li data-target="#demo" data-slide-to="1"></li>
                        <li data-target="#demo" data-slide-to="2"></li>
                      </ul>

                      <div className="carousel-inner">
                        <div className="carousel-item active">
                          <h2>Lorem Ipsum is simply dummy text of <br/> the printing and typesetting industry.<br/> Lorem Ipsum </h2>
                          <img src={require("../images/banner.png")}/>
                        </div>
                        <div className="carousel-item">
                        <h2>Lorem Ipsum is simply dummy text of <br/> the printing and typesetting industry.<br/> Lorem Ipsum </h2>
                          <img src={require("../images/banner.png")}/>
                        </div>
                        <div className="carousel-item">
                        <h2>Lorem Ipsum is simply dummy text of <br/> the printing and typesetting industry.<br/> Lorem Ipsum </h2>
                          <img src={require("../images/banner.png")}/>
                        </div>
                      </div>
                  </div>
              </div>                          
              <div className='formRight col-md-6 col-lg-5'>

                 <div className='logo'>
                      <img src={logo} className="" alt="logo" />
                 </div>
                <form id='myform' onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>Manager or Counsellor Login</legend>
                    <div className="form-outline mb-4">
                      <TextField  label="Username"  type="text" id="email outlined-basic" name="email" className="form-control" variant="outlined" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value }) } />
                    </div>
                    <div className="form-outline mb-2">
                      <TextField label="Password"  type="password" id="password outlined-basic" name="password" className="form-control" variant="outlined" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value }) } />
                    </div>
                    <div className="row mb-4">
                      <div className="col d-flex justify-content-left">
                        <div className="checkBoxOut">
                        <Checkbox disabled  className="form-check-input" type="checkbox" value="" id="form2Example31"  />
                          <label className="form-check-label" htmlFor="form2Example31"> Remember Me </label>
                        </div>
                      </div>
                      <div className="col d-flex justify-content-end text-right forgotpPassword">
                        <a href="/forgotpassword">Forgot password?</a>
                      </div>
                    </div>
                   {!this.state.loading ? <input type="submit" value="Login" className="btn btn-primary mb-1 mt-5 w-100 button-login " /> : <div className='loader'><Example1/></div>}
                </fieldset>   
              </form>
              </div>
            </div>
            </React.Fragment>
        );
      } 
}

const mapStateToProps = (state) => {
	return {};
};

export default connect(mapStateToProps, {
	login
})(Login);
