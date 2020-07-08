import React from 'react';
import Header from '../Molecules/Header'
import { Auth } from "../../Config/AuthContext";
import {db, auth} from '../../Config/firestore'
import { withRouter } from "react-router";
import {Redirect} from "react-router-dom";
import './MyClasses.css'
import NewClass from './NewClass'
import { PlusCircleFill, Search } from 'react-bootstrap-icons';
import ClassCard from '../Cards/ClassCard'

class MyClasses extends React.Component {
static contextType = Auth

  constructor() {
    super()
    this.state = {
      newclass: false,
      clases: [],
      pictures: [],
      filtersType: '',
      filtersLevel: '',
      filtersDuration: ''
      }
    }


  componentDidMount(){
    let user = this.context.usuario;
    console.log(user);

    auth.onAuthStateChanged((user) => {
      if (user===null) {
          this.props.history.push("/login");
      }
    })

    var Clases = []
    var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
    docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
             Clases.push({id:doc.id, data: doc.data()});
        });
        this.setState({
          clases: Clases,
          options : [
                { key: 'estiramiento', text: 'Estiramiento (ej. Yoga)', value: 'estiramiento' },
                { key: 'baile', text: 'Baile', value: 'baile' },
                { key: 'funcional', text: 'Funcional', value: 'funcional' },
                { key: 'pelea', text: 'Técnica de pela', value: 'pelea' },
                { key: 'pesas', text: 'Con pesas', value: 'pesas' },
              ]
        })
    });

  }

  handleClick = () =>{
    this.setState({
      newclass: true
    })
  }

  handleBuscador = (event) =>{
    let user = this.context.usuario;
    var Clases = []
    var Busca = event.target.value.toUpperCase()
    var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
    docRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
             Clases.push({id:doc.id, data: doc.data()});
        });
        var clases = Clases.filter(item => item.data.title.toUpperCase().includes(Busca));
        this.setState({clases: clases})
    });
  }

  handleTypeChange =(event) => {
    let user = this.context.usuario;
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

    const Clases = []
      var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          var clases0 = Clases.filter(item => item.data.type.includes(value));
          var clases1 = clases0.filter(item => item.data.level.includes(this.state.filtersLevel));
          switch (this.state.filtersDuration) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          this.setState({clases: clases2})
      });

      this.setState({
        filtersType : value
        }
      )
  }


  handleLevelChange =(event) => {
    let user = this.context.usuario;
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

    const Clases = []
      var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          var clases0 = Clases.filter(item => item.data.type.includes(this.state.filtersType));
          var clases1 = clases0.filter(item => item.data.level.includes(value));
          switch (this.state.filtersDuration) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          this.setState({clases: clases2})
      });

      this.setState({
        filtersLevel : value
        }
      )
  }

  handleDurationChange =(event) => {
    let user = this.context.usuario;
    var value =''
    if (event.target.value!=='todos') {
      value = event.target.value
    }

    const Clases = []
      var docRef = db.collection("Instructors").doc(user.email).collection("Classes");
      docRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
               Clases.push({id:doc.id, data: doc.data()});
          });
          var clases0 = Clases.filter(item => item.data.type.includes(this.state.filtersType));
          var clases1 = clases0.filter(item => item.data.level.includes(this.state.filtersLevel));
          switch (value) {
            case '0': var clases2 = clases1.filter(item => (item.data.duration<=30));
              break;
            case '1': var clases2 = clases1.filter(item => (item.data.duration<=60&&item.data.duration>30));
              break;
            case '2': var clases2 = clases1.filter(item => (item.data.duration>60));
              break;
            default: var clases2 = clases1.filter(item => (item.data.duration<=1000));
          }
          this.setState({clases: clases2})
      });

      this.setState({
        filtersDuration : value
        }
      )
  }

  render(){
    if (this.state.newclass) {
    return(
      <Redirect to='nuevaclase' />
    )
    } else {
    return (
      <div>
        <Header type={1} />
          <div className='MyClasses-container d-flex flex-row'>
            <div className='col-3 MyClasses-summary d-flex flex-column justify-content-start py-2'>
              <div className='my-1'>
                <h2 className='text-center'>{this.state.clases.length} clases</h2>
                <div className='d-flex flex-row align-items-center'>
                  <Search className='mr-2'/>
                  <input type='search' placeholder='Buscar clase...' onChange={this.handleBuscador}/>
                </div>
                <form className='pt-3'>
                  <div className='d-flex flex-column justify-content-between'>
                    <p className='text-center'><i>Filtros</i></p>

                      <select id="type"
                        name="type"
                        onChange={this.handleTypeChange}
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
                      onChange={this.handleLevelChange}
                      >
                      <option value="todos" selected>Dificultad de la clase (Todas)</option>
                      <option value="principiantes">Para principiantes</option>
                      <option value="intermedia">Intermedia</option>
                      <option value="avanzada">Avanzada</option>
                    </select>

                    <select id="duration"
                      name="duration"
                      className='mb-2'
                      onChange={this.handleDurationChange}
                      >
                      <option value='todos' selected>Duración (Todas)</option>
                      <option value={'0'}>0 - 30 min</option>
                      <option value={'1'}>30 - 60 min</option>
                      <option value={'2'}>Más de 60 min</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className='d-flex flex-row mt-5 align-items-center justify-content-center'>
                <h3>Nueva Clase</h3>
                <button className='ml-2 btn-outline-dark' onClick={this.handleClick}>
                  <PlusCircleFill size={'2em'}/>
                </button>
              </div>
            </div>
            <div className='mt-2 d-flex flex-row flex-wrap justify-content-start clases-container'>
            {this.state.clases?this.state.clases.reverse().map(clase => (
              <div className='col-3'>
                <ClassCard title={clase.data.title} picture={clase.data.imgURL} />
              </div>
            )):null}
            </div>
          </div>
      </div>
    )}
  }
}

export default withRouter(MyClasses)
