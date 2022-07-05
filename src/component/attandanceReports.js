import React, {useState,useEffect} from 'react';
import Sidebar from './sidebar';
import ImageAvatars from './header';
import Container from '@mui/material/Container';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { API } from '../config/config';
import { Link, useParams } from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Example from '../comman/loader';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Pdf from "react-to-pdf";
import { FormControl, NativeSelect } from '@mui/material';
import moment from 'moment';
import { authHeader } from '../comman/authToken';
toast.configure();

const ref = React.createRef();

export default function AttandanceReport(props) {

	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [page, setPage] = useState(0);
	const [dense, setDense] = useState(false);
	const [loading, setLoading] = useState(true);
	const [attandanceData,setattandanceData]=useState([]);
    const [classData,setClassData]=useState([]);
    const [onSelectData,setOnSelectData]= useState('');
    const [weekDate,setWeekDate]= useState([]);
    const [monthDate,setMonthDate]= useState([]);
    const [monthSundays,setMonthSundays]= useState([]);
    const [monthSaturdays,setMonthSaturdays]= useState([]);
    const [monthData,setMonthData]= useState(false);
    const [counsellorName,setCounsellorName]= useState('');
    

	useEffect(() => {
        handleAttandanceReport(id,"week");
        GetClassData();
        currentWeekDates();
        currentMonthDates();
        handleCounsellorNameByClassId(id);
        
	}, [])

    const { id } = useParams();
  
    const currentWeekDates = () =>{
        let curr = new Date(); 
        let week=[];
        
        for (let i = 1; i <= 7; i++) {
          let first = curr.getDate() - curr.getDay() + i 
          let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
          week.push(day);
        }
        setWeekDate(week);
    }

    const currentMonthDates = (year,month) =>{
        const now = new Date();
        const date = new Date(now.getFullYear(), now.getMonth(), 1);
        const dates = [];
       
        while (date.getMonth() === now.getMonth()) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        setMonthDate(dates);
        getAllSat();
    }


    const getAllSat = () =>{
        const now = new Date();
        var days = new Date( now.getFullYear(),now.getMonth(),0 ).getDate();
        var sundays = [ 6 - (new Date( now.getMonth() +'/01/'+ now.getFullYear() ).getDay()) ];
        for ( var i = sundays[0] + 7; i < days; i += 7 ) {
            sundays.push( i);
        }
        setMonthSundays(sundays);

        var saturdays = [ 12 - (new Date( now.getMonth() +'/01/'+ now.getFullYear() ).getDay()) ];
        for ( var i = saturdays[0] + 7; i < days; i += 7 ) {
          saturdays.push( i );
        }
        setMonthSaturdays(saturdays);
      }
    

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

    const handleAttandanceReport = async(idd,byWhich) =>{

        const response = await axios
        .get(`${API.attendanceReport}/${idd}?date=${byWhich}`, { headers: authHeader() })
        .catch((err) => {});
        setLoading(false);
        setattandanceData(response.data.data);
    }

    const SelectOnChange = async(ele) =>{
        setOnSelectData(ele);
        if(ele === ele){
            handleAttandanceReport(ele,"week");
            handleCounsellorNameByClassId(ele);
        }
    }
	
    const handleDataAccWeekAndMonth = async(data) =>{
        if(data === "month"){
            setMonthData(true);
        }
        else{
            setMonthData(false);
        }
        handleAttandanceReport(onSelectData ? onSelectData : id,data);
    }

    const handleCounsellorNameByClassId = async(idd)=>{
        const response = await axios
        .get(`${API.getCounsellorNameByClassId}/${idd}`, { headers: authHeader() })
        .catch((err) => {});
        setCounsellorName(response.data.data[0])
        
    }

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - attandanceData.length) : 0;
const yy = [];
    const classNaam = classData.find((item)=> {return item && item._id === (counsellorName && counsellorName.classId)? item.className : "" })

    const options = {
        orientation: 'portrait',
        unit: 'in',
        format: [16,7]
    };

    return ( 
        <>
			
		<Sidebar />
		<div className='col-md-8 col-lg-9 col-xl-10 mr-30'>
        <Pdf targetRef={ref} filename="attandance.pdf" options={options} x={.5} y={.5} scale={0.8}>
        {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
      </Pdf>
  
			<div className='header'> <ImageAvatars /></div>
		{!loading ? <div > 
			<Container maxWidth="100%" style={{ padding: "0", display: "inline-block" }}>
				<div className='heading'>
					<h1>
						<span className='icon'><DashboardIcon fontSize='35px' /></span>
						Attendance Reports
					</h1>
                    <div >
                        <label>Filter By:</label>
                        <FormControl sx={{ m: 1, minWidth: 120 }} className="filter">
                            <NativeSelect
                            defaultValue={id}
                            onChange={(e) => SelectOnChange(e.target.value)}
                            inputProps={{
                                name: 'age',
                                id: 'uncontrolled-native',
                            }}
                            className="w-100"
                            >
                            {classData.map((item)=>{
                                return(
                            <option key={item._id} value={item._id}>{item.className}</option>
                            )})}  
                        </NativeSelect>   
                    </FormControl>
                    </div>          
				</div>
				<div>
					<div>
                    <span>{classNaam && classNaam.className}</span>{" "}|{" "}
                    <span>{counsellorName ? `${counsellorName.name} ${counsellorName.lastname}` : `No Counsellor assign to this class`}</span>
					</div>
                    <div>
                        <span onClick={() => handleDataAccWeekAndMonth("week")}>Week </span>|<span onClick={() => handleDataAccWeekAndMonth("month")}> Month</span>
                    </div>

				</div>
                {monthData ? <div className='counselloTabel' style={{ width: "100%" }}>
					<TableContainer>
						<Table sx={{ minWidth: 750 }}
							aria-labelledby="tableTitle"
							size={dense ? 'small' : 'medium'} >
							<TableHead>
								<TableRow>
									<TableCell >
										Student Name
									</TableCell>
                                    {monthDate.map((month)=>{
                                        return(
                                            <TableCell style={{ textAlign: "center" }}>
                                                {moment(month).format("MMM DD")}
                                            </TableCell>
                                        )
                                    })}
									
								</TableRow>
							</TableHead>
							<TableBody>
                            
                                   
								{attandanceData.length > 0 ? attandanceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
									return (
                                        <>
										<TableRow key={item._id}>
											<TableCell  >{item.studentId && item.studentId.name}{" "} {item.studentId && item.studentId.lastName}</TableCell>
                                           {monthDate.map((month)=>{
                                               const mon = moment(month).format("DD/MM/YY");
                                               const monDat = moment(month).format("D");
                                            
                                            const sun =  monthSundays.filter((val)=>{
                                                const tt  = JSON.stringify(val) === monDat ? true : null;
                                                return tt
                                            })

                                            const sat =  monthSaturdays.filter((val)=>{
                                                const tt  = JSON.stringify(val) === monDat ? true : null;
                                                return tt
                                            })
                                                
                                            return(<>
                                                 {item.date === mon ?<TableCell align="center" style={{ width: "200px", }}>{item.attendence === "0" ? "A" : "P"}</TableCell>:
                                                 sun.length !== 0 || sat.length !== 0 ? <TableCell align="center" style={{ width: "200px", }}>Leave</TableCell> :<TableCell align="center" style={{ width: "200px", }}>{"-"}</TableCell>}
                                                 </>
                                                ) 
                                           })}
										</TableRow>
                                        </>
									)
								}): <p>Record Not found</p>}
                                        {/* <TableRow >
											<TableCell>Total</TableCell>
                                            </TableRow> */}
								{emptyRows > 0 && (
									<TableRow
										style={{
											height: (dense ? 33 : 53) * emptyRows,
										}}
									>
									<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 15]}
						component="div"
						count={attandanceData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						rows={attandanceData}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
					<FormControlLabel
						control={<Switch checked={dense} onChange={handleChangeDense} />}
						label="Dense padding"
					/>
				</div> : 

				<div className='counselloTabel' style={{ width: "100%" }}>
					<TableContainer>
						<Table sx={{ minWidth: 750 }}
							aria-labelledby="tableTitle"
							size={dense ? 'small' : 'medium'} >
							<TableHead>
								<TableRow>
									<TableCell >
										Student Name
									</TableCell>
                                    {weekDate.map((week)=>{
                                        return(
                                            <TableCell style={{ textAlign: "center" }}>
                                                {moment(week).format("MMM DD")}
                                            </TableCell>
                                        )
                                    })}
									
								</TableRow>
							</TableHead>
							<TableBody>
                            
                                   
								{attandanceData.length > 0 ? attandanceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
									
                                    return (
                                        <>
										<TableRow key={item._id}>
											<TableCell  >{item && item.studentId && item.studentId.name}{" "} {item && item.studentId && item.studentId.lastName}</TableCell>
                                           {weekDate.map((week)=>{
                                               const wek = moment(week).format("DD/MM/YY");
                                               const last1day = moment().subtract(0, 'weeks').endOf('week').format('DD/MM/YY');
                                               const last2day = moment().subtract(0, 'weeks').endOf('isoWeek').format('DD/MM/YY');
                                             
                                               return(<>
                                                {item.date === wek ?<TableCell align="center" style={{ width: "200px", }}>{item.attendence === "0" ? "A" : "P"}</TableCell>:
                                                wek === last1day || wek === last2day  ? <TableCell align="center" style={{ width: "200px", }}>Leave</TableCell> :<TableCell align="center" style={{ width: "200px", }}>{"-"}</TableCell>}
                                                </>
                                               )
                                           })}
										</TableRow>
                                        </>
									)
								}): <p>Record Not found</p>}
                              
                                    <TableRow >
                                        {weekDate.map((week)=>{
                                            const wek = moment(week).format("DD/MM/YYYY");
                                            
                                            const f = attandanceData.filter((asa)=>{
                                                console.log(wek,"date")
                                                console.log(asa.date,"asa.date")
                                                return(
                                                  moment(asa.date).format("DD/MM/YY") === wek ? asa.attendence :"NO"
                                                )
                                            })
                                            // console.log(f,"((*&^%$#))")
                                            //    const last1day = moment().subtract(0, 'weeks').endOf('week').format('DD/MM/YY');
                                            //    const last2day = moment().subtract(0, 'weeks').endOf('isoWeek').format('DD/MM/YY');
                                           

                                            // total week
                                            //    return(<>
                                            //     {wek ?<TableCell align="center" style={{ width: "200px", }}>{yy.length}</TableCell>
                                            //   :"yyuu" } 
                                            //     </>
                                            //    )
                                           })}
                                           {/* <TableCell>fddfd</TableCell> */}
											
                                            </TableRow>
                                            
								{emptyRows > 0 && (
									<TableRow
										style={{
											height: (dense ? 33 : 53) * emptyRows,
										}}
									>
									<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 15]}
						component="div"
						count={attandanceData.length}
						rowsPerPage={rowsPerPage}
						page={page}
						rows={attandanceData}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
					<FormControlLabel
						control={<Switch checked={dense} onChange={handleChangeDense} />}
						label="Dense padding"
					/>
				</div>}
			</Container>
            </div>:<Example/> }
		</div>
        </>
	 );
}

