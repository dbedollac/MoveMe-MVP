import React from "react";
import { CollectionPlayFill, Calendar3Fill, Wallet2, PersonSquare, ExclamationCircleFill, GearFill, ArrowLeftRight} from 'react-bootstrap-icons';
import {DropdownButton, Dropdown} from 'react-bootstrap'
import {auth} from "../../Config/firestore";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import './NavBarInstructors.css'


function NavBar(props) {

  return(
      <div className="d-flex flex-row justify-content-between">
        <div className="col-2 d-flex flex-column align-items-center pt-2 navbar-option" >
          <NavLink to='instructor-profile' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 m-1 pt-1'>
              <PersonSquare size={'2em'}/>
              <p className="icon4">Perfil</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-2 d-flex flex-column align-items-center pt-2 navbar-option" activeClassName="navbar-selected" >
          <NavLink to='misclases' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 m-1 pt-1'>
              <CollectionPlayFill size={'2em'}/>
              <p>Mis Clases</p>
              </div>
          </ NavLink>
        </div>
        <div className="col-3 d-flex flex-column align-items-center pt-2 navbar-option" >
          <NavLink to='monthly-program' className='text-center col-12' activeClassName="navbar-selected">
            <div className='col-12 m-1 pt-1'>
              <Calendar3Fill size={'2em'}/>
              <p className='text-center'>Programa Mensual</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-2 d-flex flex-column align-items-center pt-2 navbar-option" >
          <NavLink to='sales' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 m-1 pt-1'>
              <Wallet2 size={'2em'} />
              <p>Ventas</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-2 d-flex flex-column align-items-center  justify-content-center">
          <DropdownButton  title='' id='secondary'>
            <Dropdown.Item href="configuration-instructor"><GearFill className='mr-2'/>Configuración</Dropdown.Item>
            <Dropdown.Item href="account-type"><ArrowLeftRight className='mr-2'/>Cambiar tipo de cuenta</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={()=> {auth.signOut()}}><ExclamationCircleFill className='mr-2'/>Cerrar sesión</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
  )
}

export default withRouter(NavBar)
