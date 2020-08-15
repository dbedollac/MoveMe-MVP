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
       } else {
           // doc.data() will be undefined in this case
       }
       }).catch(function(error) {
           console.log("Error getting document:", error);
       });
     }
    }
  },[usuario])

  return (
    <div>
    {props.ClasesZoom?null:<Header instructor={usuario?user?!props.match.params.uid?true:false:true:null} user={usuario?user?true:false:null}/>}
        <div className='MonthlyProgram-container'>
          {props.ClasesZoom?null:<SetMonthlyProgramPrice market={props.match.params.uid?true:false} instructor={props.instructor}/>}
          <div className='d-flex flex-row flex-wrap justify-content-center'>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={1} instructor={props.ClasesZoom?null:props.instructor} zoomMeetings={props.ClasesZoom?props.zoomMeetings:null}/>
            </div>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={2} instructor={props.ClasesZoom?null:props.instructor} zoomMeetings={props.ClasesZoom?props.zoomMeetings:null}/>
            </div>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={3} instructor={props.ClasesZoom?null:props.instructor} zoomMeetings={props.ClasesZoom?props.zoomMeetings:null}/>
            </div>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={4} instructor={props.ClasesZoom?null:props.instructor} zoomMeetings={props.ClasesZoom?props.zoomMeetings:null}/>
            </div>
            <div className='col-5 mt-2'>
              <MonthlyProgramWeek week={5} instructor={props.ClasesZoom?null:props.instructor} zoomMeetings={props.ClasesZoom?props.zoomMeetings:null}/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default withRouter(MonthlyProgram)
