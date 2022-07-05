import  React, {useState,useEffect,useRef} from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { Link } from "react-router-dom";
import {Box,Fade, Backdrop,  FormControl, MenuItem, Select, Container,Modal,Button,FormControlLabel,Tooltip,IconButton,Checkbox,Table,TableBody,TableCell,TableContainer,TableHead,TablePagination,TableRow,TableSortLabel,Toolbar,Typography,Paper,Switch, NativeSelect, Avatar} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { API, BASE_URL, SOCKET_URL } from '../config/config';
import Example from '../comman/loader';
import { getStudentData } from '../action/functional';
import axios from 'axios';
import ImageAvatars from './header';
import Sidebar from './sidebar';
import SearchBar from "material-ui-search-bar";
import Papa from 'papaparse';
import { useDispatch } from 'react-redux';
import './css/student.css';
import { io } from "socket.io-client";
import InputField from '../comman/inputField';
import { authHeader } from '../comman/authToken';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LinearWithValueLabel from '../comman/progressBar';
import cross from './images/cross.svg';
import student from '../images/student.svg';

toast.configure();

  const headCells = [
    {
      id: 'Name',
        numeric: true,
        disablePadding: false,
        label: 'Name',
      },
      {
        id: 'Class',
        numeric: false,
        disablePadding: true,
        label: 'Class',
      },
      {
    id: 'Medical',
    numeric: true,
    disablePadding: false,
    label: 'Medical',
  },
  {
    id: 'Emergency',
    numeric: true,
    disablePadding: false,
    label: 'Emergency',
  },
  {
    id: 'Action',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },
  
  
  
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 4,
  pt: 2,
  px: 4,
  pb: 3,
};



