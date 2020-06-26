import React from 'react';
import {storage} from "../Config/firestore.js"
import ReactPlayer from 'react-player'

class VideoPlayer extends React.Component{
  constructor(props){
    super(props)
    this.state={
      IMGurl:false,
      VideoURL:""
    }
  }

  componentDidMount(){
    storage.ref("Pictures")
           .child(this.props.Image)
           .getDownloadURL()
           .then(url => {
             this.setState({ IMGurl: url });
           })
     storage.ref("Videos")
                  .child(this.props.Video)
                  .getDownloadURL()
                  .then(url => {
                    this.setState({ Videourl: url });
                  })
      console.log(this.state.IMGurl);
  }

  render(){
    return(
      <div>
        <ReactPlayer url={this.state.Videourl} controls = {true} light={this.state.IMGurl} />
      </div>
    )
  }

}

export default VideoPlayer
