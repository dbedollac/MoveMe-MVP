function StripeFee(subtotal,number_products=1) {

  return subtotal>0?(subtotal*.036 + 3)*1.16:0
}

export default StripeFee
