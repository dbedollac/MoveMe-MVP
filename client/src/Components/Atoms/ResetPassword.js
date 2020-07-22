import React from 'react'
import {auth} from '../../Config/firestore'

function ResetPassword(props) {
  auth.sendPasswordResetEmail(props.email).then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
});
}

export default ResetPassword
