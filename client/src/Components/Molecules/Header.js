import React from "react";
import './Header.css';
import NavBar from "./NavBarInstructors.js"
import { withRouter } from "react-router";
import logo from '../Views/Images/logo.png'

function Header(props){
      if (props.user) {
        return(
        <header className='fixed-top'>
        <div className="col-12 d-flex flex-row align-items-center " >
            <div className="col-2">
              <img src={logo} alt="Logo" onClick={()=>{props.history.push('/')}} style={{cursor:'pointer'}}/>
            </div>
            <div className="col-10">
              <NavBar user={true}/>
            </div>
        </div>
        </header>)
      }
     else {
      if (props.instructor) {
        return(
          <header className='fixed-top'>
          <div className="col-12 d-flex flex-row align-items-center " >
              <div className="col-2">
                <img src={logo} alt="Logo" onClick={()=>{props.history.push('/')}} style={{cursor:'pointer'}}/>
              </div>
              <div className="col-10">
                <NavBar instructor={true}/>
              </div>
          </div>
          </header>
        );
      }
       else {
      return(
        <header className='fixed-top'>
        <div className="col-12 d-flex flex-row align-items-center " >
            <div className="col-2">
              <img src={logo} alt="Logo" onClick={()=>{props.history.push('/')}} style={{cursor:'pointer'}}/>
            </div>
            <div className="col-7">
              <h1 className='text-center'>M O V E M E</h1>
            </div>
            <div className='col-3'>
              <NavBar/>
            </div>
        </div>
        </header>
      );
    }
  }
}

export default withRouter(Header)
