import React, { useState, useContext, useEffect } from "react";
import {zoomID, zoomRedirectURL} from '../../Config/ZoomCredentials'
import { useTranslation } from 'react-i18next';

const GetZoomToken = (props) =>{
  const { t } = useTranslation();

  const requestUserAuthorization = () =>{
    window.location.href = 'https://zoom.us/oauth/authorize?response_type=code&client_id='+zoomID+'&redirect_uri='+zoomRedirectURL
  }

    return(
      <div>
        <button disabled={props.disable} className="btn-outline-primary btn-lg" onClick={requestUserAuthorization}>{t('config.22','Enlazar mi cuenta Zoom')}</button>
      </div>
    )
  }

export default GetZoomToken
