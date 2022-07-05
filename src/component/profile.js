import React, { Component } from 'react';
import ImageAvatars from './header';
import Sidebar from './sidebar';
import EditableLabel from 'react-inline-editing';
import { connect } from "react-redux";
import { getAllCountry, getStateBYCountryId, updateUser,getUser } from "../action/index";
import { FormControl, MenuItem, Select, Container, Avatar, Stack } from "@mui/material";
import $ from "jquery";
import validate from "jquery-validation";
import { BASE_URL } from '../config/config';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "font-awesome/css/font-awesome.css";
import Example from '../comman/loader';
import { Link } from 'react-router-dom';
toast.configure();

class Profile extends Component {
	constructor(props) {
		super(props);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleFocusOut = this.handleFocusOut.bind(this);
	}
	
	state = {
		role:"manager",
		streetAddress: "",
		city: "",
		state: "",
		country: "",
		email: "",
		phone: "",
		getCountry: [],
		stateByCountry: [],
		managerPass: "123456789",
		name: "",
		file: "",
		image:"",
		imagePreviewUrl: "",
		getUserDetail:[],
		userDetail:"",
		loading:true,
	}

	componentDidMount() {
				
		this.props.getAllCountry((res) => {
			if(res.status===200){
			this.setState({loading:false})
			this.setState({ getCountry: res.data.country })}
		})
		
		this.getDetailUser();
		

		$(document).ready(function () {
			$("#myform").validate({
				rules: {
					streetAddress: {
						required: true,
					},
					city: {
						required: true,
					},
					state: {
						required: true,
					},
					country: {
						required: true,
					},
					email: {
						required: true,
						email: true,
					},
					phone: {
						required: true,
					},
				},
				messages: {
					phone: {
						required: "<p style='color:red'>Please provide a phone</p>",
					},
					country: {
						required: "<p style='color:red'>Please provide a country</p>",
					},
					state: {
						required: "<p style='color:red'>Please provide a state</p>",
					},
					city: {
						required: "<p style='color:red'>Please provide a city</p>",
					},
					streetAddress: {
						required: "<p style='color:red'>Please provide a streetAddress</p>",
					},
					email: {
						required: "<p style='color:red'>Please provide a email</p>",
						email:
							"<p style='color:red'>Please enter a valid email address.</p>",
					},
				},
			});
		});
	}

	
	handleSubmit = (e) => {
		e.preventDefault();
		const {role, name, city, state, country, phone, email, streetAddress, image, file } = this.state;
		const formData = new FormData();
	
		if(file.size >= 6000) {
			toast.error("Profile size should be less than 6kb");
		}
		else{		
			const id = localStorage.getItem("id")
			const requestData = {
				role: role,
				street_Address: (streetAddress),
				phone: (phone),
				country: (country),
				city: (city),
				state: (state),
				email: (email),
				name: (name),
				image:(file === "" ? image : file),
			}
			
			for (var key in requestData) {
				formData.append(key, requestData[key]);
			}
				this.props.updateUser(id,formData,(res) => {

				if (res.status === 200) {
					toast.success(res.data.message);
					this.getDetailUser();
					window.location.reload();
				} else if (res.status === 400 ) {
						toast.error(res.data.message);
					}
				});
		
	}
	}
	
	handleCountry = (e) => {
		this.setState({ country: e.target.value });
		const id = e.target.value;
		this.props.getStateBYCountryId(id, (res) => {
			this.setState({ stateByCountry: res.data })
		})
	}

	handleState = (id) =>{
		this.props.getStateBYCountryId(id, (res) => {
			this.setState({ stateByCountry: res.data })
		})
		
	}

	handleFocus(text) {
	}

	handleFocusOut(text) {
		this.setState({ name: text })
	}

