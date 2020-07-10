import React from 'react';
import Header from '../Molecules/Header'

class MonthlyProgram extends React.Component {
  constructor() {
    super()
  }

  render(){
    return (
      <div>
        <Header type={1} />
          <div>
            <h1> Programa Mensual </h1>
          </div>
      </div>
    )
  }
}

export default MonthlyProgram
