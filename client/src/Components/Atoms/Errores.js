import React, { useState } from "react";

export default function Errores({mensaje}) {

  switch (mensaje) {
      case 'The email address is already in use by another account.':
          return (<p style={{color:'red'}}> Este correo ya está registrado. </p>)

      case 'There is no user record corresponding to this identifier. The user may have been deleted.':
          return (<p style={{color:'red'}}> No existe este usuario. </p>)

      case 'The email address is badly formatted.':
          return (<p style={{color:'red'}}> Correo electrónico no valido </p>)

      case 'Password should be at least 6 characters':
          return (<p style={{color:'red'}}> La clave debe tener al menos 6 caractéres. </p>)

      default:
          return <p style={{color:'red'}}> {mensaje} </p>
      }

}
