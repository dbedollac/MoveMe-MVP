import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import './MyClasses.css'
import NewClass from '../Molecules/NewClass'
import { PlusCircleFill, Search, X, PencilSquare, ArrowLeft, ArrowRepeat } from 'react-bootstrap-icons';
import ClassCard from '../Cards/ClassCard'
import InstructorsDetailCard from '../Cards/InstructorsDetailCard'
import EditClass from '../Molecules/EditClass'
import CreateZoomMeetingCard from '../Cards/CreateZoomMeetingCard'
import { useTranslation } from 'react-i18next';

function MyClasses(props) {
const { usuario } = useContext(Auth);
const [newclass, setNewClass] = useState(false)
const [clases, setclases] = useState([])
const [clasesAll, setclasesAll] = useState([])
const [pictures, setpictures] = useState([])
const [filtersType, setfiltersType] = useState('')
const [filtersLevel, setfiltersLevel] = useState('')
const [filtersDuration, setfiltersDuration] = useState('')
const [detail, setdetail] = useState(false)
const [claseDetail, setclaseDetail] = useState(null)
const [editClass, seteditClass] = useState(false)
const [aux, setaux] = useState(true)
const [user, setUser] = useState(false);
const { t } = useTranslation();

  useEffect(()=>{

    if (!props.market) {
      auth.onAuthStateChanged((usuario) => {
        if (usuario===null) {
            props.history.push("/market");
        }
      })
    }

    if (usuario) {
      var docRef = db.collection("Users").doc(usuario.uid);
       docRef.get().then((doc)=>{
      if (doc.exists) {
          setUser(true)
      } else {
          // doc.data() will be undefined in this case
          console.log("No es usuario");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }

    if((usuario||props.match.params.uid)&&aux){
    var Clases = []
    var docRef = db.collection("Instructors").doc(props.match.params.uid?props.match.params.uid:usuario.uid).collection("Classes");
    docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
             Clases.push({id:doc.id, data: doc.data()});
        });
        setclases(Clases)
        setclasesAll(Clases)
    });
  }
},[usuario])



  const handleNewClass = () =>{
    setNewClass(!newclass)
  }

  const handleBuscador = (event) =>{
    var Busca = event.target.value.toUpperCase()
        var clases = clasesAll.filter(item => item.data.title.toUpperCase().includes(Busca));
        setclases(clases)
        setaux(false)
  }

  const handleTypeChange =(event) => {
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

          var clases0 = clasesAll.filter(item => item.data.type.includes(value));
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

          var clases0 = clasesAll.filter(item => item.data.type.includes(filtersType));
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


          var clases0 = clasesAll.filter(item => item.data.type.includes(filtersType));
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
    var clase = clases.filter(item => item.id.includes(event.target.name));
    setclaseDetail(clase[0])
    setdetail(!detail)
    setaux(true)
  }

const handleEditClass = ()=>{
    seteditClass(!editClass)
  }

