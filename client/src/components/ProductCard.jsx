import React from 'react'
import { Link } from 'react-router-dom'
import {
    Card,
    CardContent,
} from './ui/card'

const ProductCard = ({ id, image, title, price, comparePrice }) => {
    return (
        <Link to={`/product/${id}`} className='text-gray-700 cursor-pointer'>
            <Card >
                <CardContent>
                    {/* product image */}
                    <div className='overflow-hidden'>
                        <img
                            className='hover:scale-110 transition ease-in-out h-72'
                            loading='lazy'
                            src={image}
                            alt=""
                        />
                    </div>
                    
                    {/* product title */}
                    <p className='pt-3 pb-1 text-sm'>
                        {
                            title?.length > 35 
                            ? title.slice(0, 36) + "..."  
                            : title
                        } 
                    </p>

                    {/* product pricing */}
                    <div className='flex gap-5'>
                        <p className='text-sm font-medium'>₹{price}</p>
                        <p className='text-sm font-medium line-through text-gray-700'>₹{comparePrice}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default ProductCard
