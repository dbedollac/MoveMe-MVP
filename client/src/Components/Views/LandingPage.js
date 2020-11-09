import React,{useState,useEffect,useContext} from 'react'
import { withRouter } from "react-router";
import { Auth } from "../../Config/AuthContext";
import logo from '../Views/Images/logo.png'
import {storage} from "../../Config/firestore.js"
import facebookLogo from '../Views/Images/Facebook.png'
import instagramLogo from '../Views/Images/Instagram.png'
import textura from '../Views/Images/MM TEXTURA.jpg'
import { useMediaQuery } from 'react-responsive'
import {Modal} from 'react-bootstrap'
import ReactPlayer from 'react-player'
import Signup from '../Forms/Signup'
import MessengerCustomerChat from 'react-messenger-customer-chat';
import './LandingPage.css'

function LandingPage(props) {
  const { usuario } = useContext(Auth);
  const [instructorVideo, setinstructorVideo] = useState(null)
  const [userVideo, setuserVideo] = useState(null)
  const [instructorPicture, setinstructorPicture] = useState(null)
  const [userPicture, setuserPicture] = useState(null)
  const [show, setShow] = useState(false);
  const [who,setWho] = useState(null)
  const [signup,setSignup] = useState(false)
  const isMD = useMediaQuery({
    query: '(min-device-width: 768px)'
  })

  const handleModal = (e) =>{
      setShow(!show)
      setWho(e.target.name)
      setSignup(false)
  }

  useEffect(()=>{

      storage.ref("LandingPage")
               .child('LP-Coach.mp4')
               .getDownloadURL()
               .then(url => {
                 setinstructorVideo(url)
              }).catch(function (error) {
                console.error("Error", error);
              })

      storage.ref("LandingPage")
               .child('LP-User.mp4')
               .getDownloadURL()
               .then(url => {
                 setuserVideo(url)
              }).catch(function (error) {
                console.error("Error", error);
              })

      storage.ref("LandingPage")
               .child('LP_Instructor.jpg')
               .getDownloadURL()
               .then(url => {
                 setinstructorPicture(url)
              }).catch(function (error) {
                console.error("Error", error);
              })

      storage.ref("LandingPage")
               .child('LP_User.jpg')
               .getDownloadURL()
               .then(url => {
                 setuserPicture(url)
              }).catch(function (error) {
                console.error("Error", error);
              })

      document.body.style.paddingTop = "0"

  },[])

  return(
    <>
    <div className='LandingPage-container d-flex flex-column align-items-center'>
    <MessengerCustomerChat
      pageId="107603050964291"
      appId="3464127340346161"
    />
      <div className='LandingPage-content d-flex flex-column flex-md-row align-items-center align-items-md-start mb-md-2'>

        <div className='d-flex flex-column align-items-center col-md-3 p-0 p-md-1'>
          <a href='./' className='text-center LandingPage-logo'><img className='col-5 col-md-10' src={logo} alt="Logo" style={{cursor:'pointer'}}/></a>
          <h3 className='text-center mt-2 mt-md-0 LandingPage-eslogan'>Reactiva la economía sudando</h3>
          <p className='text-center LandingPage-subeslogan'>Impulsamos gimnasios digitales de instructores mexicanos</p>
        </div>

        <div className='LandingPage-foto-container d-flex flex-row align-items-top justify-content-start mt-3 my-md-2 col-md-9 p-0'>
          <div className='col-6 d-flex flex-column align-items-center'>
            {isMD?<h3 className='text-center LandingPage-subtitle'>¿Eres coach?</h3>:<h6 className='text-center LandingPage-subtitle'>¿Eres coach?</h6>}
            <img src={instructorPicture} alt='Instructor' onClick={handleModal} name='coach'/>
            {isMD?<h3 className='LandingPage-foto-mensaje text-center'>Abre tu gym digital</h3>:<h6 className='LandingPage-foto-mensaje text-center'>Abre tu gym digital</h6>}
            <p className='text-center'>¡Es momento!</p>
            <button className='btn-dark rounded' onClick={handleModal} name='coach'>Click aquí</button>
          </div>

          <div className='col-6 d-flex flex-column align-items-center'>
            {isMD? <h3 className='text-center LandingPage-subtitle'>¿Quieres hacer ejercicio?</h3>:<h6 className='text-center LandingPage-subtitle'>¿Quieres hacer ejercicio?</h6>}
            <img src={userPicture} alt='Usuario' onClick={handleModal} name='user'/>
            {isMD?<h3 className='LandingPage-foto-mensaje text-center'>¡Invierte en tu coach!</h3>:<h6 className='LandingPage-foto-mensaje text-center'>¡Invierte en tu coach!</h6>}
            <p className='text-center'>No gastes tu dinero en una cadena de gimnasios</p>
            <button className='btn-dark rounded' onClick={handleModal} name='user'>Click aquí</button>
          </div>
        </div>

      </div>

      <div className='footer col-12 d-flex flex-column align-items-center'>

        <div className='col-12 d-flex flex-row justify-content-around align-items-center py-2'>
          <a className='mr-0 mr-md-2' href='https://www.facebook.com/MoveMe-Fitness-107603050964291/' target="_blank" style={{color:'#0070C0'}}>
            <img src={facebookLogo} alt='Facebook'/> movemeFitnessMX
          </a>
          <a href='https://www.instagram.com/movemefitnessapp/' target="_blank" style={{color:'#AF33AE'}}>
            <img src={instagramLogo} alt='Facebook'/> movemefitnessapp
          </a>
        </div>

        <div className='d-flex flex-row'>
          <a className='mr-2 LandingPage-terminos' href='./terms-and-conditions'>Términos y Condiciones</a>
          <a className='LandingPage-terminos' href='./privacy-notice'>Política de Privacidad</a>
        </div>

        <p className='LandingPage-terminos'>MoveMe® de NovusTeks S.A.P.I de C.V.</p>

      </div>

    </div>

    <Modal
      show={show}
      onHide={()=>{setShow(false)}}
      backdrop="static"
      keyboard={false}
    >

      <Modal.Header closeButton>
        <Modal.Title>{who==='coach'?'Abre tu gimnasio digital':'Invierte en tu coach'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {signup?<Signup />:
          <div className='d-flex flex-column align-items-center'>
          <ReactPlayer
            onContextMenu={e => e.preventDefault()}
            playing
            url={who==='coach'?instructorVideo:userVideo}
            controls = {true}
            width='100%'
          />
          {who==='coach'?<button className='btn-primary btn-lg rounded col-6 mt-2' onClick={()=>{setSignup(true)}}>Registrarme</button>:
          <button className='btn-primary btn-lg rounded col-6 mt-2' onClick={()=>{window.location.href = "./market"}}>Ir a MoveMe</button>}
        </div>
      }
      </Modal.Body>

    </Modal>
    </>
  )
}

export default withRouter(LandingPage)
