import React, { useEffect, useState } from 'react';
import { Avatar, Tooltip } from "@mui/material";
import moment from "moment";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/chatLogics";
import { API, BASE_URL } from "../../config/config";
import EditableLabel from 'react-inline-editing';
import axios from 'axios';
import { authHeader } from '../../comman/authToken';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const ScrollableChat = ({ messages }) => {

  const userId = localStorage.getItem("id");

  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [toggle, setToggle] = useState(false);

  const handleToggle = () =>{
    setToggle(true)
  }
  
  const handleFocus =(text) =>{
    setShow(prev => !prev)
  }
  
	const handleFocusOut =(text) =>{
  
    setShow(prev => !prev)
    
    const reqData ={
      content:text,
    }
  
    const res = axios({
      method: "put",
      url: `${API.updateMessage}/${data._id}`,
      data: reqData,
      headers: authHeader(),
    }).then((res)=>{
       
    }).catch((err)=>{
     toast.error("Something went wrong!")
    })

	}

	const handleDelete = async(id) =>{
    const del = await axios.delete(`${API.deleteMessage}/${id}`,{headers:authHeader()})
  
    if(del){
      toast.success("Selected message Deleted");
      window.location.reload();
      setToggle(false);
  }else{
   toast.error("Something went wrong");
  }  
	}


  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (

          <div style={{ display: "flex" }} key={m._id}>              
               
               <div style={{display:"none"}} >  
            {(isSameSender(messages, m, i, userId) ||
              isLastMessage(messages, i, userId)) && (
                        
                <Avatar
                  cursor="pointer"
                  alt="Remy Sharp"
                  src={`${BASE_URL}/${m.sender.image}`} 
                  sx={{ width: 30, height: 30 }} 
                  className="mr-1 mt-1 "  
                />
            
            )}
            {isSameSender(messages, m, i, userId) ? <p>{moment(m.createdAt).format("hh:mm A")}</p> :""}</div>
            <span onClick={() => {setData(m);handleToggle()}} 
              style={{
                backgroundColor: `${
                  m.sender._id === userId ? "#21BAFE" : "#EAE8E8"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, userId),
                marginTop: isSameUser(messages, m, i, userId) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginBottom:"20px",
              }}
            >
           {m && m.sender._id !== userId ? m.content : !toggle ? m.content:"" } 
            
              {m && m._id === m._id && m.sender._id === userId && toggle?  <EditableLabel text={m.content}
                                labelClassName='myLabelClass'
                                inputClassName='myInputClass'
                                inputWidth='100px'
                                inputHeight='25px'
                                labelFontSize='21px'
                                onFocus={handleFocus}
                                onFocusOut={handleFocusOut}
                                inputMaxLength={50}
                                
                                /> :""}
            </span>
            {console.log(toggle,"dddd")}
            
              {m && m._id === m._id && m.sender._id === userId && toggle  ?<><span className='mt-3 m-2' onClick={() => handleDelete(m._id)}><img src={require('../images/delet.png')} /></span></> : ""} 
            
          </div>
        ))}
      
    </ScrollableFeed>
  );
};

export default ScrollableChat;