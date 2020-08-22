import React, { useState, useContext, useEffect, useCallback} from "react";
import { QuestionCircle, PlayFill,CameraVideoFill,Cart3, Receipt, AwardFill, CollectionPlayFill, Calendar3Fill, Wallet2, PersonSquare, ExclamationCircleFill, GearFill, ArrowLeftRight, HouseDoorFill} from 'react-bootstrap-icons';
import {DropdownButton, Dropdown} from 'react-bootstrap'
import {db, auth} from "../../Config/firestore";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import {Modal, Button} from 'react-bootstrap'
import Login from '../Forms/Login'
import Signup from '../Forms/Signup'
import { useMediaQuery } from 'react-responsive'
import './NavBarInstructors.css'


function NavBar(props) {
  const { usuario } = useContext(Auth);
  const [show, setShow] = useState(false);
  const [login,setLogin] = useState(false);
  const [profileName,setprofileName] = useState("")
  const [cartSize,setcartSize] = useState(null)
  const isMD = useMediaQuery({
    query: '(min-device-width: 768px)'
  })

  const handleClose = () =>{
      setShow(false)
      setLogin(false)
  }

  const handleShowLogIn = () =>{
      setShow(true)
      setLogin(true)
  }

  const handleShowSignIn = () =>{
      setShow(true)
  }

  const searchProfileName = () =>{
      var docRef = db.collection("Instructors").doc(usuario.uid);
      docRef.get().then((doc)=>{
      if (doc.exists) {
          setprofileName(doc.data().profileName)
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
  }

  useEffect(()=>{
    if (props.user) {
      var docRef = db.collection("Users").doc(usuario.uid)
      docRef.collection('ShoppingCart').onSnapshot(()=>{
        docRef.collection('ShoppingCart').get().then(snapshot => setcartSize(snapshot.size))
        .catch(error => console.log(error))
      })
    }
  },[props.user])

  if (props.instructor) {
  return(
      <div className="d-flex flex-row justify-content-between">
        <div className="col-2 d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
          <NavLink to='/instructor-profile' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 '>
              <PersonSquare size={isMD?'2em':'25px'}/>
              <p className='d-none d-md-block'>Perfil</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-2 col-md-3 d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
          <NavLink to='/misclases' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 '>
              <CollectionPlayFill size={isMD?'2em':'25px'}/>
              <p className='d-none d-md-block'>Mis Clases</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-2 col-md-3 d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
          <NavLink to='/monthly-program' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 '>
              <Calendar3Fill size={isMD?'2em':'25px'}/>
              <p className='d-none d-md-block'>Mi Reto</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-2  d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
          <NavLink to='/sales' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 '>
              <Wallet2 size={isMD?'2em':'25px'} />
              <p className='d-none d-md-block'>Ventas</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-1 d-flex flex-column align-items-center  justify-content-center">
          <DropdownButton  title='' variant='dark' onClick={searchProfileName} >
            <Dropdown.Item href={`coach-${profileName.replace(/ /g,'-')}/${usuario?usuario.uid:null}`}><AwardFill className='mr-2'/>Ver mi página comercial</Dropdown.Item>
            <Dropdown.Item href="/configuration-instructor"><GearFill className='mr-2'/>Configuración</Dropdown.Item>
            <Dropdown.Item href="/como-iniciar"><PlayFill className='mr-2'/>¿Cómo inicio?</Dropdown.Item>
            <Dropdown.Item href="mailto:ayuda@moveme.fitness"><QuestionCircle className='mr-2'/>Ayuda</Dropdown.Item>
            <Dropdown.Item href="/account-type"><ArrowLeftRight className='mr-2'/>Cambiar tipo de cuenta</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={()=> {auth.signOut()}}><ExclamationCircleFill className='mr-2'/>Cerrar sesión</Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
  )}else{
    if (props.user) {
      return(
        <div className="d-flex flex-row justify-content-between">
          <div className="col-2  d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
            <NavLink to='/market' className='text-center' activeClassName="navbar-selected">
              <div className='col-12 '>
                <HouseDoorFill size={isMD?'2em':'25px'} />
                <p className='d-none d-md-block'>Inicio</p>
              </div>
            </ NavLink>
          </div>
          <div className="col-2 col-md-3  d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
            <NavLink to='/clasesZoom' className='text-center' activeClassName="navbar-selected">
              <div className='col-12 '>
                <CameraVideoFill size={isMD?'2em':'25px'} />
                <p className='d-none d-md-block'>Clases Zoom</p>
              </div>
            </ NavLink>
          </div>
          <div className="col-2 col-md-3  d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
            <NavLink to='/misVideos' className='text-center' activeClassName="navbar-selected">
              <div className='col-12 '>
                <CollectionPlayFill size={isMD?'2em':'25px'} />
                <p className='d-none d-md-block'>Mis Videos</p>
              </div>
            </ NavLink>
          </div>
          <div className="col-2  d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
            <NavLink to='/carrito' className='text-center' activeClassName="navbar-selected">
              <div className='col-12 ' style={{position:'relative'}}>
                {cartSize?<div className='navbar-cart rounded col-4 d-flex flex-row justify-content-center align-items-center'>
                  {cartSize}</div>:null}
                <Cart3 size={isMD?'2em':'25px'} />
                <p className='d-none d-md-block'>Carrito</p>
              </div>
            </ NavLink>
          </div>
          <div className="col-1 d-flex flex-column align-items-center  justify-content-center">
                  <DropdownButton  title='' variant='dark'>
                    <Dropdown.Item href="/misCompras"><Receipt className='mr-2'/>Mis Compras</Dropdown.Item>
                    <Dropdown.Item href="mailto:ayuda@moveme.fitness"><QuestionCircle className='mr-2'/>Ayuda</Dropdown.Item>
                    <Dropdown.Item href="/account-type"><ArrowLeftRight className='mr-2'/>Cambiar tipo de cuenta</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={()=> {auth.signOut()}}><ExclamationCircleFill className='mr-2'/>Cerrar sesión</Dropdown.Item>
                  </DropdownButton>
          </div>
        </div>
            )
    }else {
      return(
        <div >
          {usuario?null:
          <div className='d-flex flex-row-reverse justify-content-end'>
            <HouseDoorFill size={'30px'} style={{cursor:'pointer'}} onClick={()=>{props.history.push('/')}} />
            <button className='btn-light btn-sm rounded mx-2' onClick={handleShowLogIn}>Ingresar</button>
            <button className='btn-primary btn-sm rounded' onClick={handleShowSignIn}>Registrarse</button>
          </div>
            }
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >

            <Modal.Body >
              {login?<Login />:<Signup />}
            </Modal.Body>

          </Modal>
        </div>
      )
    }
  }
}

export default withRouter(NavBar)
