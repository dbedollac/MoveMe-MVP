import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import { CameraVideoFill, CollectionPlayFill, Plus, ArrowRight } from 'react-bootstrap-icons';
import DisplayCarousel from '../Molecules/DisplayCarousel'
import MonthlyProgram from './MonthlyProgram'
import MyClasses from './MyClasses'
import SetMonthlyProgramPrice from '../Molecules/SetMonthlyProgramPrice'
import { useTranslation } from 'react-i18next';
import {iva} from '../../Config/Fees'
import StripeFee from '../Atoms/StripeFee'
import facebookLogo from '../Views/Images/Facebook.png'
import instagramLogo from '../Views/Images/Instagram.png'
import './InstructorProfile.css'

function Coach(props) {
  const uid = props.match.params.uid
  const { usuario } = useContext(Auth);
  const [profileName, setprofileName] = useState(null)
  const [profilePicture, setprofilePicture] = useState(null)
  const [selfDescription, setselfDescription] = useState(null)
  const [facebookLink, setFacebook] = useState(null)
  const [instagramLink, setInstagram] = useState(null)
  const [monthlyProgramPrice, setmonthlyProgramPrice] = useState(null)
  const [instructor, setInstructor] = useState(null)
  const [allClases, setallClases] = useState([])
  const [zoomMeetings,setZoomMeetings] = useState([])
  const [videoClases, setvideoClases] = useState([])
  const [monthlyProgram,setMonthlyProgram] = useState(false)
  const [myClasses,setmyClasses] = useState(false)
  const [aux,setAux] = useState([])
  const [user,setUser] = useState(false)
  const { t } = useTranslation();

  const today = new Date()
  const firstMonthDay = new Date(today.getFullYear(),today.getMonth(),1)
  const firstMonthSunday = firstMonthDay.getDay()===0?0:7-firstMonthDay.getDay()+1
  const fiveWeeks = (new Date(today.getFullYear(),today.getMonth(),firstMonthSunday+28).getMonth() === today.getMonth())
  const fiveWeeks0= fiveWeeks?-2:0

  const handleVerMonthlyProgram = () =>{
    setMonthlyProgram(!monthlyProgram)
  }

  const handleVerClases = () =>{
    setmyClasses(!myClasses)
  }

  useEffect( ()=>{

        if (usuario) {
          auth.onAuthStateChanged((usuario) => {
            if (usuario===null) {
                props.history.push("/market");
            }
          })

        var docRef = db.collection("Users").doc(usuario.uid);
         docRef.get().then((doc)=>{
        if (doc.exists) {
            setUser(true)
        } else {
            if (usuario.uid!==props.match.params.uid) {
              setUser(true)
            }
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }

      var docRef = db.collection("Instructors").doc(uid);
       docRef.get().then((doc) =>{
        setprofileName(doc.data().profileName)
        setprofilePicture(doc.data().imgURL)
        setselfDescription(doc.data().selfDescription)
        setFacebook(doc.data().linkFB)
        setInstagram(doc.data().linkIG)
        setmonthlyProgramPrice(doc.data().monthlyProgram.Price)
        setInstructor(doc.data())
      })

      if (allClases.length===0) {
       docRef.collection('Classes')
                      .get()
                      .then((querySnapshot) => {
                          setvideoClases(allClases.filter(item => item.data.videoURL!==undefined))
                          querySnapshot.forEach((doc) => {
                               allClases.push({id:doc.id, data: doc.data()});
                          });
                      })
                      .catch(function(error) {
                          console.log("Error getting documents: ", error);
                      })}

      if (zoomMeetings.length===0) {
       docRef.collection('ZoomMeetingsID').get()
                  .then(function(querySnapshot) {
                    var now = new Date(Date.now()-3600000).toISOString()
                      querySnapshot.forEach(function(doc) {

                        if(doc.data().startTime>now){
                          if (!aux.includes(doc.id)) {
                            aux.push(doc.id)
                            zoomMeetings.push({startTime:doc.data().startTime,meetingID:doc.data().meetingID,claseID:doc.data().claseID, monthlyProgram:doc.data().monthlyProgram})}
                          }
                      }

                    )
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
                }

       },[profileName])

  if (monthlyProgram) {
    return (
      <div className='InstructorProfile-monthlyProgram d-flex flex-column'>

        <div className='col-12 col-lg-8 InstructorProfile-monthlyProgram-price align-self-center mt-1'>
          <SetMonthlyProgramPrice market={props.match.params.uid?true:false} instructor={{data:instructor,id:uid}}/>
        </div>

        <div className='col-md-8 d-flex flex-row alig-items-center justify-content-start mt-2'>
          <CollectionPlayFill size={'2em'} className='mr-2' color='darkcyan'/>
          <h4>{videoClases.length} {t('iProfile.3','Clases en Video')}</h4>
        </div>
        {videoClases.length>0?
          <DisplayCarousel allClases={allClases} array={videoClases} market={true}  instructor={{data:instructor,id:uid}} fitnessKit={true}/>:
        <h5 style={{color:'gray'}} className='text-center py-5'><i>{t('iProfile.8','No hay clases con video')}</i></h5>}

        <div className='col-md-8 d-flex flex-row alig-items-center justify-content-star mt-2'>
          <CameraVideoFill size={'2em'} className='mr-2' color="#2C8BFF" />
          <h4>{zoomMeetings.length} {t('iProfile.2','Clases por Zoom')}</h4>
        </div>
        <MonthlyProgram market={props.match.params.uid?true:false} instructor={{data:instructor,id:uid}}/>
      </div>
    )
  }else {
    if (myClasses) {
      return <MyClasses market={props.match.params.uid?true:false} instructor={{data:instructor,id:uid}}/>
    }
  }

  return(
    <>
      <Header instructor={usuario?user?false:true:null} user={usuario?user?true:false:null}/>
          <div className='InstructorProfile-container'>
              <div className='text-center InstructorProfile-container-header d-flex flex-column flex-md-row'>
                  <div className='col-12 col-md-6 profilePicture' style={{
                    backgroundImage: `url(${profilePicture})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'}}>
                    {profilePicture?null:<img src='/logo.jpg' className='p-2 '/>}
                    <div className='fixed-bottom InstructorProfile-logos'>
                      {facebookLink?
                      <a href={facebookLink} target="_blank"> <img className='float-right ' src={facebookLogo} alt='Facebook' style={{width:'3em'}}/> </a>
                      :null
                      }
                      {instagramLink?
                      <a href={instagramLink} target="_blank"> <img className='float-right mr-2' src={instagramLogo} alt='Instagram' style={{width:'3em'}}/> </a>
                      :null
                      }
                    </div>
                  </div>
                  <div className='col-12 col-md-6 d-flex flex-column'>
                    <div className='InstructorProfile-container-nameDescription'>
                      <h2>{profileName}</h2>
                      <p className='text-left'>{selfDescription}</p>
                    </div>
                    <div className='InstructorProfile-container-programa p-2'>
                        <div className='d-flex flex-row align-items-center justify-content-around' onClick={handleVerMonthlyProgram} style={{cursor:'pointer'}}>
                          <h3>{t('iProfile.1','Reto Mensual')}</h3>
                          <div>
                            {monthlyProgramPrice?'$ '+Math.ceil(monthlyProgramPrice*(1+iva)+StripeFee(monthlyProgramPrice*(1+iva))):null}
                            <ArrowRight className='ml-2'/>
                          </div>
                        </div>
                      <div className='d-flex flex-row justify-content-around align-items-center'>
                        <div className='monthlyProgram-clasesZoom d-flex flex-column'>
                          <p style={{ fontSize: '40px'}}>{zoomMeetings.length}</p>
                          <p>{t('iProfile.2','Clases por Zoom')}</p>
                        </div>
                        <Plus size={'2em'}/>
                        <div className='d-flex flex-column'>
                          <p style={{ fontSize: '40px'}}>{videoClases.length}</p>
                          <p>{t('iProfile.3','Clases en Video')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div>

                <div className='d-flex flex-column flex-md-row py-2'>
                  <div className='col-md-8 d-flex flex-row alig-items-center justify-content-start'>
                    <CameraVideoFill size={'2em'} className='mr-2' color="#2C8BFF" />
                    <h4>{t('iProfile.5','Próximas Clases por Zoom')}</h4>
                  </div>
                  <div className='col-md-4 d-flex flex-row alig-items-center justify-content-md-end'>
                  <i onClick={handleVerClases} style={{cursor:'pointer',fontSize:'large'}}>{t('iProfile.6','Ver todas las clases')}</i>
                  </div>
                </div>

                {zoomMeetings.length>0?
                <DisplayCarousel allClases={allClases} zoomMeetings={zoomMeetings} market={true} instructor={{data:instructor,id:uid}}/>:
                <h5 style={{color:'gray'}} className='text-center py-5'><i>{t('iProfile.7','No se ha agendado ninguna clase por Zoom')}</i></h5>}

                <div className='d-flex flex-column flex-md-row py-2'>
                  <div className='col-md-8 d-flex flex-row alig-items-center justify-content-start'>
                    <CollectionPlayFill size={'2em'} className='mr-2' color='darkcyan'/>
                    <h4>{t('iProfile.3','Clases en Video')}</h4>
                  </div>
                  <div className='col-md-4 d-flex flex-row alig-items-center justify-content-md-end'>
                  <i onClick={handleVerClases} style={{cursor:'pointer',fontSize:'large'}}>{t('iProfile.6','Ver todas las clases')}</i>
                  </div>
                </div>

                {videoClases.length>0?
                <DisplayCarousel allClases={allClases} array={videoClases} market={true}  instructor={{data:instructor,id:uid}} />:
                <h5 style={{color:'gray'}} className='text-center py-5'><i>{t('iProfile.8','No hay clases con video')}</i></h5>}
            </div>
      </div>
    </>
  )
}

export default Coach
