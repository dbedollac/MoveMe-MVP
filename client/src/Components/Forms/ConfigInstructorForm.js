import React, { useState, useContext, useEffect } from "react";
import { useFormik } from 'formik';
import {db, storage} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import './ConfigInstructorForm.css'
import { withRouter } from "react-router";
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

const ConfigInstructorForm = (props) => {
const { usuario } = useContext(Auth);
const [data,setdata] = useState({})
const { t } = useTranslation();

useEffect(() => {
  if (usuario) {
  var docRef = db.collection("Instructors").doc(usuario.uid);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            setdata(doc.data())
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }
  })

  const handleClick = () =>{
      storage.ref('Pictures')
               .child(usuario.uid+'-profile')
               .getDownloadURL()
               .then(url => {
                 db.collection("Instructors").doc(usuario.uid).set({
                   imgURL: url
                 },{ merge: true }) ;
              }).catch(function (error) {
                console.error("No se ha subido ninguna foto de perfil ", error)
              });

  }

// Pass the useFormik() hook initial form values and a submit function that will
// be called when the form is submitted
const formik = useFormik({
  enableReinitialize: true,
  initialValues: {
    profileName: data.profileName,
    selfDescription: data.selfDescription,
    disableTrialClasses: false,
    firstName: data.firstName,
    lastName: data.lastName
  },
  onSubmit: values => {
    db.collection("Instructors").doc(usuario.uid).set({
    profileName: values.profileName,
    firstName: values.firstName,
    lastName: values.lastName,
    selfDescription: values.selfDescription,
    disableTrialClasses: values.disableTrialClasses,
    new: false
    },{ merge: true })
    alert(props.newInstructor?t('config.3','¡Ahora enlaza tu cuenta de Zoom!'):t('config.4','Tus datos se guardaron con éxito'));
    handleClick()
  },
});

  return(
  <form onSubmit={formik.handleSubmit} >
      <div className="d-flex flex-row flex-wrap">
          <div className="col-md-7">
          <p><strong>{t('config.5','Datos para crear tu perfil')}</strong></p>
            <label htmlFor="profileName">{t('config.6','Nombre del perfil')}</label>
            <br/>
            <input
              id="profileName"
              name="profileName"
              type="text"
              placeholder={t('config.18','¿Cómo te conocen tus clientes?')}
              onChange={formik.handleChange}
              value={formik.values.profileName}
              required
              className='col-md-10'
            />
            <label htmlFor="selfDescription">{t('config.7','Cuéntale al mundo de ti')}</label>
            <br/>
            <textarea
              id="selfDescription"
              name="selfDescription"
              type="text"
              rows='4'
              placeholder={t('config.19','Describe tu experiencia fitness (promociona aquí tu reto mensual)')}
              onChange={formik.handleChange}
              value={formik.values.selfDescription}
              className='col-md-10'
            />
            <br/>
            <div>
              <label htmlFor="disableTrialClasses" className='mr-md-2'>{t('config.8','Deshabilitar clases prueba')}</label>
              <input
                id="disableTrialClasses"
                name="disableTrialClasses"
                type="checkbox"
                className="checkbox"
                onChange={formik.handleChange}
                value={formik.values.trialClasses}
                defaultChecked={data.disableTrialClasses}
              />
              <div className="clasesPrueba col-md-7">
                <p>{t('config.9','Tus nuevos clientes tienen derecho a tomar su ')}<strong>{t('config.10','primer clase (prueba) gratis')}</strong>, {t('config.11','al deshabilitar esta opción tendrán que pagar desde la primer clase.')}</p>
              </div>
            </div>
          </div>
          <div>
            <p><strong>{t('config.12','Datos para depositarte tus ganancias')}</strong></p>
            <label htmlFor="firstName">{t('config.13','Nombre')}</label>
            <br/>
            <input
              id="firtsName"
              name="firstName"
              type="text"
              placeholder={t('config.20','Nombre(s)')}
              onChange={formik.handleChange}
              value={formik.values.firstName}
              className='col-12'
              required
            />
            <br/>
            <label htmlFor="lastName">{t('config.14','Apellido(s)')}</label>
            <br/>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={t('config.21','Apellido(s)')}
              onChange={formik.handleChange}
              value={formik.values.lastName}
              className='col-12'
              required
            />
          </div>
        </div>

        <div className='text-center'>
          <button type="submit" className="mt-3 btn-secondary btn-lg col-10">{t('config.17','Guardar')}</button>
        </div>
  </form>
)

}

export default ConfigInstructorForm
