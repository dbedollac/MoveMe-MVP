import React from 'react';
import { CollectionPlayFill } from 'react-bootstrap-icons';
import { Calendar3Fill } from 'react-bootstrap-icons';
import { Wallet2 } from 'react-bootstrap-icons';
import { PersonSquare } from 'react-bootstrap-icons';


function NavBar() {
  return(
      <div className="d-flex flex-row justify-content-between ">
        <div className="d-flex flex-column align-items-center pt-2">
          <CollectionPlayFill size={30}/>
          <p>Mis Clases</p>
        </div>
        <div className="d-flex flex-column align-items-center pt-2">
          <Calendar3Fill size={30}/>
          <p>Programa Mensual</p>
        </div>
        <div className="d-flex flex-column align-items-center pt-2">
          <Wallet2 size={30} />
          <p>Ventas</p>
        </div>
        <div className="d-flex flex-column align-items-center pt-2">
          <PersonSquare size={30}/>
          <p className="icon4">Perfil</p>
        </div>
      </div>
  )
}

export default NavBar
