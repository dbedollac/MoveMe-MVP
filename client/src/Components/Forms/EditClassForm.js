import React, { useState, useContext, useEffect } from "react";
import { useFormik } from 'formik';
import {db, storage} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import { Spinner} from 'react-bootstrap'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next';

const EditClassForm = (props) => {
const { usuario } = useContext(Auth);
const [loading,setLoading] = useState(false)
const isMD = useMediaQuery({
  query: '(min-device-width: 768px)'
})
const { t } = useTranslation();

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
      return  alert(t('myClasses.9','Tu clase se editó con éxito'));
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
            <label htmlFor="title">{t('myClasses.10','Título de la clase')}</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder={t('myClasses.11','¿Cómo das a conocer esta clase con tus clientes?')}
              onChange={formik.handleChange}
              value={formik.values.title}
              required
            />
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
            <label htmlFor="type">{t('myClasses.12','Tipo de ejercicio')}</label>
            <select id="type"
              name="type"
              onChange={formik.handleChange}
              value={formik.values.type}
              required>
              <option value="estiramiento">{t('allClases.2','Estiramiento (ej. Yoga)')}</option>
              <option value="baile">{t('allClases.3','Baile')}</option>
              <option value="funcional">{t('allClases.4','Funcional')}</option>
              <option value="pelea">{t('allClases.5','Técnica de pelea')}</option>
              <option value="pesas">{t('allClases.6','Con pesas')}</option>
              <option value="otro">{t('allClases.7','Otro')}</option>
            </select>
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
            <label htmlFor="description">{t('myClasses.13','Descripción')}</label>
            <textarea
              id="description"
              name="description"
              type="text"
              rows='4'
              cols={isMD?"50":null}
              placeholder={t('myClasses.14','Describe de manera breve en qué consiste la clase')}
              onChange={formik.handleChange}
              value={formik.values.description}
            />
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
            <label htmlFor="level">{t('myClasses.15','Dificultad de la clase')}</label>
            <select id="level"
              name="level"
              onChange={formik.handleChange}
              value={formik.values.level}
              required>
              <option value="principiantes">{t('allClases.9','Para principiantes')}</option>
              <option value="intermedia">{t('allClases.10','Intermedia')}</option>
              <option value="avanzada">{t('allClases.11','Avanzada')}</option>
            </select>
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
            <label htmlFor="equipment">{t('myClasses.16','Equipo necesario')}</label>
            <textarea
              id="equipment"
              name="equipment"
              type="text"
              rows='4'
              cols={isMD?"50":null}
              placeholder={t('myClasses.17','Agrega el equipo necesario para la clase')}
              onChange={formik.handleChange}
              value={formik.values.equipment}
            />
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
            <label htmlFor="duration">{t('myClasses.18','Duración aproximada')}</label>
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
              {t('myClasses.19','minutos')}
              </div>
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
              <label htmlFor="zoomPrice">{t('myClasses.20','Precio por clase en Zoom')}</label>
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
                <i style={{color:'gray',fontSize:'small'}}>{t('mPrice.20','Se agregará tarifa por transacción')}</i>
        </div>
        <div className='d-flex flex-column col-md-6 mb-2'>
              <label htmlFor="offlinePrice">{t('myClasses.21','Precio por renta del video (1 mes)')}</label>
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
                <i style={{color:'gray',fontSize:'small'}}>{t('mPrice.20','Se agregará tarifa por transacción')}</i>
                <div className='d-flex flex-row align-items-center'>
                  <label htmlFor="freeVideo" className='mr-2 mt-1'><i>{t('myClasses.22','Video gratis')}</i></label>
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
    {loading?<Spinner animation="border" />:<button type="submit" className="my-2 mt-md-5 btn-secondary btn-lg col-6">{t('myClasses.23','Guardar')}</button>}
  </form>
)

}

export default withRouter(EditClassForm)
