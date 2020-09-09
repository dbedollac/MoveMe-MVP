import React,{useContext} from 'react'
import AvisoPrivacidad0 from '../Atoms/AvisoPrivacidad0'
import './AvisoPrivacidad.css'
import Header from '../Molecules/Header'

function TerminosCondiciones() {

  return(
    <div>
      <Header/>
      <div className='AvisoPrivacidad-container'>
        <AvisoPrivacidad0 />
      </div>
    </div>
  )
}

export default TerminosCondiciones
