import React,{useContext} from 'react'
import AvisoPrivacidad0 from '../Atoms/AvisoPrivacidad0'
import './AvisoPrivacidad.css'
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";

function TerminosCondiciones() {
  const { usuario } = useContext(Auth);

  return(
    <div>
      <Header empty={usuario?true:false}/>
      <div className='AvisoPrivacidad-container'>
        <AvisoPrivacidad0 />
      </div>
    </div>
  )
}

export default TerminosCondiciones
