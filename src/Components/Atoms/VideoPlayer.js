import React from 'react';
import {storage} from "../../Config/firestore.js"
import ReactPlayer from 'react-player'

class VideoPlayer extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div>
        <ReactPlayer
        // Disable right click
        onContextMenu={e => e.preventDefault()}
        url={this.props.Video}
        controls = {true}
        light={this.props.Image}
        width={this.props.videoWidth}
        height={this.props.videoWidth}
        config={{
          file: {
            attributes: {
              onContextMenu: e => e.preventDefault(),
              controlsList: 'nodownload'
            }
          }
        }}/>
      </div>
    )
  }

}

export default VideoPlayer
