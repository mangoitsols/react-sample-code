import React, { useState, useEffect } from 'react';
import ImageAvatars from './header';
import Sidebar from './sidebar';
import { Fade, Modal, Backdrop, Box, FormControl, MenuItem, Select, Container, Checkbox, TextField, Avatar } from "@mui/material";
import $ from "jquery";
import validate from "jquery-validation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import InputField from '../comman/inputField';
import { API, BASE_URL } from '../config/config';
import Example from '../comman/loader';
import axios from 'axios';
import { authHeader } from '../comman/authToken';

toast.configure();

const EditStudent = () => {
    const [openmodel, setOpenmodel] = useState(false);
    const [openmodelNumber, setOpenModelNumber] = useState(false);
    const [classSelect, setClassSelect] = useState('');
    const [getclasses, setGetClasses] = useState([]);
    const [photo, setPhoto] = useState('');
    const [image, setImage] = useState('');
    const [phonename1, setPhoneName1] = useState('');
    const [medical, setMedical] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState();
    const [lastname, setLastName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [dob, setDob] = useState('');
    const [database, setDatabase] = useState([]);
    const [nameC, setNameC] = useState('');
    const [file, setFile] = useState('');
    const [emergency, setEmergency] = useState([]);
    const [addName, setAddName] = useState('');
    const [addNumber, setAddNumber] = useState('');
    const [checked, setChecked] = useState(false);
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(true);

    $('input[name="mobile"]').keyup(function(e){
        if (/\D/g.test(this.value))
        {
          // Filter non-digits from input value.
          this.value = this.value.replace(/\D/g, '');
        }
        });

    const { id } = useParams();

    const dd = useSelector((state) => state);

    useEffect(() => {
        getClassData();
        getStudentDataById();
        item.map((res)=>{
        })
       
    },[])


    let $imagePreview = null;

    const content = (checked === true) ? "display form-outline mb-4 col-md-12 medicaltextarea" : "no-display form-outline mb-4 col-md-12 medicaltextarea";

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const _handleImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFile(file);
            setPhoto(reader.result);
        }
        reader.readAsDataURL(file)

    }

    const getStudentDataById = async() => {
        const response = await axios
        .get(`${API.getStudent}/${id}`, { headers: authHeader() })
        .catch((err) => {});
        if(response.status === 200){
          setLoading(false);
          setItem(response.data);
          console.log(response.data,"qqqqqqqqqqqqqq")
          setName(response.data[0].name);
          setLastName(response.data[0].lastName);
          setFatherName(response.data[0].fatherName);
          setDob(response.data[0].DOB);
          setAddress(response.data[0].address);
          setImage(response.data[0].image);
          setClassSelect(response.data[0].assignClass);;
          setMedical(response.data[0].medical);
          setEmergency(response.data[0].emergency)
        }else{
            setLoading(true);
        }        
    }

    const handleAddNewNumber = (e) => {
        e.preventDefault()
       
            emergency.push({
                Ename: addName,
                number: addNumber,
            });
            setDatabase(emergency)
            if (emergency.length !== 0) {
                setOpenModelNumber(false);
                toast.success("Number added successfully");
            } else {
                toast.error("Number added failed");
            }
    }

    const handleCreateClass = async(e) => {
        e.preventDefault()

        if (!nameC.startsWith("class")) {
            toast.error("classname must start with class ex: 'class A'");
        }
        else {
            const requestData = {
                className: nameC
            };
            const res = await axios
            .post(`${API.createClass}`,requestData)
            .catch((err) => {});
            if (res.status === 200) {
                    toast.success(res.data.message);
                setOpenmodel(false)
                setClassSelect(res)
            } else if (res.status === 400) {
                    toast.error(res.data.message);
                }  
        }
    }

    const handleClose = () => { setOpenmodel(false) };
    const handleOpen = () => setOpenmodel(true);
    const handleAddNumber = () => setOpenModelNumber(true);
    const handleCloseNumber = () => setOpenModelNumber(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        item[0].emergency.map((res)=>{
            return(
                emergency.push({Ename:res.Ename,number:res.number})
            )
        })
        if (file.size >= 6000) {
            toast.error("Profile size should be less than 6kb");
        }
        else {
            const requestData = {
                name:  name === "" ? item[0].name : name,
                lastName: lastname === "" ? item[0].lastName : lastname,
                fatherName: fatherName === "" ? item[0].fatherName : fatherName,
                DOB: dob === "" ? item[0].DOB : dob,
                address: address === "" ? item[0].address : address,
                image: file === "" ? item[0].image : file,
                assignClass: classSelect === "" ? item[0].assignClass : classSelect,
                medical: medical === "" ? item[0].medical : medical,
                emergency: JSON.stringify(emergency),
            };
            for (var key in requestData) {
                formData.append(key, requestData[key]);
            }
            
            const request =await axios({
                method: "put",
                url: `${API.studentUpdate}/${id}`,
                data: formData,
                headers: authHeader(),
              })
            .catch((err) => {});
                if (request.status === 200) {
                    toast.success("Updated Counsellor Added");
                    window.location.replace("/student")
                } else{
                    toast.error("Something Went Wrong");
                }
        }

     
    }

    const getClassData = () => {
        fetch(`${API.getClass}`)
            .then((res) => res.json())
            .then((ress) => {
                setGetClasses(ress.data)
            })
    }

    const handleChange = (event) => {
        let checkedbox = event.target.checked
        setChecked(checkedbox)
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        borderRadius: "15px",
        p: 4,
    };



    return (<>
    {!loading ? <>
        <Sidebar />
        <div className='col-md-8 col-lg-9 col-xl-10 mr-30 '>
            <div className='header'> <ImageAvatars /></div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openmodel}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openmodel}>
                    <Box sx={style}>
                        <form className="mui-form" onSubmit={handleCreateClass}>
                            <legend >Add Class</legend>
                            <div className="mui-textfield">
                                <input type="text" placeholder='class E' value={nameC} onChange={(e) => setNameC(e.target.value)} />
                            </div>
                            <div className="btndesign text-right">
                                <button
                                    type="button"
                                    className="btn btn-transparent"
                                    onClick={handleClose}
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
                onClose={handleCloseNumber}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openmodelNumber}>
                    <Box sx={style}>
                        <form className="mui-form" onSubmit={handleAddNewNumber}>
                            <legend >Add Number</legend>
                            <div className="mui-textfield">
                                <input type="text" placeholder='Please enter your number' onChange={(e) => setAddName(e.target.value)} />
                                <input type="tel" placeholder='Please enter your number' name='mobile' onChange={(e) => setAddNumber(e.target.value)} />
                            </div>
                            <div className="btndesign text-right">
                                <button
                                    type="button"
                                    className="btn btn-transparent"
                                    onClick={handleCloseNumber}
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
            <Container maxWidth="100%" style={{ padding: "0", display: "inline-block" }}>
                <div className='heading1 mb-5' >
                    <h1>Edit Student</h1>
                </div>
                <form id='myform' onSubmit={handleSubmit}>
                    {item.map((val)=>{
                        return(<React.Fragment key={val._id}>
                        
                    <div className='row'>
                        <div className="form-outline mb-4 col-md-6">
                            <InputField label="Name" placeholder="PLease enter your name" value={name} htmlFor="name" id="name" name="name" className="form-control" onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="form-outline mb-4 col-md-6 ">
                            <InputField label="Last Name" id="lastname" htmlFor="lastname" name="lastname" className="form-control" placeholder="Please enter your lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className="form-outline mb-4 col-md-6">
                            <InputField htmlFor="fatherName" label="Father Name" id="fatherName" name="fatherName" className="form-control" placeholder="Please enter your fathername" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
                        </div>
                        <div className="form-outline mb-4 col-md-6">
                            <InputField id="dob" htmlFor="dob" label="Date of Birth" name="dob" className="form-control" placeholder="Please enter your Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className="form-outline mb-4 col-md-6">
                            <div className='col-md-12 pl-0 pr-0 mb-4'>
                                <InputField htmlFor="address" label="Address" id="address" name="address" className="form-control" placeholder="Please enter your address" value={address} onChange={(e) => setAddress(e.target.value)} />
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
                                            onChange={(e) => setClassSelect(e.target.value)}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            className="w-100"
                                        >

                                            {getclasses.map((item) => {
                                                return (
                                                    <MenuItem key={item._id} value={item._id}>{item.className}</MenuItem>
                                                )
                                            })}

                                        </Select>
                                    </FormControl>
                                    <a className='float-right pointer blue' onClick={handleOpen}>Add new class</a>
                                </div>
                            </div>
                        </div>
                        <div className="form-outline mb-4 col-md-6">
                            <label htmlFor="emergency">Emergency</label>
                             {emergency.map((i)=>{
                              
                                return(<>
                                    <div className='phoneNo' key={i._id}>
                                        <InputField id="phonename1" name="phonename1" disabled={true}  className="form-control mb-3 col-md-4 mr-2 " value={i.Ename} />
                                        <InputField type="tel" id="phone" name="phone"  disabled={true}  className="form-control mb-3 col-md-8" value={i.number}  />   
                                       
                                    </div>
                                    </>)
                            })}

                            {database ?
                                <>
                                    {database.map((data) => {
                                        return (
                                            <>  
                                            <div key={data._id}>
                                                <p>{data.Ename}</p>
                                                <p>{data.number}</p>
                                            </div>
                                            </>
                                        )
                                    })}</>
                                : ""}


                            <a className='float-right pointer blue' onClick={handleAddNumber}>Add new</a>

                        </div>
                    </div>


                    <div className="form-outline mb-4 col-md-6">
                        {photo ? "" : <label className='w-100'> Photo</label>}
                        <label htmlFor="photo">
                            {photo ? (
                                $imagePreview =<img alt="Remy Sharp" src={photo} style={{ width: "100px", height: "100px" }} />
                            ) : (
                            image.match("uploads/") ?$imagePreview = <div className="previewText"><img src={`${BASE_URL}/${image}`} alt="dummy" width="80px" height="80px" /></div>:
                             $imagePreview = <div className="previewText"><img src={`${image}`} alt="dummy" width="80px" height="80px" /></div>
                            )}
                        </label>
                        <InputField
                            type="file"
                            id="photo"
                            name="photo"
                            className="form-control"
                            style={{ display: "none" }}
                            onChange={(e) => _handleImageChange(e)}
                        />
                    </div>

                    <div className='row'>
                        <div className="form-outline mb-4 col-md-6 medicalCheckbox">

                            <Checkbox className="checkbox" id="medicalcheck" onChange={handleChange} checked={checked} />

                            <label htmlFor='medicalCheckbox' className='medicalLabel'> Enter Medical Information</label>
                            <div className={content}>
                                <label htmlFor="medical">Medical</label>
                                <textarea id="medical" name="medical" rows="4" cols="50" value={medical} placeholder={val.medical} onChange={(e) => setMedical(e.target.value)}></textarea>
                            </div>
                        </div>
                    </div>

                    <div>
                        <a href="/student" className="btn btn-transparent btn-block mb-4" >CANCEL</a>
                        <InputField type="submit" className="btn btn-primary btn-block mb-4" value="SAVE" />

                    </div>
                    </React.Fragment>
                )
            })}
                </form>
            </Container>
        </div>
       </>  :<Example/> }
    </>
    );
}

export default EditStudent;











