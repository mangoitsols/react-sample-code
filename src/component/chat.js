import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import ImageAvatars from './header';
import { API, BASE_URL, SOCKET_URL } from '../config/config';
import { authHeader } from '../comman/authToken';
import SearchBar from 'material-ui-search-bar';
import axios from 'axios';
import { InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";
import { Avatar, Box, Button, Chip, Modal, Typography } from '@mui/material';
import Example from '../comman/loader';
import { MenuProps, useStyles } from '../comman/utils';
import { toast } from "react-toastify";
import Lottie from "react-lottie";
import { Theme, useTheme } from '@mui/material/styles';
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import InputField from '../comman/inputField';
import ScrollableChat from './counsellor/scrollableChat';
import animationData from "../comman/12966-typing-indicator.json";
import send from "./images/send.svg";
import chat from './images/chat.svg';

toast.configure();



const Chat = () => {

    const classes = useStyles();
    const [counsellorDetail, setCounsellorDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [createGroup, setCreateGroup] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [chatId, setChatId] = useState('');
    const [photo, setPhoto] = useState('');
    const [file, setFile] = useState('');
    const [groupName, setGropName] = useState('');
    const [selected, setSelected] = useState([]);
    const [message, setMessage] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [socketConnecttion, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [onlyCounsellorDetail, setOnlyCounsellorDetail] = useState([]);
    const [groupData, setGetGroupsData] = useState([]);
    const [groupVisible, setGroupVisible] = useState('');
    const [highlightId, setHighlightId] = useState(false);

    var socket, selectedChatCompare;

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    
    useEffect(() => {
        
        socket = io(SOCKET_URL);  
        socket.emit("setup", localStorage.getItem("id"));
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);
    
    useEffect(() => {
        handleGetOnlyGroups();
        handleGetOnlyCounsellor();
        handleGetGruops();
        fetchMessages();
        setSearch('');
        selectedChatCompare = chatId;
    }, [chatId])

    useEffect(() => {
       
        socket?.on("message recieved", (newMessageReceived) => {
            message.push(newMessageReceived)
            fetchMessages();
            //   setMessage([...message, newMessageReceived]);
        });
    })

    const handleGetOnlyGroups = async() => {
        const res = await axios({
            method: "post",
            url: `${API.fetchGroup}`,
            data: localStorage.getItem("id"),
            headers: authHeader(),
        })
        if (res) {
            setGetGroupsData(res.data)
        }
    }

    const handleGetOnlyCounsellor = async() => {

        const data = await axios.get(API.getAllUser, { headers: authHeader() })
            if(data){
                setLoading(false);
                var a = data.data.filter((e) => e.role.name === "counsellor" );
                setOnlyCounsellorDetail(a);
            }
    }

    const handleGetGruops = async () => {
            fetch(`${API.allGCs}/${localStorage.getItem('id')}`,{headers:authHeader()}).then((a) => {
                if(a.status === 200 ){
                    setLoading(false);
                    return a.json();
    
                }else{
                    setLoading(true);
                }
            }).then((data) => {
                const dat1 = data && data[0].filter((e) => (e._id !== localStorage.getItem("id")));
                const dat2 = data[1];
                Array.prototype.push.apply(dat1,dat2);
                setCounsellorDetail(dat1);
            })
    }

    const handleSearch = async (data) => {
        setSearch(data);
        if (data !== "") {
            await axios
                .get(`${API.counsellorSearch}/${data}`, { headers: authHeader() })
                .then((data) => {
                    const dataCouncellor = data.data.data.filter((e) => e.role.name === "counsellor")
                    setCounsellorDetail(dataCouncellor)
                })
                .catch((err) => {
                    setCounsellorDetail([])
                });
        }
        else {
            handleGetGruops();
        }
    }

    const handleEditGroup = () => {
        setEditModal(!editModal);
    };


    const handleCreateGroup = () => {
        setCreateGroup(!createGroup);
        setSelected([]);
        setPhoto('');
        setGropName('');
    };

    
  const handleGroupDelete = async() =>{
    
    const del = await axios.delete(`${API.deleteGroup}/${chatId._id}`,{headers:authHeader()})
  
    if(del){
      toast.success("Group Deleted");
      
      window.location.reload();
  }else{
      toast.error("Something went wrong");
  }  

  }
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = localStorage.getItem("id");
      selected.push(id);
        const formData = new FormData();
        const reqData = {
            chatName: groupName,
            users:selected,
            adminId: id,
            image:file,
        }
       
          for (var key in reqData) {
            if(key === "users"){
                for(var i =0 ;i<reqData.users.length;i++){
                    formData.append(key+'['+i+']', reqData[key][i]);
                }
            }
            else{
                formData.append(key, reqData[key]);  
            }
          }
        const res = await axios({
            method: "post",
            url: `${API.createGroup}`,
            data: formData,
            headers: authHeader(),
        })
        if (res) {
            toast.success("Channel created");
            setCreateGroup(false);
            window.location.reload();

        } else {
            toast.error("Channel can't be created");
        }
         
    }

    const handleEditSubmit = async(e) =>{
        e.preventDefault();
       
        const id = localStorage.getItem("id");
        const formData = new FormData();
        const reqData = {
            userId:selected,
            chatId:chatId._id,
            chatName:groupName?groupName:chatId.chatName,
            image:file?file:chatId.image,
        }
     
        if(reqData.userId.length >0){
          for (var key in reqData) {
            if(key === "userId"){
                for(var i =0 ;i<reqData.userId.length;i++){
                    formData.append(key+'['+i+']', reqData[key][i]);
                }
            }
            else{
                formData.append(key, reqData[key]);  
            }
          }}
          else{
            for (var key in reqData) {
                formData.append(key, reqData[key]);  
            } 
          }
        const res = await axios({
            method: "put",
            url: `${API.addUserInGroup}`,
            data: formData,
            headers: authHeader(),
        }) .catch(function (error) {
            if(error.response.status === 400) {
                toast.error("User already add in the group");
            }
            
        })
        if (res.status === 200) {
            toast.success("Changes updated");
            setEditModal(!editModal);
            handleGetGruops();
        }
        else{
            toast.error("Failed to update the group");
        }
    }

    const _handleImageChange = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setFile(file)
            setPhoto(reader.result)
        }
        reader.readAsDataURL(file)

    }
    let $imagePreview = null;

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        borderRadius: "15px",
        p: 4,
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelected(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const theme = useTheme();

    const handleSelectChatUser = async(ele) => {
        setHighlightId(ele._id)
       var chatid ;
       var keys =  Object.keys(ele);
    
       setToggle(!toggle);
       if(keys.indexOf("isGroupChat") !== -1)  
       {               
                chatid = ele._id;
                setChatId(ele);
                setGroupVisible(chatid);
                handleGetGruops();
        }   
        else  
        {  
            // setToggle(true)
            
                   const reqData = {
                       userId: localStorage.getItem("id"),
                       recieverId: ele._id,
                   }
           
                  await axios({
                       method: "post",
                       url: `${API.accessChatByChatId}`,
                       data: reqData,
                       headers: authHeader(),
                   }).then((res) => {
                       setChatId(res.data);
                       fetchMessages();
                   }).catch((err) => {
                       toast.error("Something went wrong")
                   })
                }  

    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        socket = io(BASE_URL);
     
        socket.on("connected", () => { setSocketConnected(true) });
        if (newMessage) {
            socket.emit("stop typing", chatId._id);
            try {
                const reqData = {
                    chatId: chatId._id,
                    content: newMessage,
                    senderId: localStorage.getItem("id"),
                }
                setNewMessage("")
                const request = await axios({
                    method: 'post',
                    url: `${API.sendMessage}`,
                    data: reqData,
                    headers: authHeader(),
                })
                socket.emit("message", request.data);
                setMessage([...message, request.data]);
                // handleGetGruops();
                fetchMessages();
            }
            catch (error) {
                toast.error("Message not send!");
            }

        }
    }

    const fetchMessages = async () => {
    console.log(chatId,"fff")
        if (!chatId) {
            return;
        }

        try {
            setMessage([]);
            setLoading(true)
            const data = await axios.get(`${API.getMessage}/${chatId._id}`, { headers: authHeader() })
            setMessage(data.data);
            setLoading(false);
            socket.emit("join chat", chatId._id);
        }
        catch (error) {

        };
    }

    
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        
        if (!socketConnecttion) return;
        socket = io(BASE_URL);
        socket.on("connected", () => { setSocketConnected(true) });
        // if (!typing) {
            setTyping(true);
            socket?.emit("typing", chatId._id)
        // }
        let lastTypingTime = new Date().getTime();
        var timerLength = 1000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket?.emit("stop typing", chatId._id);
                setTyping(false);
            }
        }, timerLength);
        
    }

    const groupChatData = groupData && groupData.filter((e)=> e._id === groupVisible);
    const receivername = chatId && chatId.users && chatId.users.filter((e) => (e._id !== localStorage.getItem("id")));

    const handleRemoveMember = async(ele,item) =>{
      
        if(ele){
        try {
            const reqData = {
                userId: ele._id,
                chatId: item._id,
            }
            setNewMessage("")
            const request = await axios({
                method: 'put',
                url: `${API.removeGroupUser}`,
                data: reqData,
                headers: authHeader(),
            })
           
            handleGetGruops();
          
        }
        catch (error) {
            toast.error("Failed to remove user!");
        }}
    }

    return (
        <React.Fragment>
            <Sidebar />
            <div className='col-md-8 col-lg-9 col-xl-10 mr-30'>
                <div className='header'> <ImageAvatars /></div>
                <div className='heading '>
                    <h1 className='mt-5'>
                    <span className='counsellor-logo'><img src={chat} className="" alt="logo" /></span>
                        Chat
                    </h1>
                </div>
                <div className='chat d-flex mt-4 border-top'>
                    <div className='chat-left col-md-4 col-xl-2'>
                        <div className='mt-3'>
                            <h3>Message</h3>
                            <SearchBar
                                value={search}
                                onChange={(newValue) => handleSearch(newValue)}
                                placeholder='Search Counsellor' />
                        </div>
                        <div className="createpersonal">
                            <ul>
                                <li>
                                    <p onClick={handleCreateGroup}># Create Personal Channels </p>
                                </li>
                               
                                {!loading  ? counsellorDetail && counsellorDetail.map((item) => {
                             
                                    return (
                                        <li key={item._id} >
                                            <p className={highlightId === item._id ? "avatar-image bg-secondary" :"avatar-image "} onClick={() => handleSelectChatUser(item)} >
                                                {<Avatar alt="Remy Sharp" src={`${BASE_URL}/${item ? item.image : ""}`} sx={{ width: 56, height: 56 }} />}
                                                {item.name ? item.name : item.chatName} {" "} {item.lastname} </p>
                                                {(item.chatName || item.readBy === 0) ? "" :<span className='notfication'>{item.readBy}</span>}
                                        </li>
                                    )
                                }) : <div className='loader'><Example /></div>}

                            </ul>
                        </div>
                    </div>
           
                   <div className='chat-right col-md-8 col-xl-10 border-left'>

                    {/* {groupChatData  && groupChatData.map((item) => {
                                    return (<div className='row'>
                                    <div className='profile-top'>
                                        <span className='avatar-image'>{<Avatar alt="Gemy Sharp" src={`${BASE_URL}/${item ? item.image : ""}`} sx={{ width: 56, height: 56 }} />}</span>
                                        <h3>{item ? item.chatName : ""} </h3>
                                        {item.users.map((member)=>{
                                            return(
                                                <span>{member.name === localStorage.getItem("name") ? "you" : member.name} {" , "}</span>
                                            )
                                        })}
                                        <button onClick={() => {handleEditGroup(); setChatId(item)} }> edit</button>
                                    </div>
                                    
                                     {message.length === 0 ? <p>Message not found</p> :
                                        <div >
                                            <ScrollableChat messages={message} />
                                        </div>} 
                                    <div className='chatmessage'>
                                         {isTyping ? (
                                            <div>
                                                <Lottie
                                                    options={defaultOptions}
                                                    // height={50}
                                                    width={70}
                                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                                />
                                            </div>
                                        ) : (
                                            ""
                                        )} 
                                        <InputField id="message" name="message" className="form-control" placeholder="type here..." value={newMessage} onChange={(e) => typingHandler(e)} />
                                        <Button type='submit' onClick={(e) => {handleSendMessage(e);}}>SEND</Button>
    
                                    </div>
                                </div>
                                    )})}
                                    </div> */}
                                    {/* <div className='chat-right col-md-10 border-left'> */}
                
                                    {chatId ? 
                    chatId && chatId.isGroupChat === false ?
                     <div className='row'>
                        <div className='profile-top'>
                           <span className='avatar-image'>{<Avatar alt="Remy Sharp" src={`${BASE_URL}/${receivername ?receivername[0].image: ""}`}  sx={{ width: 56, height: 56 }} />}</span>
                           <h3>{receivername ?receivername[0].name: ""} {" "} {receivername ?receivername[0].lastname : ""}</h3>
                        </div>
                        <div className='chat-section'>
                         {message.length === 0 ? <div className='not-found'><p>Message not found</p></div> :
                          <div >
                             <ScrollableChat messages={message}/>
                          </div>}
                        <div className='chatmessage'> 
                        {isTyping? (
                                <div>
                               <Lottie
                                    options={defaultOptions}
                                    // height={50}
                                    width={70}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                                </div>
                            ) : (
                                ""
                            )} 
                            <InputField id="message" name="message" className="form-control" placeholder="type here..." value={newMessage} onChange={(e) => typingHandler(e)} />
                            <Button type='submit' onClick={(e) =>handleSendMessage(e)}><img src={send} className="" alt="logo" /></Button>
                         
                        </div></div>
                     </div>: 
                      // group chat header
                      <div className='row'>
                        <div className='profile-top'>
                           <span className='avatar-image'>{<Avatar alt="Remy Sharp" src={`${BASE_URL}/${chatId ?chatId.image: ""}`}  sx={{ width: 56, height: 56 }} />}</span>
                           <h3>{chatId ?chatId.chatName: ""}</h3>
                           {chatId.users.map((member)=>{
                                            return(
                                                <span>{member.name === localStorage.getItem("name") ? "you" : member.name} {" , "}</span>
                                            )
                                        })}
                             <button onClick={() => handleEditGroup()}> edit</button>
                             <div>
         <button type='button' onClick={handleGroupDelete}>leave group</button>
       </div>   
                        </div>
                         {message.length === 0 ? <p>Message not found</p> :
                          <div >
                             <ScrollableChat messages={message}/>
                          </div>}
                        <div className='chatmessage'> 
                        {isTyping? (
                                <div>
                               <Lottie
                                    options={defaultOptions}
                                    // height={50}
                                    width={70}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                                </div>
                            ) : (
                                ""
                            )} 
                            <InputField id="message" name="message" className="form-control" placeholder="type here..." value={newMessage} onChange={(e) => typingHandler(e)} />
                            <Button type='submit' onClick={(e) =>handleSendMessage(e)}><img src={send} className="" alt="logo" /></Button>
                         
                        </div>
                     </div>:""}

                    </div>
                </div>
            </div>

            {/* ///////////    MODEL Create group    ///////////// */}
            <Modal
                open={createGroup}
                onClose={handleCreateGroup}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="create-channel">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <strong>Create Your Channel</strong>
                    </Typography>
                    <form className="mui-form" onSubmit={handleSubmit}>
                        <div className="form-outline mb-4 col-md-6">
                            <label htmlFor="photo">
                                {photo ? (
                                    $imagePreview = <Avatar alt="Remy Sharp" src={photo} sx={{ width: 56, height: 56 }} />
                                ) : (
                                    $imagePreview = <div className="previewText"> <Avatar alt="Remy Sharp" src={`${photo}`} sx={{ width: 56, height: 56 }} /> <i className="fa fa-camera" style={{ "fontSize": "35px" }}></i></div>
                                )}
                            </label>
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                className="form-control"
                                style={{ display: "none" }}
                                onChange={(e) => _handleImageChange(e)}
                            />
                        </div>
                        <div className="mui-textfield">
                            <input type="text" placeholder='Enter Your Group Name' value={groupName} onChange={(e) => setGropName(e.target.value)} />
                        </div>
                        <div >
                            <FormControl className={classes.formControl}>
                                <InputLabel id="mutiple-select-label">Multiple Select</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple
                                    value={selected}
                                    onChange={handleChange}
                                    MenuProps={MenuProps}
                                >
                                    {onlyCounsellorDetail.map((name) => (
                                        <MenuItem
                                            key={name._id}
                                            value={name._id}
                                        >
                                            {name.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="btndesign text-right">
                            <button
                                type="button"
                                className="btn btn-transparent"
                                onClick={handleCreateGroup}
                            >CLOSE</button>
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="SAVE"
                            />

                        </div>
                    </form>
                </Box>
            </Modal>

            {/* ////////////// Modal Edit Exist Group ////////////// */}
           
            <Modal
                open={editModal}
                onClose={handleEditGroup}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <strong>Update Your Channel</strong>
                    </Typography>
                    <form className="mui-form" onSubmit={handleEditSubmit}>
                    {groupChatData  && groupChatData.map((item) => {
                       
                        return(<>

                        <div className="form-outline mb-4 col-md-6">
                            <label htmlFor="photo">
                                {photo ? (
                                    $imagePreview = <Avatar alt="Gmy Sharp" src={`${photo}`} sx={{ width: 56, height: 56 }} />
                                ) : (
                                    $imagePreview = <div className="previewText"> <Avatar alt="Remy Sharp" src={`${BASE_URL}/${item.image}`} sx={{ width: 56, height: 56 }}  /> <i className="fa fa-camera" style={{ "fontSize": "35px" }}></i></div>
                                )}
                            </label>
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                className="form-control"
                                style={{ display: "none" }}
                                onChange={(e) => _handleImageChange(e)}
                            />
                        </div>
                        <div className="mui-textfield">
                            <input type="text" placeholder={item.chatName} value={groupName} onChange={(e) => {setGropName(e.target.value !== "" ?e.target.value :item.chatName)}} />
                        </div>
                        <div>
                            {item.users.map((ele)=>{
                                 
                                return(
                                    <span>{" "}
                                       {ele.name === localStorage.getItem("name") ? "": <Chip label={ele.name === localStorage.getItem("name") ? "" : ele.name} onDelete={() => handleRemoveMember(ele,item)} />}
                                      
                                    </span>
                                    
                                )
                            })}
                        </div>
                        <div >
                            
                            <FormControl className={classes.formControl}>
                                <InputLabel id="mutiple-select-label">Multiple Select</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label"
                                    id="demo-multiple-name"
                                    multiple
                                    value={selected}
                                    onChange={handleChange}
                                    MenuProps={MenuProps}
                                >
                                    {onlyCounsellorDetail.map((name) => {
                                        return(
                                        <MenuItem
                                            key={name._id}
                                            value={name._id}
                                        >
                                            {name.name}
                                        </MenuItem>
                                    )})}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="btndesign text-right">
                            <button
                                type="button"
                                className="btn btn-transparent"
                                onClick={handleEditGroup}
                            >CLOSE</button>
                            <input
                                type="submit"
                                className="btn btn-primary"
                                value="SAVE"
                            />

                        </div>
                       </> )
                    })}
                    </form>
                </Box>
            </Modal>


        </React.Fragment>
    )
}

export default Chat