const handleRefresh = () =>{
  window.location.reload(false)
}

    if (editClass&&detail) {
      return(
        <div>
        <Header instructor={true} />
          <div className='d-flex flex-row align-items-center'>
            <h2 className='col-8 col-md-10 text-center text-break' style={{color: '#F39119'}}>{claseDetail.data.title}</h2>
            <button className='float-right btn-secondary mt-2 mr-2 rounded' onClick={handleEditClass}><ArrowLeft />{t('myClasses.1',' Regresar')}</button>
          </div>
          <EditClass claseID={claseDetail.id} claseData={claseDetail.data} />
        </div>
      )
    }
    if (newclass) {
      return(
        <div>
        <Header instructor={true} />
          <div className='d-flex flex-row align-items-center'>
            <h2 className='col-8 col-md-10 text-center text-break' style={{color: '#F39119'}}>{t('myClasses.3','Clase Nueva')}</h2>
            <button className='float-right btn-secondary mt-2 mr-2 rounded' onClick={handleNewClass}><ArrowLeft />{t('myClasses.1',' Regresar')}</button>
          </div>
          <NewClass />
        </div>
      )
    } else {
    return (
      <div >
        <Header instructor={usuario?user?!props.match.params.uid?true:false:true:null} user={usuario?user?true:false:null}/>
          <div className='col-12 MyClasses-container d-flex flex-column flex-md-row'>
            <div className='col-lg-3 col-12 col-md-4 MyClasses-summary py-2'>

             {!detail?
              <div className='d-flex flex-column justify-content-start'>
                <h2 className='text-center'>{clases.length} {t('myClasses.28','clases')}</h2>
                <div className='d-flex flex-row align-items-center'>
                  <Search className='mr-2'/>
                  <input type='search' placeholder='Buscar clase...' onChange={handleBuscador} className='rounded'/>
                  <ArrowRepeat className='ml-2' size={'2em'} onClick={handleRefresh} style={{cursor:'pointer'}}/>
                </div>
                  <form className='pt-1 pt-lg-3'>
                    <div className='d-flex flex-column justify-content-between'>
                      <p className='text-center d-none d-lg-inline'><i>{t('myClasses.2','Filtros')}</i></p>

                        <select id="type"
                          name="type"
                          onChange={handleTypeChange}
                          className='custom-select'
                          >
                          <option value="todos" >{t('allClases.1','Tipo de ejercicio (Todos)')}</option>
                          <option value="estiramiento">{t('allClases.2','Estiramiento (ej. Yoga)')}</option>
                          <option value="baile">{t('allClases.3','Baile')}</option>
                          <option value="funcional">{t('allClases.4','Funcional')}</option>
                          <option value="pelea">{t('allClases.5','Técnica de pelea')}</option>
                          <option value="pesas">{t('allClases.6','Con pesas')}</option>
                          <option value="otro">{t('allClases.7','Otro')}</option>
                        </select>

                      <select id="level"
                        name="level"
                        className='custom-select'
                        onChange={handleLevelChange}
                        >
                        <option value="todos" >{t('allClases.8','Dificultad de la clase (Todas)')}</option>
                        <option value="principiantes">{t('allClases.9','Para principiantes')}</option>
                        <option value="intermedia">{t('allClases.10','Intermedia')}</option>
                        <option value="avanzada">{t('allClases.11','Avanzada')}</option>
                      </select>

                      <select id="duration"
                        name="duration"
                        className='custom-select'
                        onChange={handleDurationChange}
                        >
                        <option value='todos'>{t('allClases.12','Duración (Todas)')}</option>
                        <option value={'0'}>{t('allClases.13','0 - 30 min')}</option>
                        <option value={'1'}>{t('allClases.14','30 - 60 min')}</option>
                        <option value={'2'}>{t('allClases.15','Más de 60 min')}</option>
                      </select>
                    </div>
                  </form>

                {props.market?
                  <div className='d-flex flex-column'>
                    <button className='btn-secondary rounded btn-lg mt-2' onClick={handleRefresh}><ArrowLeft />{t('myClasses.1',' Regresar')}</button>
                  </div>
                  :
                <div className='d-flex flex-row mt-1 mt-lg-5 align-items-center justify-content-center' onClick={handleNewClass} style={{cursor:'pointer'}}>
                  <h3 className='mr-2'>{t('myClasses.3','Nueva Clase')}</h3>
                  <PlusCircleFill size={'2em'}/>
                </div>}
              </div>
              :claseDetail? !props.market?
              <div className='d-flex flex-column'>
                <CreateZoomMeetingCard meetingTopic={claseDetail.data.title} meetingType={2} claseID={claseDetail.id}/>
                <button className='btn-lg btn-secondary my-3' onClick={handleEditClass}>{t('myClasses.4','Editar clase ')}<PencilSquare /></button>
              </div>:
              <div>
                <h4>{t('myClasses.5','Clase por Zoom')}: ${claseDetail.data.zoomPrice}</h4>
                <h4>{t('myClasses.6','Renta de Video')}: ${claseDetail.data.offlinePrice}</h4>
              </div>
                :null }
            </div>

            <div className='p-lg-2 pt-1 d-flex flex-row flex-wrap justify-content-center justify-content-lg-start'>
            {detail&&claseDetail?
              <div style={{position: 'relative'}}>
                <InstructorsDetailCard data={claseDetail.data} claseID={claseDetail.id} market={props.market?props.market:false} instructor={props.instructor}/>
                <X className='float-left'size={'2em'} onClick={handleDetail} style={{position: 'absolute', top:'0%', left:'0%',cursor:'pointer'}}/>
              </div>:

            clases?clases.map(clase => (
              <div key={clase.id} onClick={handleDetail} style={{cursor:'pointer'}} className='MyClasses-card'>
                <ClassCard title={clase.data.title} picture={clase.data.imgURL} name={clase.id}/>
              </div>
            )):<h4 style={{color: 'gray'}}><i>{t('myClasses.7','No se ha creado ninguna clase')}</i></h4>}
            </div>

          </div>
      </div>
    )}

}

export default withRouter(MyClasses)
