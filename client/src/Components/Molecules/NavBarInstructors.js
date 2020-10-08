import React, { useState, useContext, useEffect, useCallback} from "react";
import { Globe, FileEarmarkMedicalFill,ShieldFillCheck,QuestionCircle, PlayFill,CameraVideoFill,Cart3, Receipt, AwardFill, CollectionPlayFill, Calendar3Fill, Wallet2, PersonSquare, ExclamationCircleFill, GearFill, ArrowLeftRight, HouseDoorFill} from 'react-bootstrap-icons';
import {DropdownButton, Dropdown} from 'react-bootstrap'
import {db, auth} from "../../Config/firestore";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import {Modal, Button} from 'react-bootstrap'
import Login from '../Forms/Login'
import Signup from '../Forms/Signup'
import ChangeLanguage from '../Atoms/ChangeLanguage'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next';
import './NavBarInstructors.css'


function NavBar(props) {
  const { usuario } = useContext(Auth);
  const { t , i18n } = useTranslation()
  const [show, setShow] = useState(false);
  const [login,setLogin] = useState(false);
  const [profileName,setprofileName] = useState("")
  const [cartSize,setcartSize] = useState(null)
  const isMD = useMediaQuery({
    query: '(min-device-width: 768px)'
  })

  const changeLanguage = () => {
    if (i18n.language==='es') {
      i18n.changeLanguage('en')
    }else {
      i18n.changeLanguage('es')
    }
  }

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
              <p className='d-none d-md-block'>{t('header.1','Perfil')}</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-2 col-md-3 d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
          <NavLink to='/myClasses' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 '>
              <CollectionPlayFill size={isMD?'2em':'25px'}/>
              <p className='d-none d-md-block'>{t('header.2','Mis Clases')}</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-2 col-md-3 d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
          <NavLink to='/monthly-program' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 '>
              <Calendar3Fill size={isMD?'2em':'25px'}/>
              <p className='d-none d-md-block'>{t('header.3','Mi Reto')}</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-2  d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
          <NavLink to='/sales' className='text-center' activeClassName="navbar-selected">
            <div className='col-12 '>
              <Wallet2 size={isMD?'2em':'25px'} />
              <p className='d-none d-md-block'>{t('header.4','Ventas')}</p>
            </div>
          </ NavLink>
        </div>
        <div className="col-1 d-flex flex-column align-items-center  justify-content-center">
          <DropdownButton  title='' variant='secondary' onClick={searchProfileName} >
            <Dropdown.Item href={`coach-${profileName.replace(/ /g,'-')}/${usuario?usuario.uid:null}`}><AwardFill className='mr-2'/>{t('header.5','Ver mi página comercial')}</Dropdown.Item>
            <Dropdown.Item href="/configuration-instructor"><GearFill className='mr-2'/>{t('header.6','Configuración')}</Dropdown.Item>
            <Dropdown.Item href="/start"><PlayFill className='mr-2'/>{t('header.7','¿Cómo inicio?')}</Dropdown.Item>
            <Dropdown.Item href="/help"><QuestionCircle className='mr-2'/>{t('header.8','Ayuda')}</Dropdown.Item>
            <Dropdown.Item onClick={changeLanguage} className='d-flex flex-row align-items-center'><Globe className='mr-2'/><ChangeLanguage color='black'/></Dropdown.Item>
            <Dropdown.Item href="/account-type"><ArrowLeftRight className='mr-2'/>{t('header.9','Cambiar tipo de cuenta')}</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/terms-and-conditions"><FileEarmarkMedicalFill className='mr-2'/>{t('header.10','Términos y Condiciones')}</Dropdown.Item>
            <Dropdown.Item href="/privacy-notice"><ShieldFillCheck className='mr-2'/>{t('header.11','Aviso de Privacidad')}</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={()=> {auth.signOut()}}><ExclamationCircleFill className='mr-2'/>{t('header.12','Cerrar sesión')}</Dropdown.Item>
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
                <p className='d-none d-md-block'>{t('header.13','Inicio')}</p>
              </div>
            </ NavLink>
          </div>
          <div className="col-2 col-md-3  d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
            <NavLink to='/ZoomClasses' className='text-center' activeClassName="navbar-selected">
              <div className='col-12 '>
                <CameraVideoFill size={isMD?'2em':'25px'} />
                <p className='d-none d-md-block'>{t('header.14','Clases Zoom')}</p>
              </div>
            </ NavLink>
          </div>
          <div className="col-2 col-md-3  d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
            <NavLink to='/myVideos' className='text-center' activeClassName="navbar-selected">
              <div className='col-12 '>
                <CollectionPlayFill size={isMD?'2em':'25px'} />
                <p className='d-none d-md-block'>{t('header.15','Mis Videos')}</p>
              </div>
            </ NavLink>
          </div>
          <div className="col-2  d-flex flex-column align-items-center pt-md-2 pt-4 navbar-option" >
            <NavLink to='/cart' className='text-center' activeClassName="navbar-selected">
              <div className='col-12 ' style={{position:'relative'}}>
                {cartSize?<div className='navbar-cart rounded col-4 d-flex flex-row justify-content-center align-items-center'>
                  {cartSize}</div>:null}
                <Cart3 size={isMD?'2em':'25px'} />
                <p className='d-none d-md-block'>{t('header.16','Carrito')}</p>
              </div>
            </ NavLink>
          </div>
          <div className="col-1 d-flex flex-column align-items-center  justify-content-center">
                  <DropdownButton  title='' variant='secondary'>
                    <Dropdown.Item href="/purchases"><Receipt className='mr-2'/>{t('header.17','Mis Compras')}</Dropdown.Item>
                    <Dropdown.Item href="/help"><QuestionCircle className='mr-2'/>{t('header.8','Ayuda')}</Dropdown.Item>
                    <Dropdown.Item onClick={changeLanguage} className='d-flex flex-row align-items-center'><Globe className='mr-2'/><ChangeLanguage color='black'/></Dropdown.Item>
                    <Dropdown.Item href="/account-type"><ArrowLeftRight className='mr-2'/>{t('header.18','Cambiar tipo de cuenta')}</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/terms-and-conditions"><FileEarmarkMedicalFill className='mr-2'/>{t('header.10','Términos y Condiciones')}</Dropdown.Item>
                    <Dropdown.Item href="/privacy-notice"><ShieldFillCheck className='mr-2'/>{t('header.11','Aviso de Privacidad')}</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={()=> {auth.signOut()}}><ExclamationCircleFill className='mr-2'/>{t('header.12','Cerrar sesión')}</Dropdown.Item>
                  </DropdownButton>
          </div>
        </div>
            )
    }else {
      return(
        <div >
          {usuario?
            <div className='d-flex flex-row-reverse justify-content-end align-items-center'>
              <div onClick={changeLanguage}><ChangeLanguage color='#595959' fontSize='small'/></div>
            </div>
          :
            <div className='d-flex flex-row-reverse justify-content-end align-items-center'>
              <div onClick={changeLanguage}><ChangeLanguage color='#595959' fontSize='small'/></div>
              <HouseDoorFill color='#595959' size={'30px'} style={{cursor:'pointer'}} onClick={()=>{props.history.push('/')}} className='mr-2'/>
              <button className='btn-outline-secondary btn-sm mx-2' onClick={handleShowLogIn}>{t('header.24','Ingresar')}</button>
              <button className='btn-outline-primary btn-sm' onClick={handleShowSignIn}>{t('header.27','Registrarse')}</button>
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
