import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Products from '../components/Products'

// home page 
const Home = () => {
    return (
        // render all products on home page
        <div>
            <Products />
        </div>
    )
}

export default Home
