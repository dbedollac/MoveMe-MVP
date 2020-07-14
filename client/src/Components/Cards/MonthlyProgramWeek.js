import React, { useState, useContext, useEffect } from "react";
import MonthlyProgramDay from '../Molecules/MonthlyProgramDay'

function MonthlyProgramWeek(props) {
  return(
    <div className='card'>
      <div className='card-header'>
        <h3 className='text-center'>Semana {props.number}</h3>
      </div>
      <MonthlyProgramDay dayName='Lunes' dayNumber={2} week={1}/>
    </div>
  )
}

export default MonthlyProgramWeek
