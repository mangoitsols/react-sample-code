import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'
import ImageAvatars from './header';
import Sidebar from './sidebar';
import { FormControl, MenuItem, Select, Container } from "@mui/material";
import { API } from '../config/config';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getClasses } from '../action/functional';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authHeader } from '../comman/authToken';
import Example from '../comman/loader';
import $ from "jquery";
toast.configure();

const EditCounsellor = () => {
    
    const [name,setName]=useState("");
    const [lastname,setLastName]=useState("");
    const [mobile,setMobile]=useState("");
    const [username,setusername]=useState("");
    const [password,setPassword]=useState("");
    const [classSelect,setClassSelect]=useState("");
    const [getclasses,setGetclasses]=useState([]);
    const [getUserDataById,setUserData]=useState([]);
    const [item,setItem]=useState("");
    const [loading,setLoading]=useState(true);
    
    const dispatch = useDispatch();
    //   const dataa = useSelector((state) => state);

    $('input[name="mobile"]').keyup(function(e){
      if (/\D/g.test(this.value))
      {
        // Filter non-digits from input value.
        this.value = this.value.replace(/\D/g, '');
      }
      });
    
    
    useEffect(() => {
        GetClassData();
        GetUserData();
        getUserDataById.map((item)=>{
            return setItem(item);
        })
    }, [])
    
    const GetClassData = async() => {
        const response = await axios
        .get(`${API.getClass}`)
        .catch((err) => {});
        setGetclasses(response.data.data);
        dispatch(getClasses(response));
    };
    
    const {id}=useParams();
    const GetUserData = async() => {
      await axios
        .get(`${API.getUser}/${id}`,{headers:authHeader()}).then((res)=>{
          setLoading(false);
          setName(res.data.data[0].name);
          setLastName(res.data.data[0].lastname);
          setMobile(res.data.data[0].phone);
          setusername(res.data.data[0].username);
          setPassword(res.data.data[0].password);
          setClassSelect(res.data.data[0].classId); 
          console.log(classSelect,"res.data.data[0].classId._id")
        })
        .catch((err) => {});
    };
    
    const handleSubmit = async(e) => {
        e.preventDefault();
            
            const requestData = {
                name: name === "" ? item.name : name,
                phone: mobile === "" ? item.phone : mobile,
                username: username === "" ? item.username : username,
                password: password === "" ? item.password : password,
                classId:classSelect === "" ? item.classId : classSelect,
                lastname:lastname === "" ? item.lastname : lastname,
            };
            const res = await axios({
              method: "put",
              url: `${API.updateUser}/${id}`,
              data: requestData,
              headers: authHeader()
            }).then((res)=>{
              toast.success("Updated Counsellor Added");
                    window.location.replace("/counsellor")  
            }).catch(function (error) {
              if(error.response.status === 400){
                toast.error("Something went wrong");
              }})
           
    }  
    return ( 
        <><Sidebar/>
              <div className='col-md-8 col-lg-9 col-xl-10 mr-30 '>
                 <div className='header'> <ImageAvatars/></div>
                 <Container maxWidth="100%" style={{padding:"0", display:"inline-block"}}>
                  {!loading ?<>
                 <div className='heading1 mb-5'>
                    <h1>Update Counsellor</h1>
                </div>
                <form id='myform' onSubmit={handleSubmit}>
                
              
                        <div className='row'>
                  <div className="form-outline mb-4 col-md-6">
                    <label   htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Please enter your name" className="form-control" value={name}  onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="form-outline mb-4 col-md-6">
                    <label   htmlFor="lastname">Last Name</label>
                    <input type="text" id="lastname" name="lastname" placeholder="Please enter your lastname" className="form-control"  value={lastname} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className='row'>
                <div className="form-outline mb-4 col-md-6">
                  <label   htmlFor="mobile">Mobile No.</label>
                  <input type="tel" id="mobile" name="mobile" className="form-control" placeholder="Please enter your mobile number"  value={mobile} onChange={(e) => setMobile(e.target.value)} />
                </div>
                <div className="form-outline mb-4 col-md-6">
                <label   htmlFor="assign" className='w-100'>Assign</label>
                <FormControl sx={{ m: 0, minWidth: 120 }} className="filterbox w-100">
                                <Select
                                    labelId="demo-simple-select-helper-label"
                                    id="demo-simple-select-helper"
                                    value={classSelect}
                                    label="Filter"
                                    onChange={(e) => setClassSelect(e.target.value)}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                      {   getclasses.map((item)=>{ 
                                          return(
                                              <MenuItem value={item._id}>{item.className}</MenuItem> 
    
                                     ) })} 
                                    
                                </Select>
                            </FormControl>
                </div>
                </div>
                <div className='row'> <div className="form-outline mb-4 col-md-6">
                  <label   htmlFor="username">User Name</label>
                  <input type="text" id="username" name="username" className="form-control" placeholder="Please enter your username" value={username} onChange={(e) => setusername(e.target.value)} />
                </div>
                <div className="form-outline mb-4 col-md-6">
                <label   htmlFor="password">Password</label>
                  <input type="password" id="password" name="password" className="form-control" placeholder="Please enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>   
                </div> 
                <a href='/counsellor' className="btn btn-transparent btn-block mb-4" >CANCEL</a>          
                <input type="submit" className="btn btn-primary btn-block mb-4" value="UPDATE" />
             
              
              </form>
              </>: <Example/> }
              </Container>           
            </div>
            </>
      );
}
 
export default EditCounsellor;

