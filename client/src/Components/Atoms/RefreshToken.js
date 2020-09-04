import {zoomID, zoomSecret,zoomRedirectURL} from '../../Config/ZoomCredentials'
import {db} from '../../Config/firestore'
import {proxyurl} from '../../Config/proxyURL'

function RefreshToken(uid, token) {

  const requestUserAuthorization = () =>{
    window.location.href = 'https://zoom.us/oauth/authorize?response_type=code&client_id='+zoomID+'&redirect_uri='+zoomRedirectURL
  }

  var newTokens = null

  let url='zoomAPI/refresh-token'

  fetch(proxyurl+url,
  {method: 'POST',
    body: JSON.stringify({
         token: token,
         zoomID: zoomID,
         zoomSecret: zoomSecret
     }),
     headers: {
       "content-type": "application/json"
     }
  }).then((response)=>{
      Promise.resolve(response.json()).then( (resp) =>{
        if (resp.access_token) {
          db.collection("Instructors").doc(uid).set({
            zoomToken: resp.access_token,
            zoomRefreshToken: resp.refresh_token
          },{ merge: true }).then(console.log('Tokens refresheados')).catch((error)=>{
            console.log(error);
          })
        }else {
          requestUserAuthorization()
        }
      }
      )
  }).catch((error)=>{
    console.log(error);
  })

}

export default RefreshToken
