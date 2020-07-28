import React,{useState} from 'react';
import {storage} from "../../Config/firestore.js"
import ReactPlayer from 'react-player'

function VideoPlayer(props) {
  const [play,setPlay] = useState(true)

  const handlePreview = () =>{
    setPlay(false)
  }


    return(
      <div>
        <ReactPlayer
        // Disable right click
        onContextMenu={e => e.preventDefault()}
        onStart={props.market?setInterval(handlePreview,60000):null}
        playing={play}
        url={props.Video}
        controls = {play}
        light={props.Image}
        width={props.videoWidth}
        height={props.videoHeight}
        config={{
          file: {
            attributes: {
              onContextMenu: e => e.preventDefault(),
              controlsList: `nodownload ${props.market?'nofullscreen':null}`,
              disablePictureInPicture: true
            }
          }
        }}/>
      </div>
    )


}

export default VideoPlayer
