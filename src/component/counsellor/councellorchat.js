import React, { Component,useEffect,useRef,useState, } from 'react';
import Sidebar from './sidebar';
import ImageAvatars from './header';
import { authHeader } from '../../comman/authToken';
import { API, BASE_URL, SOCKET_URL } from '../../config/config';
import { Avatar,Button } from '@mui/material';
import SearchBar from 'material-ui-search-bar';
import axios from 'axios';
import Example from '../../comman/loader';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from '../../comman/inputField';
import ScrollableChat from './scrollableChat';
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../comman/12966-typing-indicator.json";
import PushNotification from './pushnotification';
toast.configure();

const CouncellorChat = () => {
      
    const [counsellorDetail, setCounsellorDetail] = useState([]);
	  const [loading, setLoading] = useState(true);
    const [search,setSearch]=useState('');
    const [chatId,setChatId]=useState('');
    const [message,setMessage]=useState([]);
    const [newMessage,setNewMessage]=useState();
    const [socketConnecttion,setSocketConnected] = useState(false);
    const [typing,setTyping]=useState(false);
    const [isTyping,setIsTyping]=useState(false);
    const [counsellorDet,setCounsellorDet]=useState([]);
    const [GroupDet,setGroupDet]=useState([]);    


    var socket,selectedChatCompare;  
    
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
      
        useEffect(() =>{
          socket = io(SOCKET_URL) ;
          socket.emit("setup",localStorage.getItem("id"));
          socket.on("connected",() => setSocketConnected(true));
          socket.on("typing",() => setIsTyping(true));
          socket.on("stop typing",() => setIsTyping(false));
        fetchMessages();

        },[]);
      
      useEffect(()=>{
        handleGetCounsellorAndGroups();
        handleGetCounsellor();
        setSearch('');
        
      },[])
    
      useEffect(() => {
        fetchMessages();
        selectedChatCompare = chatId;
      }, [chatId]);
    
      
      useEffect(() => {
        socket?.on("message recieved",(newMessageReceived)=>{
          fetchMessages();
    
                //   setMessage([...message, newMessageReceived]);
                  message.push(newMessageReceived)
              });
    })
      
    const handleGetCounsellor = () =>{
		fetch(API.getAllUser,{headers:authHeader()}).then((a) => {
            if(a.status === 200 ){
				setLoading(false);
				return a.json();
			}else{
				setLoading(true);
			}
		}).then((data) => {
            setCounsellorDetail(data && data.filter((e) => (e._id !== localStorage.getItem("id"))))
		})
	}

  const handleGetCounsellorAndGroups = () =>{
		fetch(`${API.allGCs}/${localStorage.getItem('id')}`,{headers:authHeader()}).then((a) => {
            if(a.status === 200 ){
				setLoading(false);
				return a.json();

			}else{
				setLoading(true);
			}
		}).then((data) => {
            const dat1 = data && data[0].filter((e) => (e._id !== localStorage.getItem("id")));
            const dat2 = data[1].filter((e) => (e._id !== localStorage.getItem("id")));
            Array.prototype.push.apply(dat1,dat2);
            setCounsellorDet(dat1);
          
		})
	}
    

    const handleSearch = async(data) =>{
        setSearch(data);
		if(data !== ""){
            await axios.get(`${API.counsellorSearch}/${data}`,{headers:authHeader()})
			.then((data) => {
                const dataCouncellor = data.data.data.filter((e) => ( e._id !== localStorage.getItem("id")))
				setCounsellorDetail(dataCouncellor)	   
		    })
		    .catch((err) => {
				setCounsellorDetail([])	
			});
		}
		else { 
        handleGetCounsellor();
		} 
	  }

      const handleSelectChatUser = async(recieverId) =>{
        var chatid ;
        var keys =  Object.keys(recieverId);
   
        if(keys.indexOf("isGroupChat") !== -1)  
        {         
              
                 chatid = recieverId._id;
                 setChatId(recieverId);
                 fetchMessages();
                 handleGetCounsellorAndGroups();
         }   
         else  
         {  
        setMessage([]);
        const reqData ={
            userId: localStorage.getItem("id"),
            recieverId:recieverId._id,
        }

         await axios({
              method: "post",
              url: `${API.accessChatByChatId}`,
            data: reqData,
            headers: authHeader(),
          }).then((res)=>{
			          fetchMessages();
                setChatId(res)
            }).catch((err)=>{
                toast.error("Something went wrong")
            })
          }
      }

        const handleSendMessage = async(e) => {
         
          socket = io(SOCKET_URL) ;
          socket.on("connected",() => {setSocketConnected(true)});
          if(newMessage){
            socket.emit("stop typing", (chatId.data ? chatId.data._id : chatId._id));
            try{
                const reqData ={
                   chatId: chatId.data?chatId.data._id:chatId._id,
                   content:newMessage,
                   senderId: localStorage.getItem("id"),
               }
              setNewMessage("")
              const request = await axios({
                  method: 'post',
                  url: `${API.sendMessage}`,
                  data: reqData,
                  headers: authHeader(),
              })
              socket.emit("message",request.data);
        fetchMessages();

              setMessage([...message, request.data]);
            }
              catch(error){
                  toast.error("Message not send") 
                }

        }
    }
    
    const fetchMessages = async () =>{
      console.log(chatId,"dd")
       console.log(chatId.data," fetchMessages();")
       setMessage([])
       
          if(!chatId) {
            return;
          }
          else if(chatId){
            if(chatId.isGroupChat === true){
              try{
                setLoading(true)
                const data = await axios.get(`${API.getMessage}/${chatId._id}`,{headers:authHeader()})
                setMessage(data.data);
                setLoading(false);
                socket.emit("join chat",chatId.data._id);
              }
              catch(error) {
                
            };
            }
            else if (chatId.data.isGroupChat === false){
              setMessage([])
              try{
                setLoading(true)
                const data = await axios.get(`${API.getMessage}/${chatId.data._id}`,{headers:authHeader()})
                setMessage(data.data);
                setLoading(false);
                socket.emit("join chat",chatId.data._id);
              }
              catch(error) {
                
            };
            }

          }
        
      }
    
    const typingHandler = (e) =>{
      
        setNewMessage(e.target.value);
         
          if(!socketConnecttion) return;
        socket = io(SOCKET_URL) ;
          socket.on("connected",() => {setSocketConnected(true)});
        //   if(!typing){
              setTyping(true);
              socket?.emit("typing",(chatId.data?chatId.data._id:chatId._id))
        //   }
          let lastTypingTime = new Date().getTime();
          var timerLength = 1000;
          setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
              socket?.emit("stop typing", (chatId.data ? chatId.data._id : chatId._id));
              setTyping(false);
            }
          }, timerLength);

      }

     
      const receivername = chatId && chatId.data && chatId.data.users && chatId.data.users.filter((e) => (e._id !== localStorage.getItem("id")));
    return ( 
        <React.Fragment>
        <div className='col-md-4 col-lg-2'><Sidebar/></div>
        <div className='col-md-8 col-lg-10 mr-30'>
            <div className='header'> <ImageAvatars/></div>
			<PushNotification/>
            <div className='heading '>
                    <h1 className='mt-5'>
                       <span className='icon'></span>
                       Chat
                    </h1>
            </div>  
            <div className='chat d-flex mt-4 border-top'>
                <div className='chat-left col-md-2'>
                   <div className='mt-3'>
                       <h3>Message</h3>
                       <SearchBar
						value={search}
						onChange={(newValue) => handleSearch( newValue )}
						placeholder='Search Counsellor'/>
                </div>
                   <div className="createpersonal">
                       <ul>
                           {!loading ?counsellorDet && counsellorDet.length !== 0 ? counsellorDet.map((item)=>{
                               return(
                                <li key={item._id}>
                                <span className='avtarimage' onClick={() => {handleSelectChatUser(item)}}>{<Avatar alt="Remy Sharp" src={`${BASE_URL}/${item.image}`} sx={{ width: 56, height: 56 }} /> } {item && item.name?item.name:item.chatName} {" "} {item && item.lastname?item.lastname:""}</span> 
                                {(item.chatName || item.readBy === 0) ? "" :<span className='notfication'>{item.readBy}</span>}
                            </li>
                               )
                           }): <p>Record not found</p>:<Example/>}
                       </ul>
                   </div>
                </div>
                <div className='chat-right col-md-10 border-left'> 
                    {/* counsellor chat header */}
                    {chatId ? 
                    chatId && chatId.data && chatId.data.isGroupChat === false ?
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
                            <Button type='submit' onClick={(e) =>handleSendMessage(e)}>SEND</Button>
                         
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
                            <Button type='submit' onClick={(e) =>handleSendMessage(e)}>SEND</Button>
                         
                        </div>
                     </div>:""}

                </div>

            </div>
        </div>
         
    </React.Fragment>
     );
}
 
export default CouncellorChat;