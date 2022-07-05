import { useEffect, useRef, useState } from "react";
import Stack from '@mui/material/Stack';
import { API } from "../../config/config";
import axios from "axios";
import { authHeader } from "../../comman/authToken";


export const Timerest = (props) => {
  const [timer, setTimer] = useState(0);
  const [start, setStart] = useState(false);
  const firstStart = useRef(true);
  const tick = useRef();

  useEffect(() => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current;
      return;
    }
    if (start) {
      tick.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else {
      clearInterval(tick.current);
    }

    return () => clearInterval(tick.current);
  }, [start]);

  const toggleStart = async() => {
    setStart(true);
     await axios({
			method: "put",
			url: `${API.timerStart}/${props.idd}`,
			headers: authHeader(),
		}).catch((err) => { });

    // setTimeout(() => {
    //     alert("3 min voer")
    //     }, 180000);
  };

 const toggleStop = async() => {
    setStart(false);
    await axios({
			method: "put",
			url: `${API.timerStop}/${props.idd}`,
			headers: authHeader(),
		}).then((res)=>{
      // window.location.reload();
    })
    .catch((err) => { });
    
  };



  const dispSecondsAsMins = (seconds) => {

    let divisor_for_minutes = seconds % (60 * 60);
    const mins = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    const seconds_ = Math.ceil(divisor_for_seconds);

// console.log(mins,seconds,"DDD")
    return (
      (mins === 0
        ? "00"
        : mins === 1
        ? "01"
        : mins === 2
        ? "02"
        : mins === 3
        ? "03"
        : mins === 4
        ? "04"
        : mins === 5
        ? "05"
        : mins === 6
        ? "06"
        : mins === 7
        ? "07"
        : mins === 8
        ? "08"
        : mins === 9
        ? "09"
        : mins.toString()) +
      ":" +
      (seconds_ === 0
        ? "00"
        : seconds_ === 1
        ? "01"
        : seconds_ === 2
        ? "02"
        : seconds_ === 3
        ? "03"
        : seconds_ === 4
        ? "04"
        : seconds_ === 5
        ? "05"
        : seconds_ === 6
        ? "06"
        : seconds_ === 7
        ? "07"
        : seconds_ === 8
        ? "08"
        : seconds_ === 9
        ? "09"
        : seconds_.toString())
    );
  };

  return (
    <div className="pomView">
    
        <Stack direction="row" spacing={1} margin="5px 14px">
          {!start ? <button  onClick={toggleStart}>start</button> :
            <button onClick={toggleStop}>stop</button>}
    {" "}
        <span style={{color:"red",margin:"7px 2px" }}>
            {dispSecondsAsMins(timer)}
        </span>
      
      </Stack>
         
       
    </div>
  );
};

// function getLocalStream() {
//     navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
//         window.localStream = stream;
//         window.localAudio.srcObject = stream;
//         window.localAudio.autoplay = true;
//     }).catch( err => {
//         console.log("you got an error:" + err)
//     });
// }
// getLocalStream(); 

