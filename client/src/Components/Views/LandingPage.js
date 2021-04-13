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
import Header from '../Molecules/Header'
import FirstSteps from './FirstSteps'
import aliadosInfo from '../Views/Images/aliados_info.jpeg'
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
    <Header  user={usuario?true:false}/>
    <div className='LandingPage-container d-flex flex-column align-items-center'>
    <MessengerCustomerChat
      pageId="107603050964291"
      appId="3464127340346161"
    />
    <div className='LandingPage-main-container'>
      <div className='d-flex flex-column align-items-start align-items-md-start mt-5'>

        <div className='col-12 d-flex flex-column justify-content-between align-items-center mt-5'>
          <h3 className='text-center mt-2 mt-md-0 LandingPage-eslogan header-rigt'>Reactiva la economía sudando</h3>
          <p className='text-center LandingPage-subeslogan header-left'>Impulsamos gimnasios digitales de instructores mexicanos</p>
        </div>

        <div className ='d-flex flex-md-row flex-column'>

          <div className='px-1'>
            <ReactPlayer
              onContextMenu={e => e.preventDefault()}
              playing = {true}
              url={instructorVideo}
              controls = {true}
              width='100%'
            />
          </div>

          <div className =' col-md-6 LandingPage-bullets d-flex flex-column justify-content-around pr-3'>
            <h4 className='text-left'>Agenda y vende tus clases en línea</h4>
            <h4 className='text-right'>Sube y renta tus clases en video</h4>
            <h4 className='text-left'>Cobra una cuota mensual por tu Fitness Kit</h4>
          </div>
        </div>
        <div className='LandingPage-FirstSteps col-12'>
          <FirstSteps LandingPage={true}/>
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
    </>
  )
}

export default withRouter(LandingPage)
