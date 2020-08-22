import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import MonthlyProgramWeek from '../Cards/MonthlyProgramWeek'
import RefreshToken from '../Atoms/RefreshToken'
import SetMonthlyProgramPrice from '../Molecules/SetMonthlyProgramPrice'
import {db,auth} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import './MonthlyProgram.css'

function MonthlyProgram(props) {
  const { usuario } = useContext(Auth);
  const [user, setUser] = useState(false);
  const [trialClass,settrialClass] = useState(null)

  const today = new Date()
  var thisSunday = new Date(today.getFullYear(),today.getMonth(),today.getDate() - today.getDay())
  var thisWeek = Math.ceil(thisSunday.getDate()/7)

  const firstMonthDay = new Date(thisSunday.getFullYear(),thisSunday.getMonth(),1)
  const firstMonthSunday = firstMonthDay.getDay()===0?0:7-firstMonthDay.getDay()+1
  const fiveWeeks = (new Date(thisSunday.getFullYear(),thisSunday.getMonth(),firstMonthSunday+28).getMonth() === thisSunday.getMonth())
  const numberWeeks = fiveWeeks?5:4
  const weeks=[]

  for (var i = 0; i < numberWeeks; i++) {
    if (thisWeek+i<=numberWeeks) {
      weeks.push(thisWeek+i)
    } else {
      weeks.push((thisWeek+i)-numberWeeks)
    }
  }

  useEffect(()=>{

    if (!props.market) {
      auth.onAuthStateChanged((usuario) => {
        if (usuario===null) {
            props.history.push("/market");
        }
      })
    }

    if (usuario) {
      if(!props.market&&!props.ClasesZoom){
      var docRef = db.collection("Instructors").doc(usuario.uid);
      docRef.get().then( async (doc)=>{
      if (doc.exists) {
            await RefreshToken(usuario.uid, doc.data().zoomRefreshToken)
        } else {
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });}

        if(!props.ClasesZoom){var docRef2 = db.collection("Users").doc(usuario.uid);
        docRef2.get().then((doc)=>{
       if (doc.exists) {
           setUser(true)
           settrialClass(doc.data().trialClass)
       } else {
           // doc.data() will be undefined in this case
       }
       }).catch(function(error) {
           console.log("Error getting document:", error);
       });
     }
   }else {
     settrialClass(0)
   }
  },[usuario])

  return (
    <div>
    {props.ClasesZoom?null:<Header instructor={usuario?user?!props.match.params.uid?true:false:true:null} user={usuario?user?true:false:null}/>}
        <div className='MonthlyProgram-container'>
          {props.ClasesZoom?null:<SetMonthlyProgramPrice market={props.match.params.uid?true:false} instructor={props.instructor}/>}
          <div className='d-flex flex-row flex-wrap justify-content-center'>
            {weeks.map(week => (
              <div className='col-11 col-md-5 mt-2' key={week}>
                <MonthlyProgramWeek thisSunday={thisSunday} trialClass={trialClass} week={week} instructor={props.ClasesZoom?null:props.instructor} zoomMeetings={props.ClasesZoom?props.zoomMeetings:null}/>
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default withRouter(MonthlyProgram)
