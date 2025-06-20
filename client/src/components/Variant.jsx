import React from 'react'
import { Button } from './ui/button'

//variant buttons on a product page
const Variant = ({title, id}) => {

  return (
    <div className='flex gap-5'>
       
            <Button
                key={id}
                className={'h-12 flex justify-center items-center cursor-pointer border border-gray-300 text-gray-500 bg-black text-white'}
            >
                {title}
            </Button>

    </div>
  )
}

export default Variant
