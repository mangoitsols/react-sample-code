import React, { useState, useRef } from "react";
import { Avatar, Stack } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import Divider from "@mui/material/Divider";
toast.configure();

export default function ImageAvatars() {

  const handleLogout = () => {
    localStorage.clear("token");
    localStorage.clear("name");
    localStorage.clear("role");
    toast.success("Logout Successfully");
    setTimeout(() => {
      window.location = "/";
    }, 1000);
  };

  const [isActive, setActive] = useState("true");
  const [name, setName] = useState(localStorage.getItem("name"));
  const [lastname, setLastname] = useState(localStorage.getItem("lastname"));
  const ToggleClass = () => {
    setActive(!isActive);
  };

  return (
    <React.Fragment>
      <div className="securityAlert">
        <div>
          <img className="mr-2" src={require("../../images/security.png")} />
          Security Alert
        </div>
        <ul>
          <li>
            {" "}
            <img src={require("../../images/red alert.png")} />{" "}
          </li>
          <li>
            {" "}
            <img src={require("../../images/yellow alert.png")} />{" "}
          </li>
          <li>
            {" "}
            <img src={require("../../images/black alert.png")} />{" "}
          </li>
        </ul>
      </div>
      <Stack direction="row" spacing={2}>
        <Avatar
          alt="Remy Sharp"
          src={require("../../images/avatar/Avatar.jpg")}
          sx={{ width: 56, height: 56 }}
        />
        <span>
          <div onClick={ToggleClass}>
          <strong>{name.charAt(0).toUpperCase() + name.slice(1)}{" "}{lastname.charAt(0).toUpperCase() + lastname.slice(1)}</strong>
          <small> {localStorage.getItem("role")} </small>
          <span className="arrow" >
            <ArrowBackIosOutlinedIcon />
          </span>
          </div>
          <div className={isActive ? "toggleNone" : "active"}>
            <div className="myprofileToggle">
              <Avatar
                alt="Remy Sharp"
                src={require("../../images/avatar/Avatar.jpg")}
                sx={{ width: 56, height: 56 }}
              />
              <span>
                <strong>{name.charAt(0).toUpperCase() + name.slice(1)}{" "}{lastname.charAt(0).toUpperCase() + lastname.slice(1)}</strong>
                <small> {localStorage.getItem("role")} </small>
              </span>
              <a href="/councellordash">Counsellor Profile</a>
              <Divider />
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </span>
      </Stack>
    </React.Fragment>
  );
}
