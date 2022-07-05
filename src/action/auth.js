import { API } from "../config/config";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authHeader } from "../comman/authToken";
toast.configure();

export function login(data, callback) {
    const request = axios.post(`${API.login}`, data);
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
        if(error.response.status === 400){
          if(error.response.data.message === "email not found"){
            toast.error("Email does not exist");
          }
          else if(error.response.data.message === "password is incorrect"){
            toast.error("Password is incorrect");
          }
          else if(error.response.data.message === "user name not found"){
            toast.error("Username is not found");
          }
          
        }
          callback(error);
        });
    };
  }

  export function sendMail(data, callback) {
    const request = axios.post(`${API.sendMail}`, data);
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
        if(error.response.status === 400){
          toast.error("Email not found");
        }
          callback(error);
        });
    };
  }

  export function changePassword(data, callback) {
    const request = axios({
      method: "post",
      url: `${API.changePassword}`,
      data: data,
      headers: authHeader(),
    });
    return (dispatch) => {
      request  
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
        if(error.response.status === 400){
          toast.error(error.response.data.message);
        }
          callback(error);
        });
    };
  }

  export function createPin(data, callback) {
    const request = axios({
      method: "post",
      url: `${API.createPin}`,
      data: data,
      headers: authHeader(),
    });
    return (dispatch) => {
      request
        .then((res) => {
          callback(res);
        })
        .catch(function (error) {
        if(error.response.status === 400){
          toast.error(error.response.data.message);
        }
          callback(error);
        });
    };
  }
