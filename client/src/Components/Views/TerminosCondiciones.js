import React,{useContext} from 'react'
import TerminosCondiciones0 from '../Atoms/TerminosCondiciones0'
import './TerminosCondiciones.css'
import Header from '../Molecules/Header'

function TerminosCondiciones() {

  return(
    <div>
      <Header />
      <div className='TerminosCondiciones-container'>
        <TerminosCondiciones0 />
      </div>
    </div>
  )
}

export default TerminosCondiciones
