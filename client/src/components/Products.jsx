import axios from 'axios'
import { useState, useEffect } from 'react'
import API_BASE_URL from '../utils/api'
import ProductCard from './ProductCard'

const Products = () => {

    //store recieved product in a state
    const [products, setProducts] = useState([])

    //fetch product from backend
    const getProducts = async() => {
        try {
            const response = await axios.get(`${API_BASE_URL}/product`)
            if(response.status !== 200 || !response.data) throw new Error("No products found")
            console.log(response.data.data)
            setProducts(response.data.data)
        } catch (error) {
            toast(error.response?.data?.message || error.message || "No products found")
        }
    }

    //call getProduct method when page renders
    useEffect(() => {
      getProducts()
    }, [])
    

  return (
    <div className='my-auto'>
        <div className='text-center text-3xl py-8'>
            <div className='grid grid-cols-4 gap-4 gap-y-6'>
                {/* render products in a card */}
                {products.map(product => (
                    <ProductCard 
                        key={product.id}
                        id={product.id}
                        image={product.ProductImages[0].image} 
                        title={product.title}
                        price={product.ProductVariants[0].price}
                        comparePrice={product.ProductVariants[0].comparePrice}
                    />
                ))}
            </div>
        </div>
    </div>
  )
}

export default Products
