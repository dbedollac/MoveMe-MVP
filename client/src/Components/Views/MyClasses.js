import React, { useState, useContext, useEffect } from "react";
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import {Redirect} from "react-router-dom";
import './MyClasses.css'
import NewClass from '../Molecules/NewClass'
import { PlusCircleFill, Search, X, PencilSquare, ArrowLeft, ArrowRepeat } from 'react-bootstrap-icons';
import ClassCard from '../Cards/ClassCard'
import InstructorsDetailCard from '../Cards/InstructorsDetailCard'
import EditClass from '../Molecules/EditClass'
import CreateZoomMeetingCard from '../Cards/CreateZoomMeetingCard'

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
            <h2 className='col-10 text-center text-break' style={{color: '#F39119'}}>{claseDetail.data.title}</h2>
            <button className='col-2 float-right btn-lg btn-secondary mt-2 mr-2' onClick={handleEditClass}><ArrowLeft /> Regresar</button>
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
            <h2 className='col-10 text-center text-break' style={{color: '#F39119'}}>Clase Nueva</h2>
            <button className='col-2 float-right btn-lg btn-secondary mt-2 mr-2' onClick={handleNewClass}><ArrowLeft /> Regresar</button>
          </div>
          <NewClass />
        </div>
      )
    } else {
    return (
      <div >
        <Header instructor={usuario?user?!props.match.params.uid?true:false:true:null} user={usuario?user?true:false:null}/>
          <div className='col-12 MyClasses-container d-flex flex-row'>
             <div className='col-3 MyClasses-summary d-flex flex-column justify-content-start py-2'>
             {!detail?
              <div className='my-1'>
                <h2 className='text-center'>{clases.length} clases</h2>
                <div className='d-flex flex-row align-items-center'>
                  <Search className='mr-2'/>
                  <input type='search' placeholder='Buscar clase...' onChange={handleBuscador}/>
                  <ArrowRepeat className='ml-2' size={'2em'} onClick={handleRefresh} style={{cursor:'pointer'}}/>
                </div>
                <form className='pt-3'>
                  <div className='d-flex flex-column justify-content-between'>
                    <p className='text-center'><i>Filtros</i></p>

                      <select id="type"
                        name="type"
                        onChange={handleTypeChange}
                        className='mb-2'
                        >
                        <option value="todos" selected>Tipo de ejercicio (Todos)</option>
                        <option value="estiramiento">Estiramiento (ej. Yoga)</option>
                        <option value="baile">Baile</option>
                        <option value="funcional">Funcional</option>
                        <option value="pelea">Técnica de pelea</option>
                        <option value="pesas">Con pesas</option>
                        <option value="otro">Otro</option>
                      </select>

                    <select id="level"
                      name="level"
                      className='mb-2'
                      onChange={handleLevelChange}
                      >
                      <option value="todos" selected>Dificultad de la clase (Todas)</option>
                      <option value="principiantes">Para principiantes</option>
                      <option value="intermedia">Intermedia</option>
                      <option value="avanzada">Avanzada</option>
                    </select>

                    <select id="duration"
                      name="duration"
                      className='mb-2'
                      onChange={handleDurationChange}
                      >
                      <option value='todos' selected>Duración (Todas)</option>
                      <option value={'0'}>0 - 30 min</option>
                      <option value={'1'}>30 - 60 min</option>
                      <option value={'2'}>Más de 60 min</option>
                    </select>
                  </div>
                </form>
                {props.market?
                  <div className='d-flex flex-column'>
                    <button className='btn-secondary rounded btn-lg' onClick={handleRefresh}><ArrowLeft /> Regresar</button>
                  </div>
                  :
                <div className='d-flex flex-row mt-5 align-items-center justify-content-center'>
                  <PlusCircleFill size={'3em'} className='mr-2' onClick={handleNewClass} style={{cursor:'pointer'}}/>
                  <h3>Nueva Clase</h3>
                </div>}
              </div>
              :claseDetail? !props.market?
              <div className='d-flex flex-column'>
                <CreateZoomMeetingCard meetingTopic={claseDetail.data.title} meetingType={2} claseID={claseDetail.id}/>
                <button className='btn-lg btn-secondary my-3' onClick={handleEditClass}>Editar clase <PencilSquare /></button>
              </div>:
              <div>
                <h4>Clase por Zoom: ${claseDetail.data.zoomPrice}</h4>
                <h4>Renta de Video: ${claseDetail.data.offlinePrice}</h4>
              </div>
                :null }
            </div>

            <div className='p-2 d-flex flex-row flex-wrap justify-content-start clases-container'>
            {detail&&claseDetail?
              <div style={{position: 'relative'}}>
                <InstructorsDetailCard data={claseDetail.data} claseID={claseDetail.id} market={props.market?props.market:false} instructor={props.instructor}/>
                <X className='float-left'size={'2em'} onClick={handleDetail} style={{position: 'absolute', top:'0%', left:'0%',cursor:'pointer'}}/>
              </div>:

            clases?clases.map(clase => (
              <div className={`col-${clases.length>1?'3':'4'}`} key={clase.id} onClick={handleDetail} style={{cursor:'pointer'}}>
                <ClassCard title={clase.data.title} picture={clase.data.imgURL} name={clase.id}/>
              </div>
            )):null}
            </div>
          </div>
      </div>
    )}

}

export default withRouter(MyClasses)
