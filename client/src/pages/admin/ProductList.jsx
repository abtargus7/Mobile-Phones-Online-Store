import { useState, useEffect } from "react"
import { SquarePen, Trash } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useSelector } from "react-redux";
import axios from "axios";
import API_BASE_URL from "../../utils/api";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";


// list the products created by user
const ProductList = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    // fetch products created by user from backend
    const getProductsCreatedByAdmin = async () => {
        setLoading(true)
        try {

            //api request
            const response = await axios.get(`${API_BASE_URL}/product/user`, { withCredentials: true })

            if (response.status !== 200 || !response.data) throw new Error("No products found")
            
            // store recieved products in a state
            setProducts(response.data.data)
        } catch (error) {
            toast(error.response?.data?.message || error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    // delete product
    const deleteProduct = async (id) => {
        try {
            // api request
            const response = await axios.delete(`${API_BASE_URL}/product/${id}`, { withCredentials: true })

            if (response.status !== 201 || !response.data) throw new Error("Failed to delete product")

            toast(response.data.message)

            // re render product list after removing product
            getProductsCreatedByAdmin()
        } catch (error) {
            toast(error.response?.data?.message || error.message || "Something went wrong")
        }
    }

    useEffect(() => {
        getProductsCreatedByAdmin()
    }, [])

    // loading until products fetched from backend
    if (loading) return <div className="text-center text-lg font-medium">Loading...</div>

    return (
        <div className="mt-5 px-4 py-3 bg-white rounded">
            <div className="mx-auto overflow-auto text-xs px-3 py-2 my-3 rounded border border-slate-300 hover:border-slate-400">
                {/* List all products */}
                <Table className="min-w-full divide-y divide-gray-200 text-xs">
                    {/* header row */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <Checkbox />
                            </TableHead>
                            <TableHead className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</TableHead>
                        </TableRow>
                    </TableHeader>

                    {/* product details */}
                    <TableBody className="bg-white divide-y divide-gray-200 text-gray-500">
                        {/* map products in the table */}
                        {products.map((product) => (
                            <TableRow key={product.id}>

                                {/* checkbox */}
                                <TableCell>
                                    <Checkbox />
                                </TableCell>

                                {/* product image */}
                                <TableCell className="px-6 py-4 whitespace-nowrap flex items-center">
                                    <img
                                        src={product?.ProductImages[0]?.image}
                                        alt="Product"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <span>
                                        {product.title.length > 30
                                            ? product.title.slice(0, 30) + "..."
                                            : product.title}
                                    </span>
                                </TableCell>

                                {/* product status */}
                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {product.status}
                                    </span>
                                </TableCell>

                                {/* product inventory quantity */}
                                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {product.ProductVariants[0].inventoryQuantity}
                                </TableCell>

                                {/* product category */}
                                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {product.category}
                                </TableCell>

                                {/* product vendor */}
                                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {product.vendor}
                                </TableCell>

                                {/* button to edit product */}
                                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <Link to={`/admin/product/${product.id}`}>
                                        <SquarePen className="text-green-800" />
                                    </Link>
                                </TableCell>

                                {/* button to delete product */}
                                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <Trash onClick={() => deleteProduct(product.id)} className="text-red-800" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ProductList