export function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
  props;
  
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
            />
        </TableCell>
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

  const { numSelected,allData ,selectedRow,allClasses,GetClassData,setSelected} = props;
  const socket = useRef(io(SOCKET_URL));
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    p: 4,
  };


  const [open, setOpen] = useState(false);
  const [childOppen, setChildOpen] = useState(false);
  const [selectBox, setSelectBox] = useState("");
  const [nameC, setNameC] = useState("");
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData ={
      id: selectedRow,assignClass:selectBox
    }
    const res = axios({
      method: "put",
      url: `${API.studentAssignClass}`,
      data: requestData,
      headers: authHeader(),
    }).then((res)=>{
      toast.success("New Class Created")
      allData();       
      handleClose();
      setSelected([]);
    }).catch((err)=>{
      toast.error("Class Created Failed")
    })
  }

    const childOpen = () => {
    setChildOpen(true);
  };
  const childClose = () => {
    setChildOpen(false);
  };

  const handleChildSubmit = (e) => {
    e.preventDefault();
    if(!nameC.startsWith("class")){
      toast.error("classname must start with class ex: 'class A'");
    }
    else{
      const requestData = {
        className: nameC
      };
    axios.post(`${API.createClass}`, requestData).then((res)=>{
      toast.success("Selected Student Assign Class")  
      GetClassData();     
      childClose();
    }).catch((err)=>{
      toast.error("Selected Student Assign Class")
    })
  }
}

  const handleAllStuDelete = () =>{
    axios.delete(`${API.studentDelete}`, {data:  {id:
        selectedRow},headers:authHeader()
    }).then((res)=>{
      toast.success("Selected Student Delete");
      allData();
      setSelected([]);
    }).catch((err)=>{
     toast.error("Selected Student Delete");
    })   
  }

  const handleAllStuDismiss = () =>{
    var date = new Date();
        var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        var am_pm = date.getHours() >= 12 ? "PM" : "AM";
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var time = hours + ":" + minutes + ":" + seconds + " " + am_pm;

         
        const reqData ={
          id: selectedRow,
          time:time,
        }

        const request = axios({
          method: "post",
          url: `${API.studentDismiss}`,
          data: reqData,
          headers: authHeader(),
        }).then((res)=>{
      toast.success("Selected Student Dismiss")
      socket.current.emit("sendNotificationDismiss", {});
      allData();   
      setSelected([]);   
    }).catch((err)=>{
     toast.error("Selected Student Dismiss")
    })
  }



   
  return (<>

          <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={childOppen}
          onClose={childClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={childOppen}>
            <Box sx={style}>
            <form className="mui-form" onSubmit={handleChildSubmit} > 
                <legend >Add Class</legend>
                <div className="mui-textfield">
                  <input type="text" placeholder='class E' onChange={(e) => setNameC(e.target.value )}/>
                </div>
                <div className="btndesign text-right">
                <button
                    type="button"
                    className="btn btn-transparent"
                    onClick={childClose}
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
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
            <form className="mui-form" onSubmit={handleSubmit}> 
                <legend >Assign</legend>
                <div className="mui-textfield">
                <FormControl sx={{ m: 1, minWidth: 120 }} className="filter">
                <NativeSelect
                    defaultValue="all classes"
                    onChange={(e) => setSelectBox(e.target.value)}
                    inputProps={{
                      name: 'age',
                      id: 'uncontrolled-native',
                    }}
                  >
                    {allClasses.map((item)=>{
                        return(
                    <option key={item._id} value={item._id}>{item.className}</option>
                    )})}  
                   
                  </NativeSelect>
                    </FormControl>
                </div>
                
                <a className='float-right pointer blue' onClick={childOpen}>Add new class</a>
                
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
    <Toolbar

    className='delete-outer-box'
    sx={{
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
      ...(numSelected > 0 && {
        bgcolor: (theme) =>
        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
      }),
    }}
    >
      {numSelected > 0 ? (
        <Typography
        sx={{ flex: '1 1 100%' }}
        color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
          id="tableTitle"
          component="div"
        >
         
        </Typography>
      )}

      {numSelected > 0 ? (
        <span className='delete-box'>
            <span title="Delete" onClick={handleAllStuDelete}>
               Delete
            </span>|
            <span title="Assign" onClick={handleOpen}>
               Assign
            </span>
             |
            <span title="Dismiss" onClick={handleAllStuDismiss}>
               Dismiss
            </span>
            
        </span>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
           
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  </>);
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setStudentDetail] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [openmodel,setOpenmodel]=useState(false);
  const [search,setSearch]=useState('');
  const [filterr,setFilter]=useState([]);
  const [emergencyVal,setEmergencyVal]=useState([]);
  const [classData,setClassData]=useState([]);
  const [array, setArray] = useState([]);
  const [progress, setProgress] = useState(false);
  const socket = useRef(io(SOCKET_URL));
  const dispatch = useDispatch();

  const handleClose1 = () => setOpenmodel(false);
  const handleOpen1 = () => setOpenmodel(true);

  const fileReader = new FileReader();
  
  const handleOnChange = (e) => {
    
    if (e.target.files[0]) {
      fileReader.onload = function (event) {
        const text = event.target.result;

        const options = {
          onUploadProgress:(ProgressEvent)=>{
            const {loaded,total} = ProgressEvent;
            let percent = Math.floor((loaded*100)/total)
       
          }
        }
       
        const csvHeader = text.slice(0, text.indexOf("\n")).split(",");
        const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");

        csvRows.splice(-1);
        const array = csvRows.map(i => {
          const values = i.split(",");
          const obj = csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
          return obj;
        });
        const reqData ={
          array:array,
        }

        const res = axios({
          method: "post",
          url: `${API.bulkUpload}`,
          data: reqData,
          headers: authHeader(),
        }).then((res)=>{

          setProgress(true)
          // toast.success("Student Bulk Upload Successfully")
          GetStudentData() 
          setTimeout(() => {
            setProgress(false);
            handleClose1();      
          }, 8500);
        }).catch((err)=>{
         toast.error("Student Bulk Upload Failed")
        })

        setArray(array);
          };
  
      fileReader.readAsText(e.target.files[0]);
    }
   
  };


  const handleStuDelete = (rowId) =>{
     axios.delete(`${API.studentDelete}`, {data:{     
         id: [rowId]
    },headers:authHeader()
     }).then((res)=>{
       toast.success("Student Delete Successfully");
       setSelected([]);
       GetStudentData();      
     }).catch((err)=>{
      toast.error("Student Delete Failed");
     })
        
  }

  const handleStuDismiss = (rowId) =>{
    var date = new Date();
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
        
        const reqData ={
          id: [rowId],
          time:time,
        }
        
        const request = axios({
          method: "post",
          url: `${API.studentDismiss}`,
          data: reqData,
          headers: authHeader(),
        }  
        ).then((request)=>{
      
      socket.current.emit("sendNotificationDismiss", {});
      toast.success("Student Dismiss Successfully")
      setSelected([]);     
      GetStudentData(); 
    }).catch((err)=>{
     toast.error("Student Dismiss Failed")
    })
 }

 const handleStuFilter = (e) =>{
   if(e.target.value === "all classes"){
    setFilter(rows);
   }
   else if(e.target.value === "unassign"){
     const dataUnAssign = rows.filter((item) => {
       return item.assignClass === null
     })
     setFilter(dataUnAssign)
   }
   else if(e.target.value === e.target.value){
    const data =  rows.filter((item) => {
      return item.assignClass? item.assignClass.className === e.target.value : ""
    })
    if(data.length > 0){
      setFilter(data);
    }                                                                        
    else{
      setFilter([]);
    }
    }
 }

  const handleSearch = async(data) =>{
   
    setSearch(data);
    if(data !== ""){
        const response = await axios
        .get(`${API.studentSearch}/${data}`,{headers:authHeader()})
        .catch((err) => {});
        if(response === undefined){
          setFilter(false)
        }else{
        setFilter(response.data.data)
      }  
    }
    else {
      GetStudentData();
    } 
  }
  
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "15px",
    p: 4,
  };


  const handleOpen = (val) => {
    setOpen(true);
    setEmergencyVal(val);
  
   
  };
  const handleClose = () => {
    setOpen(false);
    setSelected([]);
  }
  
  React.useEffect(()=>{
    GetStudentData();
    GetClassData();
   
  }, [])

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

  const GetStudentData = async() => {
    const response = await axios
    .get(`${API.getStudent}`, { headers: authHeader() })
    .catch((err) => {});
    if(response.status === 200){
      setLoading(false);
    }else{
      setLoading(true);
    }
    setStudentDetail(response.data.data);
    setFilter(response.data.data);
    
    dispatch(getStudentData(response));
};


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
    
  };

  const handleClick = (event, rowId) => {
    
    const selectedIndex = selected.indexOf(rowId);
    let newSelected = [];

  
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(rowId,selected);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
   
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
   <Sidebar/>
      <div className='col-md-8 col-lg-9 col-xl-10 mr-30 '>
        <div className='header'> <ImageAvatars/></div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="upload_csv"
          open={openmodel}
          onClose={handleClose1}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}>
          <Fade in={openmodel}>
            <Box sx={style} className="upload_csv_box">
                <legend className="text-center">Upload students record in CSV </legend>
                <div style={{ textAlign: "center" }}>
      
              <form>
                <input
                  type={"file"}
                  id={"csvFileInput"}
                  accept={".csv"}
                  onChange={handleOnChange}
                />
              </form>
            </div>
            {progress?<span className='loader-bar'>
              <LinearWithValueLabel value={0
              } color="warning" />
            </span>:""}
            </Box>
          </Fade>
        </Modal>
        <Container maxWidth="100%" style={{padding:"0", display:"inline-block"}}>
          <div className='heading'>
              <div className="d-flex justify-content-between w-100">
                <h1>
					        <span className='counsellor-logo'> <img src={student} className="" alt="logo" /></span>
                Students</h1>
                <div >
                <Link to='/addStudent'>Add Button</Link>
                <span>|</span>
                <button className='mr-0 bluk-uploads' onClick={handleOpen1}>Bulk UPLOADS</button>
                  </div>
              </div>
          </div>
          <div className='heading2  d-flex justify-content-between align-items-center mt-4 mb-5'>
            <div>
              <SearchBar
                value={search}
                onChange={(newValue) => handleSearch( newValue )}
                placeholder='Search Student'/>
            </div>
            <div >
              <label>Filter By:</label>
              <FormControl sx={{ m: 1, minWidth: 120 }} className="filter">
              <NativeSelect
                  defaultValue="all classes"
                  onChange={(e) => handleStuFilter(e)}
                  inputProps={{
                    name: 'age',
                    id: 'uncontrolled-native',
                  }}
                  >
                  <option value="all classes">All Class</option>
                  {classData.map((item)=>{
                    return(
                  <option key={item._id} value={item.className}>{item.className}</option>
                  )})}  
                  <option value="unassign">Un Assign</option>
                </NativeSelect>
           
                  </FormControl>
            </div>
          </div>
          {!loading ?
      <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selectedRow ={selected}
              allData = {GetStudentData} allClasses={classData} GetClassData = {GetClassData} setSelected ={setSelected} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              
              />
            <TableBody>
              
           {filterr.length === 0 ?  <TableRow><TableCell colSpan={6}>Record not found</TableCell></TableRow>:  (
             filterr.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
               
               const isItemSelected = isSelected(row._id);
               const labelId = `enhanced-table-checkbox-${index}`;
             
               return (<React.Fragment key={row._id}>
                      <TableRow 
                        hover
                        onClick={(event) => {handleClick(event, row._id)}}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={1}
                        key={row._id}
                        selected={isItemSelected}
                        > 
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        
                      >
                        {row && row.image && row.image.startsWith('http') ?
                        <span className='avtar-text'>{<Avatar alt="Remy Sharp" src={`${row.image}`} sx={{ width: 56, height: 56 }} /> }<span>{row.name} {row.lastName} S/o {row.fatherName} {row.lastName}</span></span>:
                        <span className='avtar-text'>{<Avatar alt="Remy Sharp" src={`${BASE_URL}/${row.image}`} sx={{ width: 56, height: 56 }} /> }<span>{row.name} {row.lastName} S/o {row.fatherName} {row.lastName}</span></span>
                        }
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        style ={{width:"100px",}}
                      >
                        {row.assignClass ? row.assignClass.className : "" }
                      </TableCell>
                      <TableCell align="center" style ={{width:"100px"}} >{row.medical === "" ? "" : <i onClick={() => setSelected([])}><img src={require('./images/medical.png')} /></i>}</TableCell>
                      <TableCell align="center" style ={{width:"100px",}}>{row.emergency === "" ? "" : <Button onClick={() => handleOpen(row.emergency)}><i><img src={require('./images/emergency.png')} /></i></Button>}</TableCell>
                      <TableCell align="center" className='action' style ={{width:"150px",}}>
                            <span><Link to={`/editstudent/${row._id}`} ><img src={require('./images/edit.png')} /></Link></span>
                            <span onClick={() => handleStuDelete(row._id)}><img src={require('./images/delet.png')} /></span>
                            <span onClick={() => handleStuDismiss(row._id)}><img src={require('./images/dismiss.png')} /></span>
                     </TableCell>
                    </TableRow>
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
          count={filterr.length}
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
   :<Example/> }
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
      <Box className='emergency' sx={{ ...style1, width: 400 }}>
        <h2 id="parent-modal-title">Emergency No.</h2>
        {emergencyVal.map((item)=>{
          return(
            <div className='emergency-data' key={item._id}>
          <InputField
              type="text"
              value={item.Ename}
              inputprops= {true}
                /> 

         <a href={`tel:+${item.number}`}> <InputField
            type="text"
            value={item.number}
            inputprops= {true}
          /></a>
            </div>
          )
        })}
        <Button className='cross' onClick={handleClose}><img src={cross} className="" alt="logo" /></Button>
      </Box>
      </Modal>
      </div>
    </>
  );
}