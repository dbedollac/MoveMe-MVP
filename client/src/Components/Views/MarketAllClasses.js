import React, { useState, useContext, useEffect } from "react";
import ClassCard from '../Cards/ClassCard'
import CoachCard from '../Cards/CoachCard'
import InstructorsDetailCard from '../Cards/InstructorsDetailCard'
import UsersDetailCard from '../Cards/UsersDetailCard'
import { X, Search } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import './MarketAllClasses.css'

function MarketAllClasses(props) {
  const [clases, setclases] = useState([])
  const [clasesAll, setclasesAll] = useState([])
  const [pictures, setpictures] = useState([])
  const [filtersType, setfiltersType] = useState('')
  const [filtersLevel, setfiltersLevel] = useState('')
  const [filtersDuration, setfiltersDuration] = useState('')
  const [filterSearchClass,setfilterSearchClass] = useState('')
  const [filterSearchCoach,setfilterSearchCoach] = useState('')
  const [filterSort,setfilterSort] = useState('')
  const [detail, setdetail] = useState(false)
  const [claseDetail, setclaseDetail] = useState(null)
  const [aux, setaux] = useState(true)
  const [showMore, setshowMore] = useState(48)
  const [detailStarttime,setdetailStarttime] = useState(null)
  const { t } = useTranslation();

  const getDate = (date) => {
    var saleDate = new Date(date)
    var days = saleDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var month = (saleDate.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
    var year = saleDate.getFullYear()

      return(year+'-'+month+'-'+days+'T00:00')
  }
  const [filterDateTime,setfilterDateTime] = useState(getDate(new Date()))


  const handleVerMas = () =>{
    setshowMore(showMore + 24)
  }

  const sortMeetings = (a,b) => {
    const meetingA = a.startTime;
    const meetingB = b.startTime;

    let comparison = 0;
    if (meetingA > meetingB) {
      comparison = 1;
    } else if (meetingA < meetingB) {
      comparison = -1;
    }
    return comparison;
  }

  const shuffleArray= (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

  const handleOrdenar = (event) =>{
    switch (event.target.value) {
      case '': var clases = clasesAll;
        break;
      case 'low': var clases = clasesAll.sort((a, b) => parseFloat(props.allInstructors?a.data.monthlyProgram.Price:a.data.freeVideo?0:a.data.offlinePrice) - parseFloat(props.allInstructors?b.data.monthlyProgram.Price:b.data.freeVideo?0:b.data.offlinePrice));
        break;
      case 'high': var clases = clasesAll.sort((a, b) => parseFloat(props.allInstructors?b.data.monthlyProgram.Price:b.data.freeVideo?0:b.data.offlinePrice) - parseFloat(props.allInstructors?a.data.monthlyProgram.Price:a.data.freeVideo?0:a.data.offlinePrice));
        break;
      default: var clases = clases.filter(item => (item.data.duration<=1000));
    }

    setclasesAll(clases)
    setfilterSort(event.target.value)
  }

  const resetFilters = () =>{
    setfiltersType('')
    setfiltersLevel('')
    setfiltersDuration('')
    setfilterSearchClass('')
    setfilterSearchCoach('')
    setfilterDateTime('')
    setclases(clasesAll)
  }

  const  handleDateTime = (event) =>{
    var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
    var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
    var clases02 = clases01.filter(item => item.startTime>=new Date(event.target.value).toISOString())

    var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
    var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
    switch (filtersDuration) {
      case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
        break;
      case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
        break;
      case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
        break;
      default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
    }

    setclases(clases2)
    setaux(false)
    setfilterDateTime(event.target.value)
  }

  const handleBuscador = (event) =>{
    var Busca = event.target.value

        var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
        var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(Busca.toUpperCase()))
        var clases02 = props.zoomMeetings?clases01.filter(item => item.startTime>=new Date(filterDateTime).toISOString()):clases01

        var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
        var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
        switch (filtersDuration) {
          case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
            break;
          case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
            break;
          case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
            break;
          default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
        }

        setclases(clases2)
        setaux(false)
        setfilterSearchClass(Busca)
  }

  const handleBuscadorCoach = (event) =>{
    var Busca = event.target.value
        if (!props.allInstructors) {
          var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(Busca.toUpperCase()))
          var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
          var clases02 = props.zoomMeetings?clases01.filter(item => item.startTime>=new Date(filterDateTime).toISOString()):clases01

          var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
          var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
          switch (filtersDuration) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
        }else {
          var clases2 = clasesAll.filter(item => item.data.profileName.toUpperCase().includes(Busca.toUpperCase()))
        }

        setclases(clases2)
        setaux(false)
        setfilterSearchCoach(Busca)
  }

  const handleTypeChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }
          var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
          var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
          var clases02 = props.zoomMeetings?clases01.filter(item => item.startTime>=new Date(filterDateTime).toISOString()):clases01

          var clases0 = clases02.filter(item => item.data.type.includes(value));
          var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
          switch (filtersDuration) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          setclases(clases2)
          setaux(false)

      setfiltersType(value)
  }


  const handleLevelChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }
          var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
          var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
          var clases02 = props.zoomMeetings?clases01.filter(item => item.startTime>=new Date(filterDateTime).toISOString()):clases01

          var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
          var clases1 = clases0.filter(item => item.data.level.includes(value));
          switch (filtersDuration) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          setclases(clases2)
          setaux(false)

      setfiltersLevel(value)
  }

  const handleDurationChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

          var clases00 = clasesAll.filter(item => item.instructor.data.profileName.toUpperCase().includes(filterSearchCoach.toUpperCase()))
          var clases01 = clases00.filter(item => item.data.title.toUpperCase().includes(filterSearchClass.toUpperCase()))
          var clases02 = props.zoomMeetings?clases01.filter(item => item.startTime>=new Date(filterDateTime).toISOString()):clases01

          var clases0 = clases02.filter(item => item.data.type.includes(filtersType));
          var clases1 = clases0.filter(item => item.data.level.includes(filtersLevel));
          switch (value) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          setclases(clases2)
          setaux(false)

      setfiltersDuration(value)
  }

  const  handleDetail = (event) =>{
        var clasesInstructor = props.allClases.filter(item => item.instructor.id.includes(event.target.name));
        var clase = clasesInstructor.filter(item => item.id.includes(event.target.alt))

      setclaseDetail(clase[0])
      setdetail(!detail)
      setdetailStarttime(!props.ClasesZoom?event.target.id:null)
    }

  useEffect(()=>{

    if(props.zoomMeetings&&aux){
      if (clases.length === 0) {
          var Meetings = []
          var now = new Date(Date.now()-3600000).toISOString()
            for (var i = 0; i < props.zoomMeetings.length; i++) {
                var clasesInstructor = props.allClases.filter(item => item.instructor.id.includes(props.zoomMeetings[i].instructor.id));
                var clase = clasesInstructor.filter(item => item.id.includes(props.zoomMeetings[i].claseID))
              Meetings.push({startTime:props.zoomMeetings[i].startTime,
                meetingID: props.zoomMeetings[i].meetingID,
                id: clase[0].id,
                data: clase[0].data,
                instructor: props.zoomMeetings[i].instructor,
                monthlyProgram: props.zoomMeetings[i].monthlyProgram
              })
            }
            setclases(Meetings.sort(sortMeetings))
            setclasesAll(Meetings.sort(sortMeetings))
      }
    }

    if(props.array&&aux){
      setclases(props.misVideos?props.array:shuffleArray(props.array))
      setclasesAll(props.misVideos?props.array:shuffleArray(props.array))
    }

    if(props.allInstructors){
      setclases(shuffleArray(props.allInstructors))
      setclasesAll(shuffleArray(props.allInstructors))
    }

},[props.array])


  return(
    <div className='d-flex flex-column align-items-center'>
      <form className={`my-2 Market-filters py-1 ${props.allInstructors?'col-md-5 col-12':'col-12'}`}>
        <div className='d-flex flex-row justify-content-start align-items-center flex-wrap'>

          <div className='d-flex flex-column flex-lg-row justify-content-between align-items-start col-6'>
            {!props.allInstructors?
              <div className='col-12 col-lg-4'>
                <select id="type"
                  name="type"
                  onChange={handleTypeChange}
                  className='custom-select'
                  value={filtersType}
                  >
                  <option value="todos" >{t('allClases.1','Tipo de ejercicio (Todos)')}</option>
                  <option value="estiramiento">{t('allClases.2','Estiramiento (ej. Yoga)')}</option>
                  <option value="baile">{t('allClases.3','Baile')}</option>
                  <option value="funcional">{t('allClases.4','Funcional')}</option>
                  <option value="pelea">{t('allClases.5','Técnica de pelea')}</option>
                  <option value="pesas">{t('allClases.6','Con pesas')}</option>
                  <option value="otro">{t('allClases.7','Otro')}</option>
                </select>
              </div>:null}

            {!props.allInstructors?
            <div className='col-12 col-lg-4'>
              <select id="level"
                name="level"
                className='custom-select'
                onChange={handleLevelChange}
                value={filtersLevel}
                >
                <option value="todos" >{t('allClases.8','Dificultad de la clase (Todas)')}</option>
                <option value="principiantes">{t('allClases.9','Para principiantes')}</option>
                <option value="intermedia">{t('allClases.10','Intermedia')}</option>
                <option value="avanzada">{t('allClases.11','Avanzada')}</option>
              </select>
            </div>:null}

            {!props.allInstructors?
            <div className='col-12 col-lg-4'>
              <select id="duration"
                name="duration"
                className='custom-select'
                onChange={handleDurationChange}
                value={filtersDuration}
                >
                <option value='todos'>{t('allClases.12','Duración (Todas)')}</option>
                <option value={'0'}>{t('allClases.13','0 - 30 min')}</option>
                <option value={'1'}>{t('allClases.14','30 - 60 min')}</option>
                <option value={'2'}>{t('allClases.15','Más de 60 min')}</option>
              </select>
            </div>:null}
        </div>

        <div className={`d-flex pr-4 pr-lg-0 ${!props.allInstructors?'flex-column flex-lg-row':'flex-row'} justify-content-between align-items-start ${!props.allInstructors?'col-lg-2 col-6':null}`}>
          {!props.allInstructors?
          <input type='search' placeholder={t('allClases.16','Buscar clase...')} onChange={handleBuscador} value={filterSearchClass} className='col-12 py-1 rounded'/>:null}

          <input type='search' placeholder={t('allClases.17','Buscar coach...')} onChange={handleBuscadorCoach} value={filterSearchCoach} className={`rounded ${!props.allInstructors?'col-12':'col-6'} py-1`}/>

          {props.zoomMeetings?<input type="datetime-local" onChange={handleDateTime} value={filterDateTime} className='col-12 py-1'/>
          :props.misVideos?null
          :<select id="ordenar"
              name="ordenar"
              className={`custom-select ${!props.allInstructors?'col-12':'col-6 ml-2'}`}
              onChange={handleOrdenar}
              value={filterSort}
              >
                <option value=''>{t('allClases.21','Ordenar')}</option>
                <option value={'low'}>{t('allClases.18','Precio: de más bajo a más alto')}</option>
                <option value={'high'}>{t('allClases.19','Precio: de más alto a más bajo')}</option>
          </select>}
        </div>

        </div>
        {!props.allInstructors?<i className='pl-2' style={{fontSize:'small',cursor:'pointer'}} onClick={resetFilters}>{t('allClases.20','Quitar filtros')}</i>:null}
      </form>

      <div className='d-flex flex-row flex-wrap justify-content-center'>
      {detail&&claseDetail?
        <div style={{position: 'relative'}} className='p-2 col-12'>
          {props.misVideos?<UsersDetailCard data={claseDetail.data} claseID={claseDetail.id} instructor={claseDetail.instructor?claseDetail.instructor:props.instructor} misVideos={true}/>
          :<InstructorsDetailCard data={claseDetail.data} claseID={claseDetail.id} market={true} instructor={claseDetail.instructor?claseDetail.instructor:props.instructor} zoom={props.zoomMeetings?true:false} video={props.array?true:false} startTime={detailStarttime}/>}
          <X className='float-left'size={'2em'} onClick={handleDetail} style={{position: 'absolute', top:'2%', left:'2%',cursor:'pointer'}}/>
        </div>
        :
        clases.length>0?clases.slice(0,showMore).map((clase,index) => (
        <div className='MarketAllClasses-card' key={props.allInstructors?clase.uid+index:clase.id+index+clase.instructor.id+clase.startTime} onClick={handleDetail} style={{cursor:'pointer'}} >
          {props.allInstructors? <CoachCard data={clase.data} uid={clase.uid}/>
          :props.zoomMeetings?<ClassCard title={clase.data.title} picture={clase.data.imgURL} name={clase.instructor?clase.instructor.id:clase.id} id={clase.id} startTime={clase.startTime} price={clase.data.zoomPrice}/>
          :<ClassCard title={clase.data.title} picture={clase.data.imgURL} name={clase.instructor?clase.instructor.id:clase.id} id={clase.id} price={clase.data.offlinePrice} freeVideo={clase.data.freeVideo} misVideos={props.misVideos?true:false} expire={props.misVideos?clase.expire:null}/>}
        </div>
      )):<h5 style={{color:'gray'}} className='text-center py-5'><i>{props.allInstructors?t('allClases.25','No hay retos disponibles'):t('allClases.26','No hay clases disponibles')}</i></h5>}
      </div>
      {detail&&claseDetail?null:clases.length>showMore?<button className='btn-secondary rounded col-4' onClick={handleVerMas}>Ver más</button>:null}
    </div>
  )


}

export default MarketAllClasses
