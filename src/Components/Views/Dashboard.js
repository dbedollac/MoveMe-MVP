import React from "react";
import { Auth } from "../../Config/AuthContext";
import { withRouter } from "react-router";
import {auth} from '../../Config/firestore'
import ChooseUserType from './ChooseUserType'

class Dashboard extends React.Component {
  static contextType = Auth

  constructor(props) {
    super(props);
    this.state = {
      nombre: null
    }

  }

  componentDidMount(){
    let user = this.context.usuario;
    user?user.displayName?this.setState({nombre: user.displayName}):this.setState({nombre: user.email}):this.setState({nombre: null})

    auth.onAuthStateChanged((user) => {
      if (user===null) {
          this.props.history.push("/login");
      }
    })
  }


  render(){
    return(
      <ChooseUserType />
    )
  }
}

export default withRouter(Dashboard);
