import React, { Component } from 'react';

class Welcome extends Component {

  state={
    name: localStorage.getItem("name"),
    lastname: localStorage.getItem("lastname"),
  }
   
    render() { 
      (localStorage.getItem("role") === "manager") ?
        setTimeout(() => {
                window.location = "/dashboard";
          }, 2000) :  setTimeout(() => {
            window.location = "/councellordash";
      }, 2000)
        return (
            <>
            {localStorage.getItem("token") != null ? (
                <div className='welcome'>
                <div className='welcome-center'>
                  <img src={require("./images/welcome-icon.png")} />
                  {this.state.lastname === null ? <h2>Welcome {this.state.name}</h2> : 
                <h2>Welcome {this.state.name.charAt(0).toUpperCase() + this.state.name.slice(1) }{" "}{this.state.lastname.charAt(0).toUpperCase() + this.state.lastname.slice(1)}</h2>}
                </div>
                
               </div>
               
              ) : (
                <div className='welcome' style={{display:"none"}}>
              <div className='welcome-center'>
                <img src={require("./images/welcome-icon.png")} />
                <h2>Welcome {this.state.name.charAt(0).toUpperCase() + this.state.name.slice(1) }{" "}{this.state.lastname.charAt(0).toUpperCase() + this.state.lastname.slice(1)}</h2>
              </div>
             </div>
              )}
              </>
        );
    }
}
 
export default Welcome;