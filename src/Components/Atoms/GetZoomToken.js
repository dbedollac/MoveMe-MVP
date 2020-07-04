import React, { useState, useContext, useEffect } from "react";
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import {zoomID, zoomRedirectURL} from '../../Config/ZoomCredentials'
import {Redirect} from 'react-router'

const GetZoomToken = (props) =>{
  const { usuario } = useContext(Auth);

  const requestUserAuthorization = () =>{
    window.location.href = 'https://zoom.us/oauth/authorize?response_type=code&client_id='+zoomID+'&redirect_uri='+zoomRedirectURL
  }

    return(
      <div>
      <button disabled={props.disable} className="btn-outline-primary btn-lg" onClick={requestUserAuthorization}>Enlazar mi cuenta Zoom</button>
      </div>
    )
  }

export default GetZoomToken
