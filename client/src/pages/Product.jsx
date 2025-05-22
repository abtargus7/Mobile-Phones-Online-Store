import React, { useState, useEffect } from 'react'
import Variant from '../components/Variant'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../utils/api'
import { toast } from 'sonner'

const Product = () => {

    const { id } = useParams()
    const [product, setProduct] = useState({})
    const [loading, setLoading] = useState(true)

    const getProduct = async () => {

        setLoading(true)

        try {
            const response = await axios.get(`${API_BASE_URL}/product/${id}`)
            if (response.status !== 200 || !response.data) throw new Error("Product not found")
            console.log(response.data.data)
            setProduct(response.data.data)
        } catch (error) {
            toast(error?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProduct()
    }, [])


    if (loading) return <div className="text-center text-lg font-medium">Loading...</div>

    return (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
            {/* product info */}
            <div className='flex gap-12'>
                {/* product images */}
                <div className='flex-1 flex gap-3'>
                    <div className='w-[80%]'>
                        <img
                            className='w-full h-auto rounded-2xl'
                            src={product?.ProductImages[0].image}
                            alt=''
                        />
                    </div>
                </div>

                {/* product info */}
                <div className='flex-1'>
                    {/* title */}
                    <h1 className='font-medium text-2xl mt-2'>{product.title}</h1>

                    {/* pricing */}
                    <div className='flex gap-5'>
                        <p className='mt-5 text-3xl font-medium'>₹ {product.ProductVariants[0].price}</p>
                        <p className='mt-5 text-3xl font-medium'>₹ {product.ProductVariants[0].comparePrice}</p>
                    </div>

                    {/* variants */}
                    <div className='flex flex-col gap-4 my-8'>
                        <h1 className='text-xl font-semibold text-gray-700'>Select Variant</h1>
                        <div className='flex gap-2'>
                            {product.ProductVariants.map(variant => (
                                <Variant title={variant.variantTitle} id={variant.id} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Product Description and review*/}
            <div className="mt-20">
                <div className="flex">
                    <b className="border px-5 py-3 text-sm">Description</b>
                </div>
                <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
                   {product.description}
                </div>
            </div>
        </div>

    )
}

export default Product
