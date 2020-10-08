import React from "react";
import './Header.css';
import NavBar from "./NavBarInstructors.js"
import { withRouter } from "react-router";
import logo from '../Views/Images/logo.png'

function Header(props){
      if (props.instructor) {
        return(
          <header className='fixed-top'>
          <div className="col-12 d-flex flex-row align-items-center justify-content-between" >
              <img src={logo} alt="Logo" onClick={()=>{props.history.push('/')}} style={{cursor:'pointer'}}/>
              <div className="col-10">
                <NavBar instructor={true}/>
              </div>
          </div>
          </header>
        );
      }
     else {
       if (props.user) {
         return(
         <header className='fixed-top'>
         <div className="col-12 d-flex flex-row align-items-center justify-content-between " >
              <img src={logo} alt="Logo" onClick={()=>{props.history.push('/')}} style={{cursor:'pointer'}}/>
             <div className="col-10">
               <NavBar user={true}/>
             </div>
         </div>
         </header>)
       }
       else {
      return(
        <header className='fixed-top'>
        <div className="col-12 d-flex flex-row align-items-center justify-content-between pt-2 pt-md-0" >
            <img src={logo} alt="Logo" onClick={()=>{props.history.push('/')}} style={{cursor:'pointer'}}/>
            <div className='col-11 col-sm-3 ml-1 d-flex flex-row-reverse'>
              <NavBar/>
            </div>
        </div>
        </header>
      );
    }
  }
}

export default withRouter(Header)
