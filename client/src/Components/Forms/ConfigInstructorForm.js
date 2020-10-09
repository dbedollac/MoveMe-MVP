import React, { useState, useContext, useEffect } from "react";
import { useFormik } from 'formik';
import {db, storage} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import './ConfigInstructorForm.css'
import { withRouter } from "react-router";
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import FileUploadPDF from '../Atoms/FileUploadPDF'
import {proxyurl} from '../../Config/proxyURL'

const ConfigInstructorForm = (props) => {
const { usuario } = useContext(Auth);
const [data,setdata] = useState({})
const [certSAT,setcertSAT] = useState(null)
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

},[usuario])

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

              fetch(proxyurl+'visionAPI', {
                method: 'post',
                headers: {
                  'Content-type': 'application/json',
                },
                body: JSON.stringify({
                  uid: usuario.uid
                }),
              })
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
    lastName: data.lastName,
    linkIG: data.linkIG,
    linkFB: data.linkFB
  },
  onSubmit: values => {
    db.collection("Instructors").doc(usuario.uid).set({
    profileName: values.profileName,
    firstName: values.firstName,
    lastName: values.lastName,
    selfDescription: values.selfDescription,
    disableTrialClasses: values.disableTrialClasses,
    new: false,
    linkIG: values.linkIG,
    linkFB: values.linkFB
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
            <label htmlFor="selfDescription">{t('config.7','Cuéntale al mundo de ti en 280 caractéres')}</label>
            <br/>
            <textarea
              id="selfDescription"
              name="selfDescription"
              type="text"
              rows='4'
              placeholder={t('config.19','Describe tu experiencia fitness')}
              onChange={formik.handleChange}
              value={formik.values.selfDescription}
              className='col-md-10'
              maxlength='280'
            />
            <br/>
            <label htmlFor="linkIG">{t('config.29','Comparte tu cuenta de Instagram')}</label>
            <br/>
            <textarea
              id="linkIG"
              name="linkIG"
              type="text"
              rows='1'
              placeholder={t('config.30','Link de Instagram')}
              onChange={formik.handleChange}
              value={formik.values.linkIG}
              className='col-md-10'
            />
            <br/>
            <label htmlFor="linkFB">{t('config.31','Comparte tu cuenta de Facebook')}</label>
            <br/>
            <textarea
              id="linkFB"
              name="linkFB"
              type="text"
              rows='1'
              placeholder={t('config.32','Link de Facebook')}
              onChange={formik.handleChange}
              value={formik.values.linkFB}
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
          <div className='col-md-5'>
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
            <div className='mt-3 mb-2'>
              <FileUploadPDF name={usuario?usuario.uid:null}/>
            </div>
            <div className="clasesPrueba col-md-12">
              <p><strong>{t('config.24','La puedes subir después.')}</strong> {t('config.25','Este documento es un PDF expedido por el SAT y lo necesitamos para cumplir con las disposiciones fiscales exigidas por el gobierno de México. Lo puedes obtener en este link:')}
              <a href='https://www.sat.gob.mx/aplicacion/53027/genera-tu-constancia-de-situacion-fiscal.' target="_blank"> https://www.sat.gob.mx/aplicacion/53027/genera-tu-constancia-de-situacion-fiscal. </a>
              {t('config.26','Una vez inicies sesión en la página del SAT, solo haz click en "Generar Constancia".')}
              </p>
            </div>
          </div>
        </div>

        <div className='text-center'>
          <button type="submit" className="mt-3 btn-secondary btn-lg col-10">{t('config.17','Guardar')}</button>
        </div>
  </form>
)

}

export default ConfigInstructorForm
