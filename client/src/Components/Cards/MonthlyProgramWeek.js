import React, { useState, useContext, useEffect } from "react";
import MonthlyProgramDay from '../Molecules/MonthlyProgramDay'

function MonthlyProgramWeek(props) {

  useEffect(()=>{
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first)).toUTCString();
    var lastday = new Date(curr.setDate(last)).toUTCString();
    console.log(firstday);
  })

  return(
    <div className='card'>
      <div className='card-header d-flex flex-column'>
        <h3 className='text-center'>{props.week>0?null:'Última'} Semana {props.week>0?props.week:null}</h3>
        {props.week>0?null:<p style={{color: 'gray'}}>Solo aplica si el mes tiene más de 4 semanas (5 domingos)</p>}
      </div>
      <div className='list-group'>
        <MonthlyProgramDay dayName='Domingo' dayNumber={1} week={props.week} className='list-group-item'/>
      </div>
      <MonthlyProgramDay dayName='Lunes' dayNumber={2} week={props.week} className='list-group-item'/>
    </div>
  )
}

export default MonthlyProgramWeek
