import React,{useState} from 'react';
import {storage} from "../../Config/firestore.js"
import ReactPlayer from 'react-player'

function VideoPlayer(props) {

    return(
      <div>
        <ReactPlayer
        // Disable right click
        onContextMenu={e => e.preventDefault()}
        playing
        url={props.Video}
        controls = {true}
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
