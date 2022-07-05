import { io } from "socket.io-client";
import React, { useEffect, useRef, useState } from 'react';
import {Box,FormControl,styled,Grid, Container,Modal,Button,FormControlLabel,Table,TableBody,TableCell,TableContainer,TableHead,TablePagination,TableRow,TableSortLabel,Typography,Paper,Switch, NativeSelect, Avatar} from '@mui/material';
import alert1 from '../../images/white-alert.svg';
import alert2 from '../../images/black-alert.svg';
import { BASE_URL, SOCKET_URL } from "../../config/config";
import { stylePopup } from "../css/style";

const PushNotification = () => {
    const socket = useRef(io(SOCKET_URL));
    const [red, setRed] = useState(false);
    const [yellow, setYellow] = useState(false);
    const [dismiss, setDismiss] = useState(false);
    const [black, setBlack] = useState(false);

    useEffect(() =>
   {
    // GetCounsellorData();
    socket.current.on("noty", () => {
      setRed(true);
    });
    socket.current.on("yellownoty", () => {
      setYellow(true);
    });
    socket.current.on("blacknoty", () => {
      setBlack(true);
    });
    socket.current.on("dismissNotication", () => {
      setDismiss(true);
    });
    
  }, []);

  const handleRed = () => {
    setRed(false);
  };
  const handleYelllow = () => {
    setYellow(false);
  };
  const handleBlack = () => {
    setBlack(false);
  };
  const handleDismissNoty = () => {
    setDismiss(false);
  };

  return (
    <div>
                {
                  <Modal
                    open={red}
                    onClose={handleRed}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup} className="popup_box">
                      <Typography id="modal-modal-title" variant="h6" component="h2" className="red">
                         <span className='icon'> <img src={alert1} className="" alt="logo" /></span>

                      </Typography>
                      <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                        <h2 className="red-text">Code Red !</h2>
                         <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy </p>
                         <Button className="red-btn" onClick={handleRed}>OK</Button>
                      </Typography>
                      
                    </Box>
                  </Modal>
                }
                {
                  <Modal
                    open={yellow}
                    onClose={handleYelllow}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup} className="popup_box">
                      <Typography id="modal-modal-title" variant="h6" component="h2" className="yellow">
                      <span className='icon'> <img src={alert2} className="" alt="logo" /></span>
                      </Typography>
                      <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                      <h2 className="yellow-text">Code Yellow !</h2>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy </p>
                         <Button className="yellow-btn" onClick={handleYelllow}>OK</Button>
                      </Typography>
                      
                    </Box>
                  </Modal>
                }
                {
                  <Modal
                    open={black}
                    onClose={handleBlack}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup} className="popup_box">
                      <Typography id="modal-modal-title" variant="h6" component="h2" className="black">
                      <span className='icon'> <img src={alert1} className="" alt="logo" /></span>
                      </Typography>
                      <Typography id="modal-modal-description" component="div" sx={{ mt: 2 }}>
                      <h2 className="black-text">Code Black !</h2>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy </p>
                         <Button className="black-btn" onClick={handleBlack}>OK</Button>
                      </Typography>
                    </Box>
                  </Modal>
                }
                 {
                  <Modal
                    open={dismiss}
                    onClose={handleDismissNoty}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={stylePopup}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        <h1>DANGER Dismiss </h1>
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                      </Typography>
                    </Box>
                  </Modal>
                }
               
    </div>
  )
}

export default PushNotification