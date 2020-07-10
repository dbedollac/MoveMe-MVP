import React, { useState, useContext, useEffect } from "react";
import { useFormik } from 'formik';
import {db, storage} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";

const NewClassForm = (props) => {
const { usuario } = useContext(Auth);
const [count, setcount] =useState(0)
const [picture,setpicture] = useState(null)


useEffect(()=>{
  if (props.Count) {
    setcount(props.Count)
  }
})

const handleClick = () =>{
    storage.ref('Pictures')
             .child(usuario.uid+'-clase'+count)
             .getDownloadURL()
             .then(url => {
               db.collection("Instructors").doc(usuario.email).collection("Classes").doc('clase'+count).set({
                 imgURL: url
               },{ merge: true }) ;
            }).catch(function (error) {
              console.error("No se ha subido ninguna foto de perfil ", error)
            });

    storage.ref('Videos')
               .child(usuario.uid+'-clase'+count)
               .getDownloadURL()
               .then(url => {
                 db.collection("Instructors").doc(usuario.email).collection("Classes").doc('clase'+count).set({
                   videoURL: url
                   },{ merge: true }) ;
                }).catch(function (error) {
                  console.error("No se ha subido ninguna foto de perfil ", error)
                });
}

const validate = values => {
const errors = {};
return errors;
};

// Pass the useFormik() hook initial form values and a submit function that will
// be called when the form is submitted
const formik = useFormik({
  enableReinitialize: true,
  initialValues: {
    title: '',
    description: '',
    type: '',
    level: '',
    equipment: '',
    duration: '',
    zoomPrice: 0,
    offlinePrice: 0

  },
  validate,
  onSubmit: values => {
    db.collection("Instructors").doc(usuario.email).collection("Classes").doc('clase'+count).set({
      title: values.title,
      description: values.description,
      type: values.type,
      level: values.level,
      equipment: values.equipment,
      duration: values.duration,
      zoomPrice: values.zoomPrice,
      offlinePrice: values.offlinePrice,
      imgURL: picture
    },{ merge: true })
    alert('Tu clase se creo con éxito');

    db.collection("Instructors").doc(usuario.email).set({
      countClasses: count
    },{ merge: true });
    handleClick();
    window.location.reload(false)
  },
});

  return(
  <form onSubmit={formik.handleSubmit} className='d-flex flex-column align-items-center' >
    <div className="d-flex flex-row flex-wrap mt-2">
        <div className='d-flex flex-column col-6 mb-2'>
            <label htmlFor="title">Título de la clase</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder='¿Cómo das a conocer esta clase con tus clientes?'
              onChange={formik.handleChange}
              value={formik.values.title}
              required
            />
        </div>
        <div className='d-flex flex-column col-6 mb-2'>
            <label htmlFor="type">Tipo de ejercicio</label>
            <select id="type"
              name="type"
              onChange={formik.handleChange}
              value={formik.values.type}
              required>
              <option value="estiramiento">Estiramiento (ej. Yoga)</option>
              <option value="baile">Baile</option>
              <option value="funcional">Funcional</option>
              <option value="pelea">Técnica de pelea</option>
              <option value="pesas">Con pesas</option>
              <option value="otro">Otro</option>
            </select>
        </div>
        <div className='d-flex flex-column col-6 mb-2'>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              type="text"
              rows='4'
              cols="50"
              placeholder='Describe de manera breve en qué consiste la clase'
              onChange={formik.handleChange}
              value={formik.values.description}
            />
        </div>
        <div className='d-flex flex-column col-6 mb-2'>
            <label htmlFor="level">Dificultad de la clase</label>
            <select id="level"
              name="level"
              onChange={formik.handleChange}
              value={formik.values.level}
              required>
              <option value="principiantes">Para principiantes</option>
              <option value="intermedia">Intermedia</option>
              <option value="avanzada">Avanzada</option>
            </select>
        </div>
        <div className='d-flex flex-column col-6 mb-2'>
            <label htmlFor="equipment">Equipo necesario</label>
            <textarea
              id="equipment"
              name="equipment"
              type="text"
              rows='4'
              cols="50"
              placeholder='Agrega el equipo necesario para la clase'
              onChange={formik.handleChange}
              value={formik.values.equipment}
            />
        </div>
        <div className='d-flex flex-column col-6 mb-2'>
            <label htmlFor="duration">Duración aproximada</label>
            <div>
              <input
                id="duration"
                name="duration"
                type="number"
                min={0}
                className='mr-1'
                onChange={formik.handleChange}
                value={formik.values.duration}
                required
              />
              minutos
              </div>
        </div>
        <div className='d-flex flex-column col-6 mb-2'>
              <label htmlFor="zoomPrice">Precio por clase en Zoom</label>
              <div>
                <input
                  id="zoomPrice"
                  name="zoomPrice"
                  type="number"
                  min={20}
                  className='mr-1'
                  onChange={formik.handleChange}
                  value={formik.values.zoomPrice}
                  required
                />
                pesos mexicanos (MXN)
                </div>
        </div>
        <div className='d-flex flex-column col-6 mb-2'>
              <label htmlFor="offlinePrice">Precio por renta mensual del video</label>
              <div>
                <input
                  id="offlinePrice"
                  name="offlinePrice"
                  type="number"
                  min={0}
                  className='mr-1'
                  onChange={formik.handleChange}
                  value={formik.values.offlinePrice}
                  onBlur={formik.handleBlur}
                  required
                />
                pesos mexicanos (MXN)
                </div>
        </div>
    </div>
    <button type="submit" className="mt-5 btn-secondary btn-lg col-6">Guardar</button>
  </form>
)

}

export default withRouter(NewClassForm)