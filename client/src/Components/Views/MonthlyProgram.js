import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import MonthlyProgramWeek from '../Cards/MonthlyProgramWeek'
import RefreshToken from '../Atoms/RefreshToken'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import './MonthlyProgram.css'

function MonthlyProgram() {
  const { usuario } = useContext(Auth);
  const [weeksDate, setweeksDate] = useState([])

  useEffect(()=>{
    if (usuario) {
      var docRef = db.collection("Instructors").doc(usuario.email);
      docRef.get().then( (doc)=>{
      if (doc.exists) {
            RefreshToken(usuario.email, doc.data().zoomRefreshToken)
        } else {
            console.log("No such document!");
        }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    var curr = new Date; // get current date
    var month = curr.getMonth()+1
    var year = curr.getFullYear()
    var thisSunday = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var thisWeek = Math.ceil(thisWeek/7)

    for (var i = 0; i < 5; i++) {
       setweeksDate({i:i+1})
     }
     console.log(weeksDate);
   },[usuario])

  return (
    <div>
      <Header type={1}/>
        <div className='MonthlyProgram-container d-flex flex-row flex-wrap justify-content-center'>
          <div className='col-5 mt-2'>
            <MonthlyProgramWeek week={1}/>
          </div>
          <div className='col-5 mt-2'>
            <MonthlyProgramWeek week={2}/>
          </div>
          <div className='col-5 mt-2'>
            <MonthlyProgramWeek week={3}/>
          </div>
          <div className='col-5 mt-2'>
            <MonthlyProgramWeek week={4}/>
          </div>
          <div className='col-5 mt-2'>
            <MonthlyProgramWeek week={-1}/>
          </div>
        </div>
    </div>
  )
}

export default MonthlyProgram
