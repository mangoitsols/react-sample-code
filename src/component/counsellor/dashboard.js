import React, { useState, useEffect } from "react";
import ImageAvatars from "./header";
import Sidebar from "./sidebar";
import axios from "axios";
import PropTypes from 'prop-types';
import { Box, FormControl, styled, Grid, Container, Modal, Button, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography, Paper, Switch, NativeSelect, Avatar } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { API, BASE_URL } from '../../config/config';
import Example from '../../comman/loader';
import SearchBar from "material-ui-search-bar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../css/student.css'
import PinInput from "react-pin-input";
import student from '../../images/student-black.svg';
import present from '../../images/present.svg';
import absent from '../../images/absent.svg';
import { styleMessageByPin, stylePopup, style1 } from "../css/style";
import moment from "moment";
import { Timerest } from "./timer";
import { authHeader } from "../../comman/authToken";
import PushNotification from "./pushnotification";


const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));

const headCells = [
	{
		id: 'Name',
		numeric: true,
		disablePadding: false,
		label: 'Name',

	},
	{
		id: 'Attendace',
		numeric: false,
		disablePadding: true,
		label: 'Attendance',
	},
	{
		id: ' OutofClass',
		numeric: true,
		disablePadding: false,
		label: ' Out of Class',
	},
	{
		id: 'Medical',
		numeric: true,
		disablePadding: false,
		label: 'Medical',
	},
	{
		id: 'Action',
		numeric: true,
		disablePadding: false,
		label: 'Action',
	},



];
export function EnhancedTableHead(props) {
	const { onRequestSort, order, orderBy } =
		props;

	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'center' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {

};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

const CounsellorDashboard = (props) => {

	const [rows, setCounsellorDetail] = React.useState([]);
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('calories');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [open, setOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	const [openModel, setOpenModel] = useState(false);
	const [search, setSearch] = useState('');
	const [checked, setChecked] = useState(false);
	const [selectSubBox, setSelectSubBox] = useState(false);
	const [pin, setPin] = useState('');
	const [selectCheck, setSelectCheck] = useState([]);
	
	const [preAbs, setPreAbs] = useState(false);
	const [preAbsId, setPreAbsId] = useState(false);


	useEffect(() => {
		GetCounsellorData();
		

	}, []);

	const GetCounsellorData = async () => {
		const id = localStorage.getItem("id")
		const response = await axios
			.get(`${API.getCounsellorStudent}/${id}`, { headers: authHeader() })
			.catch((err) => { });
		if (response.status === 200) {
			setLoading(false);
		} else {
			setLoading(true);
		}
		setCounsellorDetail(response.data);

	};

	const handleSearch = async (data) => {
		setSearch(data);
		if (data !== "") {
			const response = await axios
				.get(`${API.studentSearch}/${data}`, { headers: authHeader() })
				.catch((err) => { });
			if (response === undefined) {
				setCounsellorDetail(false)
			} else {
				setCounsellorDetail(response.data)

			}
		}
		else {
			GetCounsellorData();
		}
	}

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	}

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.data.map((n) => n._id);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);

	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const isSelected = (id) => selected.indexOf(id) !== -1;

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.data.length) : 0;

	const handleChange = (event) => {
		let checkedbox = event.target.checked
		setChecked(checkedbox)
	}

	const content = (checked === true) ? "display form-outline mb-4 col-md-12 medicaltextarea attendance" : "disabled form-outline mb-4 col-md-12 medicaltextarea attendance";

	const handleAttendance = async (row, attdance) => {

		var today = new Date(),
			date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

		const requestData = {
			studentId: row._id,
			counsellor_id: localStorage.getItem("id"),
			date: moment(date).format("DD/MM/YY"),
			attendence: attdance,
			classId: row.assignClass,
		};

		if (today.getDay() == 6 || today.getDay() == 0) {
			toast.warning("Today is weekend");
		}
		else if(attdance === null){
			toast.warning("You have to click on the permission");
		}
		else if(row && row.dismiss){
			toast.warning("This student is dismiss by manager");
		}

		else{
			const res = await axios({
				method: "post",
				url: `${API.saveAttendance}`,
				data: requestData,
				headers: authHeader(),
			})
				.catch((err) => { });
			if (res) {
				GetCounsellorData();

			} else {
				toast.error("Already  updated");
			}
		}
	}

	const handleAttendanceUpdate = async (attdance, idd) => {
		const requestData = {
			attendence: attdance,
		};

		const res = await axios({
			method: "put",
			url: `${API.updateAttendace}/${idd}`,
			data: requestData,
			headers: authHeader(),
		})
			.catch((err) => { });
		if (res) {
			toast.success("Attendance updated");
			window.location.reload();
			GetCounsellorData();

		} else {
			toast.error("Already  updated");

		}
	}


	const handleMedicalByPin = async () => {
		const requestData = {
			pin: pin,
		};
		const res = await axios({
			method: "post",
			url: `${API.varifyPin}`,
			data: requestData,
			headers: authHeader(),
		}).catch((err) => { });
		if (res) {
			toast.success("Pin Verification Confirm");
			setOpenModel(true);
			setSelected([]);
		} else {
			toast.error("Pin Verification Failed");
			setSelected([]);
		}
	}

	const closeModel = () => {
		setOpenModel(false);
	}
	
	const handleOnChangeSelect = async (e,row) => {
		const requestData = {
			out_of_class: e.target.value,
		};
		
		const res = axios({
			method: "put",
			url: `${API.studentStatusUpdate}/${row._id}`,
			data: requestData,
			headers: authHeader(),
		}).catch((err) => { });
		if (res === undefined) {
			toast.warning("Before updating status you have to update attendance");
		}
		else if(row.attaindence === null){
			toast.warning("First you have to mark attandance");
		}
		else if(row.attaindence && row.attaindence.attendence === "0"){
			toast.warning("You are mark as an absent");
		}
		else if(row && row.dismiss){
			toast.warning("This student is dismiss by manager");
		}
		else {
			if (res) {
				// toast.success("Status Update", e.target.value);
				setSelectSubBox(true);
			
				setSelectCheck([...selectCheck,row._id]);
				GetCounsellorData();

			} else {
				toast.error("Status updated failed", e.target.value);

			}
		}
	}

	const handleEditPreAbs = (id, attandance) => {
		if (attandance === null) {
			toast.warning("First you have to mark attandance");
		}
		else {
			setPreAbsId(id);
			setPreAbs(!preAbs);
		}
	}

	return (<>
		<div className='col-md-3 col-lg-3'><Sidebar /></div>
		<div className='col-md-9 col-lg-9 mr-30'>
			<div className='header'> <ImageAvatars /></div>
			<Container maxWidth="100%" style={{ padding: "0", display: "inline-block" }}>
				<PushNotification />

				<div className='heading'>
					<h1 className="mb-5">

						Today Attendance
					</h1>
				</div>
				<Box sx={{ flexGrow: 1 }} className="dashboard-grid">
					<Grid container spacing={2}>
						<Grid item xs={3}>
							<Item className='dashboaed-text'>
								<div> <h2>Total Students</h2>
									<span className='count'>{rows.totalcount}</span>
								</div>
							</Item>
						</Grid>
						<Grid item xs={3}>
							<Item className='dashboaed-text'>
								<div> <h2>Present Students</h2>
									<span className='count'>{rows.totalpresent}</span>
								</div>
							</Item>
						</Grid>
						<Grid item xs={3}>
							<Item className='dashboaed-text'>
								<div> <h2>Absent Students</h2>
									<span className='count'>{rows.totalabsent}</span>
								</div>
							</Item>
						</Grid>
						<Grid item xs={3}>
							<Item className='dashboaed-text'>
								<div> <h2>Out of Class</h2>
									<span className='count'>{rows.totalout}</span>
								</div>
							</Item>
						</Grid>
					</Grid>
				</Box>


				<div className='heading'>
					<div className="d-flex justify-content-between w-100">
						<h1><span className='icon-black'> <img src={student} className="" alt="logo" /></span>Students</h1>
					</div>
				</div>
				<div className='heading2   justify-content-between align-items-center mt-4 mb-4'>
					<div className="w-100">
						<SearchBar
							value={search}
							onChange={(newValue) => handleSearch(newValue)}
							placeholder='Search Student' />
					</div>
					<div className="form-outline col-md-12 mt-4 pt-3 pb-3 medicalCheckbox w-100 grey">
						<input
							type="checkbox"
							className='checkbox'
							checked={checked}
							onChange={handleChange}
						/>
						To mark the attendance please check the first.
					</div>
				</div>
				{!loading ?
					<Box sx={{ width: '100%' }} className="student_table">
						<Paper sx={{ width: '100%', mb: 2 }} className="student_table-inner">
							<EnhancedTableToolbar numSelected={selected.length} selectedRow={selected}
								allData={GetCounsellorData} setSelected={setSelected} />
							<TableContainer>
								<Table
									sx={{ minWidth: 750 }}
									aria-labelledby="tableTitle"
									size={dense ? 'small' : 'medium'} className="stuble-table-box"
								>
									<EnhancedTableHead
										numSelected={selected.length}
										order={order}
										orderBy={orderBy}
										onSelectAllClick={handleSelectAllClick}
										onRequestSort={handleRequestSort}
										rowCount={rows.data.length}
									/>
									<TableBody>

										{rows.data.length === 0 ? <TableRow><TableCell>Record not found</TableCell></TableRow> : (
											rows.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {

												const isItemSelected = isSelected(row._id);
												const labelId = `enhanced-table-checkbox-${index}`;
								
												const found = selectCheck && selectCheck.find(element => element === row._id);
												const handleNoStatus = rows.data.find(ele => ele._id === row._id)
												
												console.log(found,"fgf",handleNoStatus.attaindence && handleNoStatus.attaindence.out_of_class)

												return (<React.Fragment key={row._id}>
													<TableRow
														hover
														// onClick={(event) => {handleClick(event, row._id)}}
														role="checkbox"
														aria-checked={isItemSelected}
														tabIndex={1}
														key={row._id}
														selected={isItemSelected}
													>
														
														<TableCell
															component="td"
															id={labelId}
															scope="row"
														>
															<span className="d-flex align-items-center">{<Avatar alt="Remy Sharp" src={`${BASE_URL}/${row.image}`} sx={{ width: 56, height: 56 }} className="mr-4" />}{row.name} {row.lastName} S/o {row.fatherName} {row.lastName}</span>
														</TableCell>
														<TableCell
															component="td"
															id={labelId}
															scope="row"
															padding="none"
															style={{ width: "150px", }}
														>


															{preAbs && preAbsId === row._id ? <div className={content} >
																<button onClick={() => handleAttendanceUpdate("1", (row && row.attaindence) ? row.attaindence._id : "")} className="present-button"><span className=''> <img src={present} className="" alt="icon" /></span></button>
																<button onClick={() => handleAttendanceUpdate("0", (row && row.attaindence) ? row.attaindence._id : "")} className="absent-button"><span className=''> <img src={absent} className="" alt="" /></span></button>
															</div> : (
																checked === false?  
																row && row.attaindence && row.attaindence.attendence === "1" ? "Present" : row && row.attaindence && row.attaindence.attendence === "0" ? "Absent" :row && row.dismiss?"Dismiss":
																<div className={content}>
																	<button onClick={() => handleAttendance(row._id, null, row.assignClass)} className="present-button"><span className=''> <img src={present} className="" alt="icon" /></span></button>
																	<button onClick={() => handleAttendance(row._id, null, row.assignClass)} className="absent-button"><span className=''> <img src={absent} className="" alt="" /></span></button>
																</div>:
																row && row.attaindence && row.attaindence.attendence === "1" ? "Present" : row && row.attaindence && row.attaindence.attendence === "0" ? "Absent" :row && row.dismiss?"Dismiss":
																<div className={content}>
																	<button onClick={() => handleAttendance(row, "1")} className="present-button"><span className=''> <img src={present} className="" alt="icon" /></span></button>
																	<button onClick={() => handleAttendance(row, "0")} className="absent-button"><span className=''> <img src={absent} className="" alt="" /></span></button>
																</div>)}

														</TableCell>
														<TableCell align="center" style={{ width: "150px", }}>
															<FormControl sx={{ m: 1, minWidth: 30 }} className="filter ml-0 mb-3 w-100 select-box">
																<NativeSelect
																	defaultValue={row && row.attaindence ? row.attaindence.out_of_class : "No"}
																	onChange={(e) => handleOnChangeSelect(e, row)}
																	inputProps={{
																		name: 'No',
																		id: 'uncontrolled-native',
																	}}
																>
																	<option value="No">No</option>
																	<option value="in Rest Room">In Rest Room</option>
																	<option value="in Front Office">In Front Office</option>
																	<option value="in Camp">In camp</option>

																</NativeSelect>
												
																{row && row.attaindence && row.attaindence.attendence === "1" ? selectSubBox === false ? "" : found  && handleNoStatus.attaindence && handleNoStatus.attaindence.out_of_class !== "No" ? <Timerest idd={row._id} /> :"":""}
															</FormControl>
														</TableCell>
														<TableCell align="center" style={{ width: "100px", }}>{row.medical === "" ? "" : <Button onClick={() => handleOpen(row.emergency)}><i><img src={require('../images/medical.png')} alt="emergency" /></i></Button>}</TableCell>
														<TableCell align="center" className='action' style={{ width: "150px", }}> 
															<span onClick={() => handleEditPreAbs(row._id, row.attaindence)}><img src={require('../images/edit.png')} alt="emer" /></span>
														</TableCell>
													</TableRow>
													{
														<Modal
															open={openModel}
															onClose={closeModel}
															aria-labelledby="modal-modal-title"
															aria-describedby="modal-modal-description"
														>
															<Box sx={styleMessageByPin}>
																<Typography id="modal-modal-title" variant="h6" component="h2">
																	<strong>Student Name: <span>{row.name}</span></strong>
																</Typography>
																<Typography id="modal-modal-description" sx={{ mt: 2 }}>
																	<strong>Medical Message </strong>
																	<textarea id="medical" name="medical" rows="4" cols="30" value={row.medical} ></textarea>
																</Typography>
															</Box>
														</Modal>
													}
												</React.Fragment>
												);
											}))}
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
								rowsPerPageOptions={[5, 10, 25]}
								component="div"
								count={rows.data.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Paper>
						<FormControlLabel
							control={<Switch checked={dense} onChange={handleChangeDense} />}
							label="Dense padding"
						/>
					</Box>
					: <Example />}
				{/* <div className="student-box"><EnhancedTable data={searchData}/></div> */}
			</Container>
		</div>
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="parent-modal-title"
				aria-describedby="parent-modal-description"
			>
				<Box sx={{ ...style1, width: 400 }}>
					<h2 id="parent-modal-title">Enter Your Pin</h2>
					<div >
						<PinInput
							length={4}
							initialValue="0000"
							type="numeric"
							inputMode="number"
							style={{ padding: '10px' }}
							onComplete={(value, index) => { setPin(value) }}
							autoSelect={true}
							regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
						/>
					</div>
					<Button onClick={handleClose}>CANCEL</Button>
					<Button onClick={handleMedicalByPin}>SUBMIT</Button>
				</Box>
			</Modal>

		</div>

	</>);
};

export default CounsellorDashboard;