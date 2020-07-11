import React from 'react';
import Header from '../Molecules/Header'

class MarketPlace extends React.Component {
  constructor() {
    super()
  }

  render(){
    return (
      <div>
        <Header type={1} />
        <h1> Market Place </h1>
      </div>
    )
  }
}

export default MarketPlace
