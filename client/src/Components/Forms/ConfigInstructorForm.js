import React, { useState, useContext, useEffect } from "react";
import { useFormik } from 'formik';
import {db, storage} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import './ConfigInstructorForm.css'
import { withRouter } from "react-router";
import { Redirect } from 'react-router-dom'

const ConfigInstructorForm = (props) => {
const { usuario } = useContext(Auth);
const [data,setdata] = useState({})

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

const validate = values => {
const errors = {};

if(!values.CLABE && !values.noTarjeta){
  errors.bill = 'Se debe proporcionar la CLABE o el número de tarjeta';
}
return errors;
};

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
    CLABE: data.CLABE,
    noTarjeta: data.noTarjeta
  },
  validate,
  onSubmit: values => {
    db.collection("Instructors").doc(usuario.uid).set({
    profileName: values.profileName,
    firstName: values.firstName,
    lastName: values.lastName,
    CLABE: values.CLABE,
    noTarjeta: values.noTarjeta,
    selfDescription: values.selfDescription,
    disableTrialClasses: values.disableTrialClasses,
    new: false
    },{ merge: true })
    alert('Tus datos se guardaron con éxito');
    handleClick()
  },
});

  return(
  <form onSubmit={formik.handleSubmit} >
    <div className="d-flex flex-column">
      <div className="d-flex flex-row">
          <div className="col-7">
          <p><strong>Datos para crear tu perfil de instructor</strong></p>
            <label htmlFor="profileName">Nombre del perfil</label>
            <br/>
            <input
              id="profileName"
              name="profileName"
              type="text"
              placeholder={'¿Cómo te conocen tus clientes?'}
              onChange={formik.handleChange}
              value={formik.values.profileName}
              required
              className='col-10'
            />
            <label htmlFor="selfDescription">Cuéntale al mundo de ti</label>
            <br/>
            <textarea
              id="selfDescription"
              name="selfDescription"
              type="text"
              rows='4'
              cols="50"
              placeholder={'Describe tu experiencia fitness (promociona aquí tu reto mensual)'}
              onChange={formik.handleChange}
              value={formik.values.selfDescription}
            />
            <br/>
            <div>
              <label htmlFor="disableTrialClasses" className='mr-2'>Deshabilitar clases prueba</label>
              <input
                id="disableTrialClasses"
                name="disableTrialClasses"
                type="checkbox"
                className="checkbox"
                onChange={formik.handleChange}
                value={formik.values.trialClasses}
                defaultChecked={data.disableTrialClasses}
              />
              <div className="clasesPrueba col-7">
                <p>MoveMe ofrece a los usuarios nuevos tomar su primer clase (prueba) gratis, al deshabilitar esta opción tus clases no serán ofrecidas como clases prueba.</p>
              </div>
            </div>
          </div>
          <div>
            <p><strong>Datos para depositarte tus ganancias</strong></p>
            <label htmlFor="firstName">Nombre</label>
            <br/>
            <input
              id="firtsName"
              name="firstName"
              type="text"
              placeholder={'Nombre como en tarjeta'}
              onChange={formik.handleChange}
              value={formik.values.firstName}
              required
            />
            <br/>
            <label htmlFor="lastName">Apellido(s)</label>
            <br/>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={'Apellido(s) como en tarjeta'}
              onChange={formik.handleChange}
              value={formik.values.lastName}
              required
            />
            <br/>
            {(formik.touched.CLABE&&formik.touched.noTarjeta)&&formik.errors.bill ? <div style={{color: 'red'}}>{formik.errors.bill}</div> : null}
            <label htmlFor="CLABE">CLABE</label>
            <br/>
            <input
              id="CLABE"
              name="CLABE"
              type="tel"
              inputmode="numeric"
              pattern="[0-9\s]{13,19}"
              maxlength="19"
              placeholder={data.CLABE}
              onChange={formik.handleChange}
              value={formik.values.CLABE}
              onBlur={formik.handleBlur}
            />
            <br/>
            <label htmlFor="noTarjeta">Tarjeta de débito</label>
            <br/>
            <input
              id="noTarjeta"
              name="noTarjeta"
              type="tel"
              inputmode="numeric"
              pattern="[0-9\s]{13,19}"
              autocomplete="cc-number"
              maxlength="19"
              placeholder={data.noTarjeta}
              onChange={formik.handleChange}
              value={formik.values.noTarjeta}
              onBlur={formik.handleBlur}
            />
            <br/>
          </div>
        </div>
        <button type="submit" className="mt-3 btn-secondary btn-lg col-10 justify-self-center">Guardar</button>
    </div>
  </form>
)

}

export default ConfigInstructorForm
