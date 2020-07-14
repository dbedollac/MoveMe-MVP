import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import './InstructorProfile.css'

function InstructorProfile(props) {

    return (
      <div>
        <Header type={1}/>
          <div className='InstructorProfile-container'>
            <h1> Perfil del Instructor </h1>
            <div className='col-4'>
            </div>
          </div>
      </div>
    )
}

export default InstructorProfile
