import {iva} from '../../Config/Fees'

function StripeFee(subtotal) {
  if (subtotal>0) {
    var total=((subtotal+3)/(1-0.036))
  } else {
    var total=subtotal
  }

  return (total-subtotal)*(1+iva)
}

export default StripeFee