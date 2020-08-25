import React, { useState, useContext, useEffect } from "react";
import { useFormik } from 'formik';
import {db, storage} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import { Spinner} from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive'

const EditClassForm = (props) => {
const { usuario } = useContext(Auth);
const [loading,setLoading] = useState(false)
const isMD = useMediaQuery({
  query: '(min-device-width: 768px)'
})

const saveMedia = async (values) =>{
    await setLoading(true)
    await storage.ref('Pictures')
             .child(usuario.uid+'-'+props.claseID)
             .getDownloadURL()
             .then(url => {
               db.collection("Instructors").doc(usuario.uid).collection("Classes").doc(props.claseID).set({
                 imgURL: url
               },{ merge: true }) ;
            }).catch(function (error) {
              console.error("No se ha subido ninguna foto de perfil ", error)
            });

    await storage.ref('Videos')
               .child(usuario.uid+'-'+props.claseID)
               .getDownloadURL()
               .then(url => {
                 db.collection("Instructors").doc(usuario.uid).collection("Classes").doc(props.claseID).set({
                   videoURL: url
                   },{ merge: true }) ;
                }).catch(function (error) {
                  console.error("No se ha subido ninguna foto de perfil ", error)
                });
    await db.collection("Instructors").doc(usuario.uid).collection("Classes").doc(props.claseID).set({
                  title: values.title,
                  description: values.description,
                  type: values.type,
                  level: values.level,
                  equipment: values.equipment,
                  duration: values.duration,
                  zoomPrice: values.zoomPrice,
                  offlinePrice: values.offlinePrice,
                  freeVideo: values.freeVideo
                },{ merge: true })
      return  alert('Tu clase se editó con éxito');
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
    title: props.claseData.title,
    description: props.claseData.description,
    type: props.claseData.type,
    level: props.claseData.level,
    equipment: props.claseData.equipment,
    duration: props.claseData.duration,
    zoomPrice: props.claseData.zoomPrice,
    offlinePrice: props.claseData.offlinePrice,
    freeVideo: props.claseData.freeVideo

  },
  validate,
  onSubmit: async values => {
    await saveMedia(values)
    window.location.reload(false)
    setLoading(false)
  },
});

  return(
  <form onSubmit={formik.handleSubmit} className='d-flex flex-column align-items-center' >
    <div className="d-flex flex-column flex-md-row flex-md-wrap mt-2">
        <div className='d-flex flex-column col-md-6 mb-2'>
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
        <div className='d-flex flex-column col-md-6 mb-2'>
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
        <div className='d-flex flex-column col-md-6 mb-2'>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              type="text"
              rows='4'
              cols={isMD?"50":null}
              placeholder='Describe de manera breve en qué consiste la clase'
              onChange={formik.handleChange}
              value={formik.values.description}
            />
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
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
        <div className='d-flex flex-column col-md-6 mb-2'>
            <label htmlFor="equipment">Equipo necesario</label>
            <textarea
              id="equipment"
              name="equipment"
              type="text"
              rows='4'
              cols={isMD?"50":null}
              placeholder='Agrega el equipo necesario para la clase'
              onChange={formik.handleChange}
              value={formik.values.equipment}
            />
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
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
        <div className='d-flex flex-column col-md-6 mb-2'>
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
                MXN
                </div>
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
              <label htmlFor="offlinePrice">Precio por renta del video (1 mes)</label>
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
                MXN
                </div>
                <div className='d-flex flex-row align-items-center'>
                  <label htmlFor="freeVideo" className='mr-2 mt-1'><i>Video gratis</i></label>
                  <input
                    id="freeVideo"
                    name="freeVideo"
                    type="checkbox"
                    className="checkbox"
                    onChange={formik.handleChange}
                    value={formik.values.freeVideo}
                    defaultChecked={formik.values.freeVideo}
                  />
                </div>
        </div>
    </div>
    {loading?<Spinner animation="border" />:<button type="submit" className="my-2 mt-md-5 btn-secondary btn-lg col-6">Guardar</button>}
  </form>
)

}

export default withRouter(EditClassForm)
