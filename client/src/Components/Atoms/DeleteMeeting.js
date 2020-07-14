import React, { useState, useContext, useEffect } from "react";
import {proxyurl} from '../../Config/proxyURL'
import {db} from '../../Config/firestore'
import { Auth } from "../../Config/AuthContext";
import { TrashFill } from 'react-bootstrap-icons';

function DeleteMeeting() {
  return(
    <TrashFill color='black'/>
  )
}

export default DeleteMeeting
