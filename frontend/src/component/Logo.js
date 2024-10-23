import React from 'react'
import logoImage from '../assest/ecommerce.png'

const Logo = ({w,h}) => {
  return (
    <img 
    src={logoImage}
    width={55}
    height={55}
    className='flex'
    />
  )
}

export default Logo
