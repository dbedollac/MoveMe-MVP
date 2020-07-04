import React, { useState, useContext, useEffect } from "react";
import { useFormik } from 'formik';
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import './ConfigInstructorForm.css'

const ConfigInstructorForm = () => {
const { usuario } = useContext(Auth);
const [data,setdata] = useState({})

useEffect(() => {
  var docRef = db.collection("Instructors").doc(usuario.email);

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
  })

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
  initialValues: {
    profileName: '',
    selfDescription: '',
    disableTrialClasses: false,
    firstName: "",
    lastName: '',
    CLABE: '',
    noTarjeta: ''
  },
  validate,
  onSubmit: values => {
    db.collection("Instructors").doc(usuario.email).set({
    profileName: values.profileName,
    firstName: values.firstName,
    lastName: values.lastName,
    CLABE: values.CLABE,
    noTarjeta: values.noTarjeta,
    selfDescription: values.selfDescription,
    disableTrialClasses: values.disableTrialClasses,
    },{ merge: true })
    alert('Tus datos se guardaron con éxito');
  },
});

  return(
  <form onSubmit={formik.handleSubmit}>
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
              placeholder={data.profileName}
              onChange={formik.handleChange}
              value={formik.values.profileName}
              required
            />
            <label htmlFor="selfDescription">Cuéntale a tus potenciales clientes sobre ti</label>
            <br/>
            <textarea
              id="selfDescription"
              name="selfDescription"
              type="text"
              rows='4'
              cols="50"
              placeholder={data.selfDescription}
              onChange={formik.handleChange}
              value={formik.values.selfDescription}
            />
            <br/>
            <div>
              <label htmlFor="disableTrialClasses">Deshabilitar clases prueba</label>
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
              placeholder={data.firstName}
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
              placeholder={data.lastName}
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
            <button type="submit" className="mt-3 btn-secondary btn-lg col-12">Guardar</button>
          </div>
        </div>
    </div>
  </form>
)

}

export default ConfigInstructorForm
