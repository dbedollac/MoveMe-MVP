import React, { useState, useContext, useEffect } from "react";
import { CartPlus } from 'react-bootstrap-icons';

function AddToCar(props) {
  return(
    <>
      <button className={`btn-primary btn-${props.size}`}><CartPlus /> Agregar al Carrito</button>
    </>
  )
}

export default AddToCar
