import React from 'react';
import './App.css';
import {db} from "./Config/firestore.js"
import VideoPlayer from "./Components/Atoms/VideoPlayer.js"

function App() {

  return (
    <VideoPlayer Image="MM1B.jpg" Video="DescripciónProblema_DB.MOV" />
  );
}

export default App;
