import React from 'react';
import Header from '../Molecules/Header'
import './Sales.css'

class Sales extends React.Component {
  constructor() {
    super()
  }

  render(){
    return (
      <div>
        <Header instructor={true}/>
          <div className='Sales-container'>
            <h1> Ventas </h1>
          </div>
      </div>
    )
  }
}

export default Sales
