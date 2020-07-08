import React from 'react';
import Header from '../Molecules/Header'

class Sales extends React.Component {
  constructor() {
    super()
  }

  render(){
    return (
      <div>
        <Header type={1} />
          <div >
            <h1> Ventas </h1>
          </div>
      </div>
    )
  }
}

export default Sales
