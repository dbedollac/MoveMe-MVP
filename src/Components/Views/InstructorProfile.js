import React from 'react';
import Header from '../Molecules/Header'
import './InstructorProfile.css'

class InstructorProfile extends React.Component {
  constructor() {
    super()
  }

  render(){
    return (
      <div>
        <Header type={1}/>
          <div className='InstructorProfile-container'>
            <h1> Perfil del Instructor </h1>
          </div>
      </div>
    )
  }
}

export default InstructorProfile
