import React, { useEffect,useState } from 'react';
import ImageAvatars from './header';
import {Container,Box,Select,Backdrop,MenuItem,FormControl,styled,Paper,Grid,Avatar,Stack,Typography,Button,Fade,Modal, NativeSelect} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Sidebar from './sidebar';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { API, BASE_URL } from '../config/config';
import { Filter } from '@material-ui/icons';
import moment from 'moment'; 
import attendance1 from './images/attendance.svg';
import { Link } from 'react-router-dom';
import { authHeader } from '../comman/authToken';
toast.configure();


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const DashBoard1 = () => {

  const [classData,setClassData]=useState([]);
  const [rows, setStudentDetail] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filterr, setFilter] = React.useState([]);
  const [classNameOnChange, setclassNameOnChange] = React.useState('');
  const [classNameIdOnChange, setclassNameIdOnChange] = React.useState('');
  

        React.useEffect(()=>{
            GetStudentData();
            GetClassData();
           
          }, [])

        const GetStudentData = async() => {
            const response = await axios
            .get(`${API.getStudent}`, { headers: authHeader() })
            .catch((err) => {});
            if(response.status === 200){
              setLoading(false);
            }else{
              setLoading(true);
            }
            setStudentDetail(response.data);
            setFilter(response.data.data);
        };

        const GetClassData = async() => {
            const response = await axios
            .get(`${API.getClass}`)
            .catch((err) => {});
            if(response.status === 200){
              setLoading(false);
            }else{
              setLoading(true);
            }
            setClassData(response.data.data);
        };

        const SelectOnChange = (ele) =>{

            const classNameGet = classData.find((item)=> {return item && item._id === ele ? item.className : "" });
            setclassNameOnChange(classNameGet && classNameGet.className)
            setclassNameIdOnChange(ele);
        
            if(ele === "all"){
                setFilter(rows.data);
               }
            else if(ele === ele){
                const data =  rows.data.filter((item) => {
                    return item.assignClass? item.assignClass._id === ele : ""
                  })
                  if(data.length > 0){
                    setFilter(data);
                  }                                                                        
                  else{
                    setFilter([]);
                  }

            }
        }

      
        
        const filterDataAbs = filterr.length === 0 ? [] : filterr.filter((vall)=> ( vall && vall.attaindence && vall.attaindence === null ? [] : vall.attaindence && vall.attaindence.attendence.includes("0")));
        const filterDataPre = filterr.length === 0 ? [] : filterr.filter((vall)=> ( vall && vall.attaindence && vall.attaindence === null ? [] : vall.attaindence && vall.attaindence.attendence.includes("1")));
        const filteroutofClass = filterr.length === 0 ? [] : filterr.filter((vall)=> (vall && vall.attaindence && vall.attaindence === null ? [] : vall.attaindence && vall.attaindence.out_of_class)); 
        

    return ( <React.Fragment>
                    <Sidebar/>
                    <div className='col-md-8 col-lg-9 col-xl-10 mr-30'>
                 <div className='header'> <ImageAvatars/></div>
                 
                 <Container maxWidth="100%" style={{padding:"0", display:"inline-block"}}>
            
                        <div className='heading'>
                            <h1>
                               <span className='icon'><DashboardIcon  fontSize='35px'/></span>
                               Class Dashboard
                            </h1>
                            <div >
                                <label>Filter By:</label>
                                <FormControl sx={{ m: 1, minWidth: 120 }} className="filter">
                                 <NativeSelect
                                    defaultValue="all"
                                    onChange={(e) => SelectOnChange(e.target.value)}
                                    inputProps={{
                                        name: 'age',
                                        id: 'uncontrolled-native',
                                    }}
                                    className="w-100"
                                    >
                                    <option value="all">All</option>
                                    {classData.map((item)=>{
                                        return(
                                    <option key={item._id} value={item._id}>{item.className}</option>
                                    )})}  
                                    
                                </NativeSelect>   
                                
                            </FormControl>
                            </div>
                        </div>
                       
                        <div className='filter-text'>{classNameOnChange === "all" ? "" : classNameOnChange}
                        {classNameOnChange ? <span>
                       <div className='filter-text'>{classNameOnChange === "all" ? "" : <Link to={`/attendance/${classNameIdOnChange}`}>  <img src={attendance1} className="" alt="logo" />Attendance Report</Link>}</div> 
                        </span>:""}
                        </div> 
                        
                        <Box sx={{ flexGrow: 1 }} className="dashboard-grid">
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Item className='dashboaed-text'>
                                        <div> <h2>Total Students</h2>
                                        <span className='count'>{filterr.length === 0 ? 0 : classNameOnChange === "all" ? rows.totalcount : filterr.length}</span>
                                        </div>
                                    </Item>
                                </Grid>
                                <Grid item xs={3}>
                                    <Item className='dashboaed-text'>
                                    <div> <h2>Present Students</h2>
                                        <span className='count'>{filterDataPre.length === 0 ? 0 : classNameOnChange === "all" ? rows.totalpresent : filterDataPre.length}</span>
                                    </div>
                                    </Item>
                                </Grid>
                                <Grid item xs={3}>
                                    <Item className='dashboaed-text'>
                                    <div> <h2>Absent Students</h2>
                                        <span className='count'>{filterDataAbs.length === 0 ? 0 : classNameOnChange === "all" ? rows.totalabsent : filterDataAbs.length}</span>
                                        </div>
                                    </Item>
                                </Grid>
                                <Grid item xs={3}>
                                    <Item className='dashboaed-text'>
                                    <div> <h2>Out of Class</h2>
                                        <span className='count'>{filteroutofClass.length === 0 ? 0 : classNameOnChange === "all" ? rows.totalout : filteroutofClass.length}</span>
                                        </div>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Box>
    
    
                        <Box sx={{ flexGrow: 1 }} className="dashboard-bottom-grid">
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Item className='dashboaed-text'>
                                        <h2>Absent</h2>
                                        
                                    {filterDataAbs.length === 0 ? <p>No records found</p> :
                                        filterDataAbs.length && filterDataAbs.map((item)=>{
                                             return(
                                            <Stack direction="row" spacing={2} key={item._id}>
                                            <Avatar alt="Remy Sharp" src={`${BASE_URL}/${item.image}`} />
                                            <div className='profile-timer'>
                                                <span>
                                                    <strong>{item.name}</strong>
                                                    <small>{item.assignClass.className}</small>
                                                </span> 
                                            </div>   
                                            </Stack>                                         
                                         )})}
                                    </Item>
                                </Grid>
                                <Grid item xs={6}>
                                    <Item className='dashboaed-text'>
                                    <h2>Students Out of Class</h2>
                                    {filteroutofClass.length === 0 ? <p>No records found</p> :
                                    filteroutofClass.length && filteroutofClass.map((item)=>{
                                        const inTime = moment(item.attaindence.inclassDateTime).format("DD/MM/YYYY HH:mm:ss");
                                        const outTime = moment(item.attaindence.outclassDateTime).format("DD/MM/YYYY HH:mm:ss")
                                        const timee = moment.utc(moment(inTime,"DD/MM/YYYY HH:mm:ss").diff(moment(outTime,"DD/MM/YYYY HH:mm:ss"))).format("mm:ss");
                                        return(
                                    <Stack direction="row" spacing={2} key={item._id}>
                                        <Avatar alt="Remy Sharp" src={`${BASE_URL}/${item.image}`} />
                                        <div className='profile-timer'>
                                            <span>
                                                <strong>{item.name}</strong>
                                                <small>{item.attaindence.out_of_class}</small>
                                            </span>
                                            {item && item.attaindence && item.attaindence.out_of_class === "no" ?
                                            <span className='timer'>
                                            {timee}{" "}min
                                            </span>:""}
                                        </div>    
                                    </Stack>

                                        )
                                    })}
                                   
                                    </Item>
                                </Grid>
                               
                            </Grid>
                        </Box>
                      
                 </Container>
                 </div> 
                </React.Fragment>);
}
 
export default DashBoard1;
