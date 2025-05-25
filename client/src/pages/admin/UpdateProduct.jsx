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
import { addImages, addProduct, addVariant, addVariants, updateProduct, updateVariant } from "../../features/productSlice";

const productSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  category: z.string().min(2).max(50),
  status: z.string().min(2).max(50),
  vendor: z.string().min(2).max(50)

});


const UpdateProduct = () => {


    const {id} = useParams()
    console.log(id)
  const navigate = useNavigate()
  const { existingImages, product, images, variants } = useSelector((state) => state.product)
  const dispatch = useDispatch()

const handleVariantChange = (index, field, value) => {
        dispatch(updateVariant({index, field, value}))
        console.log(variants)
  };

const handleProductChange = (e) => {
      dispatch(updateProduct({field: e.target.name, value: e.target.value}))
}

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


  const productForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
     title: product?.title || "",
    description: product?.description || "",
    category: product?.category || "",
    status: product?.status || "",
    vendor: product?.vendor || ""

    },
  });

  const handleOnSubmit = async () => {
    
    

    try {
      const productResponse = await axios.put(`${API_BASE_URL}/product/${id}`, product, { withCredentials: true })

      if (productResponse.status !== 200 || !productResponse.data) throw new Error("Failed to update Product")
      
      const variantResponse = await axios.put(`${API_BASE_URL}/product/${id}/variants`, variants, {withCredentials: true})

      if(variantResponse.status !== 200 || !variantResponse.data) throw new Error("Failed to update variant")

      const imagesResponse = await axios.put(`${API_BASE_URL}/product/${id}/images`, {newImages: images, images: existingImages},{ withCredentials: true})
      
      if(!imagesResponse === 200 || !imagesResponse.data) throw new Error("Failed to update images")
      toast("Successfully Updated product")
      navigate(`/admin/product/${id}`)
    } catch (error) {
      console.log(error)
      toast(error.response?.data?.message || error.message || "Something went wrong")
    }
  }

  const getProudct = async() => {
        try {
            const response = await axios.get(`${API_BASE_URL}/product/${id}`)
            if(response.status !== 200 || !response.data) throw new Error("Product not found")

            const productData = {
                title: response.data.data.title,
                description: response.data.data.description,
                vendor: response.data.data.vendor,
                status: response.data.data.status,
                category: response.data.data.category,
            }
            dispatch(addProduct(productData))
            dispatch(addVariants(response.data.data.ProductVariants))
            dispatch(addImages(response.data.data.ProductImages))
            toast(response.data.message)
        } catch (error) {
            toast(error.response?.data?.message || error.message || "Something went wrong")
        }
        
  }

  useEffect(() => {
    getProudct()
  }, [])

  useEffect(() => {
  if (product) {
    productForm.reset({
      title: product.title,
      description: product.description,
      category: product.category,
      status: product.status,
      vendor: product.vendor
    });
  }
}, [product]);


  if(!product) return <div>Loading...</div>

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
                    <FormItem>
                      <Label>Proudct Title </Label>
                      <Input onChange={handleProductChange} name="title" value={product.title} placeholder="Product title" />
                    </FormItem>              
                    <FormItem>                     
                        <Textarea onChange={handleProductChange} placeholder="Write product description here " name="description" value={product.description} />
                    </FormItem>
               
                <div className="grid grid-cols-2 gap-5">
                  <FormItem>
                      <Label>Category</Label>
                      <Input onChange={handleProductChange} name="category" value={product.category} placeholder="Product category" />
                    </FormItem> 
                  <FormItem>
                      <Label>Status</Label>
                      <Input onChange={handleProductChange} name="status" value={product.status} placeholder="Product status" />
                    </FormItem> 
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
            <UploadWidget />
            <ImageDisplayManager recievedImags={existingImages}/>
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
                    <FormItem>
                      <Label>Title</Label>
                      <Input onChange={(e) => handleVariantChange(index, "variantTitle", e.target.value)} name="variantTitle" value={variant.variantTitle} placeholder="Variant title" />
                    </FormItem>
                    <FormItem>
                      <Label>Quantity</Label>
                      <Input onChange={(e) => handleVariantChange(index, "inventoryQuantity", e.target.value)} name="inventoryQuantity" value={variant.inventoryQuantity} type="number" placeholder="Inventory quantity" />
                    </FormItem>
                    <FormItem>
                      <Label>SKU</Label>
                      <Input onChange={(e) => handleVariantChange(index, "sku", e.target.value)} name="sku" value={variant.sku} placeholder="Variant SKU" />
                    </FormItem>
                    <FormItem>
                      <Label>Price</Label>
                      <Input onChange={(e) => handleVariantChange(index, "price", e.target.value)} name="price" value={variant.price} placeholder="Variant price" />
                    </FormItem>
                    <FormItem>
                      <Label>Compare Price</Label>
                      <Input onChange={(e) => handleVariantChange(index, "comparePrice", e.target.value)} name="comparePrice" value={variant.comparePrice} placeholder="Variant compare price" />
                    </FormItem>
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
      <div className="col-span-1 p-6 m">

      </div>
    </div>
  );
};

export default UpdateProduct;