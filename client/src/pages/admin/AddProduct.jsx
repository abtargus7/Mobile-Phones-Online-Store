import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { useSelector } from "react-redux";
import ImageDisplayManager from "../../components/DroppableImages";
import axios from 'axios'
import API_BASE_URL from "../../utils/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


// schema to validate form fields
const productSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  category: z.string().min(2).max(50),
  status: z.string().min(2).max(50),
  vendor: z.string().min(2).max(50)

});

// page for adding a new product
const AddProduct = () => {

  const navigate = useNavigate()
  // fetch newly uploaded images
  const { images } = useSelector((state) => state.product)

  // store variants 
  const [variants, setVariants] = useState([{
    variantTitle: "",
    inventoryQuantity: 0,
    price: "",
    comparePrice: "",
    cost: "",
    sku: ""
  }])


  // update variant state
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  // add new variant form row
  const addVariantRow = () => {
    setVariants(prev => ([...prev, { size: "", sku: "", quantity: "" }]));
  }

  // hook to track values of product form
  const productForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      status: "",
      vendor: ""
    },
  });

  // send api request to create new product
  const handleOnSubmit = async () => {
    // get product values from productForm
    const product = productForm.getValues()

    // combine product, variants and images to send with a request 
    const payload = {
      product: { ...product },
      variants,
      images
    }

    try {
      //send request with a payload
      const response = await axios.post(`${API_BASE_URL}/product`, payload, { withCredentials: true })
      if (response.status !== 201 || !response.data) throw new Error("Failed to add Product")
      toast(response.data.message)

      //navigae to product list page if prouduct created
      navigate("/admin/products")
    } catch (error) {
      toast(error.response?.data?.message || error.message || "Logout Failed")
    }
  }


  return (
    <div className="grid grid-cols-6 gap-6">
      <div className="col-span-5 p-6 space-y-6">
        {/* Product Details */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Product Details</h2>
          </CardHeader>
          <CardContent>
            {/* product form */}
            <Form {...productForm}>
              <form className="space-y-8">

                {/* product title */}
                <FormField
                  className=""
                  control={productForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Product title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* product description */}
                <FormField
                  className=""
                  control={productForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        {/* <Input placeholder="shadcn" {...field} type="number" /> */}
                        <Textarea placeholder="Write product description here " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-5">

                  {/* product category */}
                  <FormField
                    className="col-span-1"
                    control={productForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          {/* <Input placeholder="shadcn" {...field} type="number" /> */}
                          <Input placeholder="Prodct category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* product status */}
                  <FormField
                    className="col-span-1"
                    control={productForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Input placeholder="active" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* product vendor */}
                  <FormField
                    className="col-span-1"
                    control={productForm.control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor</FormLabel>
                        <FormControl>
                          {/* <Input placeholder="shadcn" {...field} type="number" /> */}
                          <Input placeholder="Product vendor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            {/* render cloudinary upload widget */}
            <UploadWidget />

            {/* render uploaded images */}
            <ImageDisplayManager />
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
                {/* variants form */}
                <Form>
                  <form className="grid grid-cols-3 gap-5">

                    {/* variant title */}
                    <FormItem>
                      <Label>Title</Label>
                      <Input onChange={(e) => handleVariantChange(index, "variantTitle", e.target.value)} name="variantTitle" value={variant.variantTitle} placeholder="Variant title" required />
                    </FormItem>

                    {/* variant quantity */}
                    <FormItem>
                      <Label>Quantity</Label>
                      <Input onChange={(e) => handleVariantChange(index, "inventoryQuantity", e.target.value)} name="inventoryQuantity" value={variant.inventoryQuantity} type="number" placeholder="Inventory quantity" />
                    </FormItem>

                    {/* variant SKU */}
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

          {/* button to add new variant from */}
          <div className="m-auto">
            <Button onClick={addVariantRow}>Add another variant</Button>
          </div>
        </Card>

        {/* submit form */}
        <div className="flex">
          <Button onClick={handleOnSubmit}>Add Product</Button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;