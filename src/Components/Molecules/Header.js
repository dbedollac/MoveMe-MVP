import React from "react";
import './Header.css';
import { Button } from "antd";
import NavBar from "../Atoms/NavBar.js"
import {auth} from '../../Config/firestore'
import { withRouter } from "react-router";

function Header(props){

  if (props.type===0) {
    return(
      <header>
      <div className="col-12 col-sm-12 d-flex flex-row align-items-center">
        <div className="col-4 col-md-2">
          <img src="./logo.png" alt="Logo"/>
        </div>
        <div className="col-8 col-md-8 d-flex flex-row justify-content-center align-items-center">
          <h1>{props.title}</h1>
        </div>
      </div>
      </header>
    );
  } else {
    if (props.type===1) {
      return(
        <header>
        <div className="col-12 d-flex flex-row align-items-center" >
            <div className="col-6">
              <img src="./logo.png" alt="Logo"/>
            </div>
            <div className="col-4">
              <NavBar />
            </div>
            <div className="col-2">
              <Button onClick={() => {auth.signOut(); props.history.push("/")}} key="logout" type="primary">Cerrar Sesión</Button>,
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

export default withRouter(Header)
