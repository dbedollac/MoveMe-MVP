import React, { useState, useContext, useEffect } from "react";
import MonthlyProgramDay from '../Molecules/MonthlyProgramDay'
import { useTranslation } from 'react-i18next';

function MonthlyProgramWeek(props) {
  const[week,setweek]=useState(null)
  const[active,setActive]=useState(false)
  const { t } = useTranslation();

    useEffect(()=>{
      getWeekDates()
    },[])

    const getDayDate = (date) =>{
      var days = date.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var month = (date.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
      var year = date.getFullYear()

      return(days+'/'+month+'/'+year)
    }

    const getWeekDates = () =>{
      var month = props.thisSunday.getMonth()
      var year = props.thisSunday.getFullYear()

      var thisSunday = props.thisSunday.getDate() // First day is the day of the month - the day of the week
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
        <h5 className='text-center' style={{color:active?'#F39119':'black'}}>{week?getDayDate(week.sunday)+' - '+getDayDate(week.saturday):null}</h5>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.sunday:null} dayName={t('mProgram.5','Domingo')} dayNumber={1} week={props.week===5?-1:props.week} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.monday:null} dayName={t('mProgram.6','Lunes')} dayNumber={2} week={props.week===5?-1:props.week} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.tuesday:null} dayName={t('mProgram.7','Martes')} dayNumber={3} week={props.week===5?-1:props.week} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.wednesday:null} dayName={t('mProgram.8','Miércoles')} dayNumber={4} week={props.week===5?-1:props.week} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.thursday:null} dayName={t('mProgram.9','Jueves')} dayNumber={5} week={props.week===5?-1:props.week} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.friday:null} dayName={t('mProgram.10','Viernes')} dayNumber={6} week={props.week===5?-1:props.week} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
      <div className='list-group'>
        <MonthlyProgramDay trialClass={props.trialClass} dayDate={week?week.saturday:null} dayName={t('mProgram.11','Sábado')} dayNumber={7} week={props.week===5?-1:props.week} className='list-group-item' instructor={props.instructor} zoomMeetings={props.zoomMeetings?props.zoomMeetings:false}/>
      </div>
    </div>
  )
}

export default MonthlyProgramWeek
