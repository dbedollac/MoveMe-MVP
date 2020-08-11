import React, { useState, useContext, useEffect } from "react";
import MonthlyProgramDay from '../Molecules/MonthlyProgramDay'

function MonthlyProgramWeek(props) {
  const[week,setweek]=useState(null)
  const[active,setActive]=useState(false)

    useEffect(()=>{
      getWeekDates()
    },[])

    const getWeekDates = () =>{
      var curr = new Date(); // get current date
      var month = curr.getMonth()
      var year = curr.getFullYear()

      var thisSunday = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      var thisWeek = Math.ceil(thisSunday/7)

      var firstNextMonth = new Date(year,month+1,1).getDay()
      var firstSundayNextMonth=firstNextMonth===0?0:7-firstNextMonth+1

      if (props.week===thisWeek) {
        setActive(true)
      }

      if (props.week<thisWeek) {
        var mm=month+1
        var sunday=new Date(year,mm,firstSundayNextMonth+7*(props.week-1))
        setweek({
          sunday: sunday,
          monday: new Date(sunday.getTime()+(24 * 60 * 60 * 1000)),
          tuesday: new Date(sunday.getTime()+(24*2 * 60 * 60 * 1000)),
          wednesday: new Date(sunday.getTime()+(24*3 * 60 * 60 * 1000)),
          thursday: new Date(sunday.getTime()+(24*4 * 60 * 60 * 1000)),
          friday:new Date(sunday.getTime()+(24*5 * 60 * 60 * 1000)),
          saturday: new Date(sunday.getTime()+(24*6 * 60 * 60 * 1000)),
        })
      }else {
        var mm=month
        var sunday=new Date(year,mm,thisSunday+7*(props.week-thisWeek))
        if (sunday.getMonth()===mm) {
          setweek({
            sunday: sunday,
            monday: new Date(sunday.getTime()+(24 * 60 * 60 * 1000)),
            tuesday: new Date(sunday.getTime()+(24*2 * 60 * 60 * 1000)),
            wednesday: new Date(sunday.getTime()+(24*3 * 60 * 60 * 1000)),
            thursday: new Date(sunday.getTime()+(24*4 * 60 * 60 * 1000)),
            friday:new Date(sunday.getTime()+(24*5 * 60 * 60 * 1000)),
            saturday: new Date(sunday.getTime()+(24*6 * 60 * 60 * 1000)),
          })
        }
      }

    }

  return(
    <div className='card'>
      <div className='card-header d-flex flex-column'>
        <h3 className='text-center' style={{color:active?'#F39119':'black'}}>{props.week!==5?null:'Última'} Semana {props.week!==5?props.week:null}</h3>
        {props.week!==5?null:<p style={{color: 'gray'}}>Solo aplica si el mes tiene más de 4 semanas (5 domingos)</p>}
      </div>
      <div className='list-group'>
        <MonthlyProgramDay dayDate={week?week.sunday:null} dayName={'Domingo'} dayNumber={1} week={props.week} className='list-group-item' instructor={props.instructor}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay dayDate={week?week.monday:null} dayName={'Lunes'} dayNumber={2} week={props.week} className='list-group-item' instructor={props.instructor}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay dayDate={week?week.tuesday:null} dayName={'Martes'} dayNumber={3} week={props.week} className='list-group-item' instructor={props.instructor}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay dayDate={week?week.wednesday:null} dayName={'Miércoles'} dayNumber={4} week={props.week} className='list-group-item' instructor={props.instructor}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay dayDate={week?week.thursday:null} dayName={'Jueves'} dayNumber={5} week={props.week} className='list-group-item' instructor={props.instructor}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay dayDate={week?week.friday:null} dayName={'Viernes'} dayNumber={6} week={props.week} className='list-group-item' instructor={props.instructor}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay dayDate={week?week.saturday:null} dayName={'Sábado'} dayNumber={7} week={props.week} className='list-group-item' instructor={props.instructor}/>
      </div>
    </div>
  )
}

export default MonthlyProgramWeek
