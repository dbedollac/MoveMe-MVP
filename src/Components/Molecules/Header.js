import React from 'react';
import './Header.css';
import NavBar from "../Atoms/NavBar.js"

function Header(props){
  if (props.type===0) {
    return(
      <header>
      <div className="col-12 col-sm-12 d-flex flex-row align-items-center">
        <div className="col-4 col-md-2">
          <img src="./logo.png" alt="Logo"/>
        </div>
        <div className="col-8 col-md-8 d-flex flex-row justify-content-center align-items-center">
          <h1>M O V E M E</h1>
        </div>
      </div>
      </header>
    );
  } else {
    if (props.type===1) {
      return(
        <header>
        <div className="col-12 d-flex flex-row align-items-center" >
            <div className="col-8">
              <img src="./logo.png" alt="Logo"/>
            </div>
            <div className="col-4">
              <NavBar />
            </div>
        </div>
        </header>
      );
    } else {
      return(
        <header>
        <div className="col-12 d-flex flex-row align-items-center" >
            <div className="col-8">
              <img src="./logo.png" alt="Logo"/>
            </div>
            <div className="col-4">
              <NavBar />
            </div>
        </div>
        </header>
      );
    }
  }
}

export default Header
