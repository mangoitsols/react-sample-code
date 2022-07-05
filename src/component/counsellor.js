import React, {useState,useEffect} from 'react';
import Sidebar from './sidebar';
import ImageAvatars from './header';
import Container from '@mui/material/Container';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { API } from '../config/config';
import { Link } from "react-router-dom";
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
import SearchBar from 'material-ui-search-bar';
import axios from 'axios';
import { authHeader } from '../comman/authToken';
import counsellor from '../images/counsellor.svg';

toast.configure();

export function handleEdit(edit){
	return edit;
}
export default function Counsellor() {


	const [counsellorDetail, setCounsellorDetail] = useState([]);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [page, setPage] = useState(0);
	const [dense, setDense] = useState(false);
	const [loading, setLoading] = useState(true);
	const [search,setSearch]=useState('');


	useEffect(() => {
		handleGetUser();
		setSearch('');
	}, [])
	
	const handleGetUser = () =>{
		fetch(API.getAllUser,{headers:authHeader()}).then((a) => {
			if(a.status === 200 ){
				setLoading(false);
				return a.json();
			}else{
				setLoading(true);
			}
		}).then((data) => {
				setCounsellorDetail(data.filter((e) => e.role.name === "counsellor"))
		})
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

	const handleDelete = (id) => {

		setLoading(!loading);
		fetch(`${API.deleteUser}/${id}`, { method: 'DELETE',headers:authHeader() }).then((a) => {
			if(a.status === 200 || a.status ===201){
				setLoading(false);
				handleGetUser();
				toast.success("deleted successfully")
			}else{
				setLoading(true);
			}
		})
	}

	const handleSearch = async(data) =>{
  
		setSearch(data);
		if(data !== ""){
			await axios
			.get(`${API.counsellorSearch}/${data}`,{headers:authHeader()})
			.then((data) => {
				const dataCouncellor = data.data.data.filter((e) => e.role.name === "counsellor")
				setCounsellorDetail(dataCouncellor)	
		})
			.catch((err) => {
				setCounsellorDetail([])	
			});
		}
		else { 
			handleGetUser();
			

		} 
	  }


	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - counsellorDetail.length) : 0;
	return (
		<>
			
		<Sidebar />
		<div className='col-md-8 col-lg-9 col-xl-10 mr-30'>
			<div className='header'> <ImageAvatars /></div>
			<Container maxWidth="100%" style={{ padding: "0", display: "inline-block" }}>
		{!loading ? <React.Fragment> 
				<div className='heading'>
					<h1>
						<span className='counsellor-logo'><img src={counsellor} className="" alt="logo" /></span>
						Counsellor
					</h1>
					<a href='addCounsellor'>ADD COUNSELLOR</a>
				</div>
				<div className='search'>
					<div>
					<SearchBar
						value={search}
						onChange={(newValue) => handleSearch( newValue )}
						placeholder='Search Counsellor'/>
					</div>
				</div>

				<div className='counselloTabel' style={{ width: "100%" }}>
					<TableContainer>
						<Table sx={{ minWidth: 750 }}
							aria-labelledby="tableTitle"
							size={dense ? 'small' : 'medium'} >
							<TableHead>
								<TableRow>
									<TableCell >
										Name
									</TableCell>
									<TableCell style={{ textAlign: "center" }}>
										Class
									</TableCell>
									<TableCell style={{ textAlign: "center" }}>
										Assign Students
									</TableCell>
									<TableCell style={{ textAlign: "center" }}>
										Action
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{counsellorDetail.length > 0 ? counsellorDetail.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
									{console.log(item,"DF")}
									return (
										<TableRow key={item && item._id}>
											<TableCell  >{item.name}</TableCell>
											<TableCell align="center" style={{ width: "100px", }} >{item && item.classId && item.classId.className}</TableCell>
											<TableCell align="center" style={{ width: "200px", }}>{item && item.studentCount}</TableCell>
											<TableCell align="center" className='action' style={{ width: "150px", }}>
												<span><Link to={`/editCounsellor/${item && item._id}`}><img src={require('./images/edit.png')} alt="Edit icon" /></Link></span>
												<span><img src={require('./images/delet.png')} alt="Delete icon" onClick={() => handleDelete(item && item._id)}/></span>
											</TableCell>
										</TableRow>
									)
								}): <p>Record Not found</p>}
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
						count={counsellorDetail.length}
						rowsPerPage={rowsPerPage}
						page={page}
						rows={counsellorDetail}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
					<FormControlLabel
						control={<Switch checked={dense} onChange={handleChangeDense} />}
						label="Dense padding"
					/>
				</div>
				</React.Fragment>:<Example/> }
			</Container>
		</div>
		</>
		
	);
}
