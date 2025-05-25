import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Cloudinary } from '@cloudinary/url-gen/index';
import { uwConfig } from "../../utils/cloudinary";
import UploadWidget from "../../components/UploadWidget";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageDisplayManager from "../../components/DroppableImages";
import axios from 'axios'
import API_BASE_URL from "../../utils/api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { addImages, addProduct, addVariant, addVariants, resetImages, updateProduct, updateVariant } from "../../features/productSlice";

// schema to validate form inputs
// const productSchema = z.object({
//   title: z.string().min(2).max(50),
//   description: z.string().min(2).max(500),
//   category: z.string().min(2).max(50),
//   status: z.string().min(2).max(50),
//   vendor: z.string().min(2).max(50)

// });

// page for update product
const UpdateProduct = () => {

  // product id 
  const { id } = useParams()

  const navigate = useNavigate()

  // fetch product state values from redux store
  const { existingImages, product, images, variants } = useSelector((state) => state.product)

  const dispatch = useDispatch()

  // track updates in a variant
  const handleVariantChange = (index, field, value) => {
    dispatch(updateVariant({ index, field, value }))
  };

  // track updates in a product
  const handleProductChange = (e) => {
    dispatch(updateProduct({ field: e.target.name, value: e.target.value }))
  }

  // add new form for new variant
  const addVariantRow = () => {
    dispatch(addVariant({
      variantTitle: "",
      inventoryQuantity: 0,
      price: "",
      comparePrice: "",
      cost: "",
      sku: "",
    }))
  }


  // hook to track product form values
  // const productForm = useForm({
  //   resolver: zodResolver(productSchema),
  //   defaultValues: {
  //     title: product?.title || "",
  //     description: product?.description || "",
  //     category: product?.category || "",
  //     status: product?.status || "",
  //     vendor: product?.vendor || ""

  //   },
  // });

  // send api request to update product
  const handleOnSubmit = async () => {
    try {

      // api request to update product
      const productResponse = await axios.put(`${API_BASE_URL}/product/${id}`, product, { withCredentials: true })

      if (productResponse.status !== 200 || !productResponse.data) throw new Error("Failed to update Product")

      // api request to update variants
      const variantResponse = await axios.put(`${API_BASE_URL}/product/${id}/variants`, variants, { withCredentials: true })

      if (variantResponse.status !== 200 || !variantResponse.data) throw new Error("Failed to update variant")

      // api request to update images
      const imagesResponse = await axios.put(`${API_BASE_URL}/product/${id}/images`, { newImages: images, images: existingImages }, { withCredentials: true })

      if (!imagesResponse === 200 || !imagesResponse.data) throw new Error("Failed to update images")
      toast("Successfully Updated product")

      // re render updated product
      getProudct()
    } catch (error) {
      toast(error.response?.data?.message || error.message || "Something went wrong")
    } finally {
      dispatch(resetImages())
    }
  }

  // fetch product from backend
  const getProudct = async () => {
    try {

      // api request
      const response = await axios.get(`${API_BASE_URL}/product/${id}`)
      if (response.status !== 200 || !response.data) throw new Error("Product not found")

      // structure data to store in a redux state
      const productData = {
        title: response.data.data.title,
        description: response.data.data.description,
        vendor: response.data.data.vendor,
        status: response.data.data.status,
        category: response.data.data.category,
      }

      // store product data in a redux state
      dispatch(addProduct(productData))

      // store product variants in a redux state
      dispatch(addVariants(response.data.data.ProductVariants))

      // store product images in a redux state
      dispatch(addImages(response.data.data.ProductImages))

    } catch (error) {
      toast(error.response?.data?.message || error.message || "Something went wrong")
    }

  }

  // fetch product from backend when page renders
  useEffect(() => {
    getProudct()
  }, [])

  // return loading until product loads in a state
  if (!product) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-6 gap-6">
      <div className="col-span-5 p-6 space-y-6">
        {/* Product Details */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Product Details</h2>
          </CardHeader>
          <CardContent>
            <Form>
              <form className="space-y-8">

                {/* title */}
                <FormItem>
                  <Label>Proudct Title </Label>
                  <Input onChange={handleProductChange} name="title" value={product.title} placeholder="Product title" />
                </FormItem>

                {/* description */}
                <FormItem>
                  <Textarea onChange={handleProductChange} placeholder="Write product description here " name="description" value={product.description} />
                </FormItem>

                <div className="grid grid-cols-2 gap-5">

                  {/* category */}
                  <FormItem>
                    <Label>Category</Label>
                    <Input onChange={handleProductChange} name="category" value={product.category} placeholder="Product category" />
                  </FormItem>

                  {/* status */}
                  <FormItem>
                    <Label>Status</Label>
                    <Input onChange={handleProductChange} name="status" value={product.status} placeholder="Product status" />
                  </FormItem>

                  {/* vendor */}
                  <FormItem>
                    <Label>Vendor</Label>
                    <Input onChange={handleProductChange} name="vendor" value={product.vendor} placeholder="Product vendor" />
                  </FormItem>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>


        {/* upload images */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Upload Images</h2>
          </CardHeader>
          <CardContent className='flex flex-col gap-5'>

            {/* call cloudinary upload widget */}
            <UploadWidget />

            {/* render existing and newly uploaded images */}
            <ImageDisplayManager recievedImags={existingImages} />

          </CardContent>
        </Card>

        {/* variants */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Variants</h2>
          </CardHeader>
          {variants.map((variant, index) => (
            <CardContent key={index} className="flex flex-col gap-5">
              <div className="border p-6">
                <Form>
                  <form className="grid grid-cols-3 gap-5">

                    {/* variant title */}
                    <FormItem>
                      <Label>Title</Label>
                      <Input onChange={(e) => handleVariantChange(index, "variantTitle", e.target.value)} name="variantTitle" value={variant.variantTitle} placeholder="Variant title" />
                    </FormItem>

                    {/* variant quantity */}
                    <FormItem>
                      <Label>Quantity</Label>
                      <Input onChange={(e) => handleVariantChange(index, "inventoryQuantity", e.target.value)} name="inventoryQuantity" value={variant.inventoryQuantity} type="number" placeholder="Inventory quantity" />
                    </FormItem>

                    {/* variant sku */}
                    <FormItem>
                      <Label>SKU</Label>
                      <Input onChange={(e) => handleVariantChange(index, "sku", e.target.value)} name="sku" value={variant.sku} placeholder="Variant SKU" />
                    </FormItem>

                    {/* variant price */}
                    <FormItem>
                      <Label>Price</Label>
                      <Input onChange={(e) => handleVariantChange(index, "price", e.target.value)} name="price" value={variant.price} placeholder="Variant price" />
                    </FormItem>

                    {/* variant compare price */}
                    <FormItem>
                      <Label>Compare Price</Label>
                      <Input onChange={(e) => handleVariantChange(index, "comparePrice", e.target.value)} name="comparePrice" value={variant.comparePrice} placeholder="Variant compare price" />
                    </FormItem>

                    {/* variant cost */}
                    <FormItem>
                      <Label>Cost</Label>
                      <Input onChange={(e) => handleVariantChange(index, "cost", e.target.value)} name="cost" value={variant.cost} placeholder="Variant cost" />
                    </FormItem>
                  </form>
                </Form>
              </div>
            </CardContent>
          ))}
          <div className="m-auto">
            <Button onClick={addVariantRow}>Add another variant</Button>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex">
          <Button onClick={handleOnSubmit}>Update Product</Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;