	_handleImageChange(e) {
		e.preventDefault();
		
		let reader = new FileReader();
		let file = e.target.files[0];
		
		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewUrl: reader.result
			});
		}
		reader.readAsDataURL(file)
		
	}

	getDetailUser(){

		const id = localStorage.getItem("id")
			
			this.props.getUser(id,(res)=>{
				if(res.status===200){
				this.setState({loading:false})	
				this.setState({streetAddress:res.data.data[0].street_Address})
				this.setState({city:res.data.data[0].city})
				this.setState({phone:res.data.data[0].phone})
				this.setState({email:res.data.data[0].email})
				this.setState({name:res.data.data[0].name})
				this.setState({image:res.data.data[0].image})
				this.setState({state:res.data.data[0].state})
				this.setState({country:res.data.data[0].country})
				}
				this.handleState(res.data.data[0].country);
			})
	}



	render() {
		const { getCountry, stateByCountry, imagePreviewUrl,country,state,loading,image,name,streetAddress,city,email,phone} = this.state;
		let $imagePreview = null;
			return (<>		
				<Sidebar />
			<div className='col-md-8 col-lg-9 col-xl-10 mr-30'>
				<div className='header'> <ImageAvatars /></div>
				<Container maxWidth="100%" style={{ padding: "0", display: "inline-block" }}>
				{!loading ? <React.Fragment> 
					<form id='myform' onSubmit={this.handleSubmit}>
						<Stack direction="row" spacing={2} className="profileAvtar">
							
					
							<div>
								<label htmlFor="upload-button">
									{imagePreviewUrl ? (
										$imagePreview = <Avatar alt="Remy Sharp" src={imagePreviewUrl} sx={{ width: 56, height: 56 }} /> 
									) : (
										$imagePreview = <div className="previewText"> <Avatar alt="Remy Sharp" src={`${BASE_URL}/${image}`} sx={{ width: 56, height: 56 }} /> <i className="fa fa-camera" style={{ "fontSize": "35px" }}></i></div>
									)}
								</label>
								<input
									type="file"
									id="upload-button"
									style={{ display: "none" }}
									onChange={(e) => this._handleImageChange(e)}
								/>
							</div>
							<span >
								<span className='editable'><EditableLabel text={name}
									labelClassName='myLabelClass'
									inputClassName='myInputClass'
									inputWidth='200px'
									inputHeight='25px'
									labelFontSize='21px'
									onFocus={this.handleFocus}
									onFocusOut={this.handleFocusOut}
									inputMaxLength={50}
									
									/> </span> <br />
								<small> Manager </small>
							</span>
						</Stack>
						<div className='profileBox'>
							<h5>My Address</h5>
							<div className='row'>
								<div className="form-outline mb-4 col-md-6">
									<label htmlFor="streetAddress">Street Address</label>
									<input type="text" id="streetAddress" name="streetAddress" className="form-control" placeholder="Please enter your Street Address" value={streetAddress } onChange={(e) => this.setState({ streetAddress: e.target.value })} />
								</div>
								<div className="form-outline mb-4 col-md-6">
									<label htmlFor="state" className='w-100'>State</label>
									<FormControl sx={{ m: 1, minWidth: 120 }} className="filter ml-0 w-100 state ">
										<Select
											labelId="demo-simple-select-helper-label"
											id="demo-simple-select-helper"
											value={state}
											label="state"
											onChange={(e) => this.setState({ state: e.target.value })}
											inputProps={{ 'aria-label': 'Without label' }}
										>
											{stateByCountry.map((item) => {
												return (
													<MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
												)
											})}

										</Select>
									</FormControl>
								</div>
								<div className="form-outline mb-4 col-md-6">
									<label htmlFor="city">City</label>
									<input type="text" id="city" name="city" className="form-control" placeholder='Please enter your city'  value={city} onChange={(e) => this.setState({ city: e.target.value })} />
								</div>
								<div className="form-outline mb-4 col-md-6">
									<label htmlFor="country" className='w-100'>Country</label>
									<FormControl sx={{ m: 0, minWidth: 120 }} className="filter ml-0 w-100 country">
										<Select
											labelId="demo-simple-select-helper-label"
											id="demo-simple-select-helper"
											value={country}
											label="country"
											onChange={this.handleCountry}
											inputProps={{ 'aria-label': 'Without label' }}
										>
											
											{getCountry.map((item) => {
												return (
													<MenuItem key={item._id} value={item._id} >{item.name}</MenuItem>
												)
											})}

										</Select>
									</FormControl>
								</div>
							</div>
							<h5 className='contactDetail'>Contact Detail</h5>
							<div className='row'>
								<div className="form-outline mb-4 col-md-6">
									<label htmlFor="email">Email</label>
									<input type="email" id="email" name="email" className="form-control" placeholder="Please enter your email" value={email} onChange={(e) => this.setState({ email: e.target.value })} />
								</div>

								<div className="form-outline mb-4 col-md-6">
									<label htmlFor="couphonentry">Mobile Number</label>
									<input type="text" id="phone" name="phone" className="form-control" placeholder={"Please enter your mobile number"} value={phone} onChange={(e) => this.setState({ phone: e.target.value })} />
								</div></div>
							<div className='profileBtn'>
								<Link to="/dashboard" className="btn btn-transparent btn-block mb-4 "  >CANCEL</Link>
								<input type="submit" className="btn btn-primary btn-block mb-4 " value="SAVE" />

							</div>
						</div>
					</form>
				</React.Fragment>:<Example/> }
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
	getAllCountry, getStateBYCountryId, updateUser,getUser
})(Profile);

