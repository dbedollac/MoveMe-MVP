import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import CreateZoomMeeting from '../Atoms/CreateZoomMeeting'
import './InstructorProfile.css'

class InstructorProfile extends React.Component {
  constructor(props) {
      super(props);
      this.state = { apiResponse: "" };
  }

  callAPI=()=>{
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }));
  }

  componentWillMount() {
      this.callAPI();
  }

  render(){
    return (
      <div>
        <Header type={1}/>
          <div className='InstructorProfile-container'>
            <h1> Perfil del Instructor </h1>
            <p>{this.state.apiResponse}</p>
            <CreateZoomMeeting claseID='clase1' monthlyProgram={false}/>
          </div>
      </div>
    )
  }
}

export default InstructorProfile
