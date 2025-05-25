import { useState, useEffect } from "react"
import { SquarePen } from 'lucide-react';
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
import { Link } from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const user = useSelector((state) => state.user)

    const getProductsCreatedByAdmin = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/product/user`, { withCredentials: true })

            if (response.status !== 200 || !response.data) throw new Error("No products found")

            setProducts(response.data.data)
            toast(response.data.message)
        } catch (error) {
            toast(error.response?.data?.message || error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductsCreatedByAdmin()
    }, [])

    if (loading) return <div className="text-center text-lg font-medium">Loading...</div>
    return (

        <div className="mt-5 px-4 py-3 bg-white rounded">
            <div className="mx-auto overflow-auto text-xs px-3 py-2 my-3 rounded border border-slate-300 hover:border-slate-400">
                <Table className="min-w-full divide-y divide-gray-200 text-xs">
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
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200 text-gray-500">
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell className="px-6 py-4 whitespace-nowrap flex items-center">
                                    <img
                                        src={product.ProductImages[0].image}
                                        alt="Product"
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <span>
                                        {product.title.length > 30
                                            ? product.title.slice(0, 30) + "..."
                                            : product.title}
                                    </span>
                                </TableCell>
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
                                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{product.ProductVariants[0].inventoryQuantity}</TableCell>
                                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{product.category}</TableCell>
                                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{product.vendor}</TableCell>
                                <TableCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <Link to={`/admin/product/${product.id}`}>
                                        <SquarePen />
                                    </Link>

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
