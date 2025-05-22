import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from '../models/product.js'
import ProductVariant from '../models/productvariants.js'
import ProductImage from "../models/productimage.js";
import { sequelize } from "../config/dbConnect.js";

// insert product in the database 
const createProduct = asyncHandler(async (req, res) => {
    const { product, variants, images } = req.body
    const id = req.user.id

    //create transaction
    const transaction = await sequelize.transaction()

    try {
        //insert new product in the database
        const createdProduct = await Product.create({
            title: product.title,
            description: product.description,
            vendor: product.vendor,
            tags: product.tags,
            category: product.category,
            createdBy: id
        }, { transaction })

        console.log(createdProduct)

        //if product not inserted throw error
        if (!createProduct) throw new ApiError(400, "Failed to create Product")
        
        //insert product variants in the database
        if (variants && variants.length > 0) {
            const variantInstances = variants.map(variant => ({
                ...variant,
                productId: createdProduct.id
            }))

            const createVariants = await ProductVariant.bulkCreate(variantInstances, { transaction })

            //if variants not inserted throw error
            if (!createVariants) throw new ApiError(400, "Failed to create Variants")
        }

        //insert product images in the database
        if (images && images.length > 0) {
            const imageInstances = images.map((image, index) => ({
                image,
                position: index,
                productId: createdProduct.id
            }))

            const createImages = await ProductImage.bulkCreate(imageInstances, { transaction })

            //if images not inserted throw error
            if (!createImages) throw new ApiError(400, "Failed to add Images")

        }

        //commit transaction 
        await transaction.commit()

        //send response
        return res.status(201).json(new ApiResponse(201, createdProduct, "Product Added Successfully"))

    } catch (error) {
        //rollback transaction if error
        await transaction.rollback()
        throw new ApiError(500, error.message)
    }
})

//fetch product from the database
const getProduct = asyncHandler(async (req, res) => {
    const id = req.params.id

    //fetch product from database
    const product = await Product.findOne({
        where: { id },
        include: [
            { model: ProductVariant },
            { model: ProductImage }
        ]
    })

    //if product not found throw error
    if (!product) throw new ApiError(404, "Product not found")

    //send response
    return res.status(200).json(new ApiResponse(200, product, "Product Retrieved successfully"))

})

//update product 
const updateProduct = asyncHandler(async (req, res) => {
    const { product, variants, images } = req.body

    //create transaction
    const transaction = await sequelize.transaction()

    try {
        //if product has updates product will update
        if (product) {
            const [rowsUpdated, updatedProduct] = await Product.update(product, {
                where: { id: req.params.id },
                returning: true,
                transaction
            })
            
            //if nothing updated throw error
            if (!rowsUpdated) throw new ApiError(400, "Failed to update product")

        }

        //update variants
        if (variants && variants.length > 0) {
            const variantInstances = variants.map(variant => ({
                ...variant,
                productId: req.params.id
            }))

            //update variant or insert new if variant not exist
            if (variantInstances.length > 0) {
                await ProductVariant.bulkCreate(variantInstances, {
                    updateOnDuplicate: ["variantTitle", "inventoryQuantity", "price", "comparePrice", "cost", "sku"],
                    transaction
                })
            }

        }

        //update images 
        if (images && images.length > 0) {
            const imageInstances = images.map((image, index) => ({
                image: image.image,
                position: image.position ?? index,
                productId: req.params.id
            }))

            //update image or insert new if image not exist
            if (imageInstances > 0) {
                await ProductImage.bulkCreate(imageInstances, {
                    updateOnDuplicate: ["image", "position"],
                    transaction
                })
            }

        }

        //commit transaction
        await transaction.commit()

        //send response
        return res.status(200).json(new ApiResponse(200, null, "Product Updated successfully"))

    } catch (error) {
        //rollback transaction if error found
        await transaction.rollback()
        throw new ApiError(500, error.message)
    }
})

//delete product from the database
const deleteProduct = asyncHandler( async( req, res) => {
    const {id} = req.params

    //create transaction
    const transaction = await sequelize.transaction()

    try {
        //find product by id
        const product = await Product.findByPk(id)

        //throw error if product not found
        if(!product) throw new ApiError(404, "Product not found")
        
        //delete product variants associated with product
        await ProductVariant.destroy({
            where: {productId: id},
            transaction
        })

        //delete product images associated with product
        await ProductImage.destroy({
            where: {productId: id},
            transaction
        })

        //delete product itself
        await Product.destroy({where: {id}, transaction})

        //commit transaction
        await transaction.commit()

        //send response
        return res.status(200).json(new ApiResponse(200, {}, "Product removed successfully"))
    } catch (error) {
        //rollback transaction if error found
        await transaction.rollback()
        throw new ApiError(500, error.message)
    }
})

//get all products created by admin users from database
const getProductsCreatedByUser = asyncHandler( async(req, res) => {
    const userId = req.user.id

    //fetch products from database
    const products = await Product.findAll({
        where: {createdBy: userId},
        include: [
            {model: ProductVariant},
            {model: ProductImage}
        ],
        order: [["createdAt", "DESC"]]
    })

    //if products not found throw error
    if(!products.length) throw new ApiError(404, "No products found for this user")

    //send response
    return res.status(200).json(new ApiResponse(200, products, "Products retrieved successfully"))
})

//fetch all products from datatbase
const getAllProducts = asyncHandler( async(req ,res) => {

    //fetch all products
    const products = await Product.findAll({
        include: [
            {model: ProductImage},
            {model: ProductVariant}
        ],
        order: [["createdAt", "DESC"]]
    })

    //throw error if products not found
    if(!products) throw new ApiError(404, "No products found")

    //send response
    return res.status(200).json(new ApiResponse(200, products, "All products retrieved Successfully"))
})

//export all controllers
export { createProduct, getProduct, updateProduct, deleteProduct, getProductsCreatedByUser, getAllProducts}