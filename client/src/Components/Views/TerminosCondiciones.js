import React,{useContext} from 'react'
import TerminosCondiciones0 from '../Atoms/TerminosCondiciones0'
import './TerminosCondiciones.css'
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";

function TerminosCondiciones() {
  const { usuario } = useContext(Auth);

  return(
    <div>
      <Header empty={usuario?true:false}/>
      <div className='TerminosCondiciones-container'>
        <TerminosCondiciones0 />
      </div>
    </div>
  )
}

export default TerminosCondiciones
