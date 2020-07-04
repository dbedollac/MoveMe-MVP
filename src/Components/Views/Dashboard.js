import React from "react";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import {auth} from '../../Config/firestore'
import ChooseUserType from './ChooseUserType'
import InstructorProfile from './InstructorProfile'
import MarketPlace from './MarketPlace'
import queryString from 'query-string'
import {zoomID, zoomSecret, zoomRedirectURL} from '../../Config/ZoomCredentials'
import {db} from '../../Config/firestore'

class Dashboard extends React.Component {
  static contextType = Auth

  constructor(props) {
    super(props);
    this.state = {
      nombre: null,
      instructor: false,
      user: false
      }
  }

  componentDidMount(){
    let user = this.context.usuario;
    console.log(user);
    user?user.displayName?this.setState({nombre: user.displayName}):this.setState({nombre: user.email}):this.setState({nombre: null})

    auth.onAuthStateChanged((user) => {
      if (user===null) {
          this.props.history.push("/login");
      }
    })

    const parsed = queryString.parse(this.props.location.search);
    if (parsed.code) {
      const proxyurl = "https://cors-anywhere.herokuapp.com/"
      let url='https://zoom.us/oauth/token?grant_type=authorization_code&code='+parsed.code+'&redirect_uri='+zoomRedirectURL
      let header = "Basic "+ btoa(zoomID+':'+zoomSecret)
      fetch(proxyurl+url,
      {method: 'POST',
      headers:{
        "Authorization": header
      }
      }).then((response)=>{
          Promise.resolve(response.json()).then( (resp) =>{
            if(resp.access_token){
              db.collection("Instructors").doc(user.email).set({
                zoomToken: resp.access_token,
                zoomRefreshToken: resp.refresh_token
              },{ merge: true })
              alert('Tu cuenta de Zoom se enlazó correctamente');
            }
          }
          )
      }).catch((error)=>{
        console.log(error);
      })
    }

    if (user) {
      var docRef = db.collection("Instructors").doc(user.email);
      docRef.get().then((doc)=>{
      if (doc.exists) {
          this.setState({
            instructor: true
          });
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }

  }

  render(){
    if ((!this.state.instructor&&!this.state.user)||(this.state.instructor&&this.state.user)) {
      return <ChooseUserType />
    }else {
      if (this.state.instructor) {
        return <InstructorProfile />
      }else {
        return <MarketPlace />
      }
    }
  }
}

export default withRouter(Dashboard);
