import React from 'react';
import Header from '../Molecules/Header'

class InstructorProfile extends React.Component {
  constructor() {
    super()
  }

  render(){
    return (
      <div>
        <Header type={1} />
        <h1> Perfil del Instructor </h1>
      </div>
    )
  }
}

export default InstructorProfile
