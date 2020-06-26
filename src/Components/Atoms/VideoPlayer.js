import React from 'react';
import {storage} from "../../Config/firestore.js"
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
    if (this.props.Image != null) {
      storage.ref("Pictures")
             .child(this.props.Image)
             .getDownloadURL()
             .then(url => {
               this.setState({ IMGurl: url });
             })
    }

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
        <ReactPlayer
        // Disable right click
        onContextMenu={e => e.preventDefault()}
        url={this.state.Videourl}
        controls = {true}
        light={this.state.IMGurl}
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
