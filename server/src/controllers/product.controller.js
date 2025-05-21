import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Product from '../models/product.js'
import ProductVariant from '../models/productvariants.js'
import ProductImage from "../models/productimage.js";
import { sequelize } from "../config/dbConnect.js";


const createProduct = asyncHandler(async (req, res) => {
    const { product, variants, images } = req.body
    const id = req.user.id

    const transaction = await sequelize.transaction()

    try {
        const createdProduct = await Product.create({
            title: product.title,
            description: product.description,
            vendor: product.vendor,
            tags: product.tags,
            category: product.category,
            createdBy: id
        }, { transaction })

        console.log(createdProduct)

        if(!createProduct) throw new ApiError(400, "Failed to create Product")

        if (variants && variants.length > 0) {
            const variantInstances = variants.map(variant => ({
                ...variant,
                productId: createdProduct.id
            }))

            const createVariants = await ProductVariant.bulkCreate(variantInstances, { transaction })

            if(!createVariants) throw new ApiError(400, "Failed to create Variants")
        }

        

        if (images && images.length > 0) {
            const imageInstances = images.map((image, index) => ({
                image,
                position: index,
                productId: createdProduct.id
            }))

            const createImages = await ProductImage.bulkCreate(imageInstances, { transaction })
            if(!createImages) throw new ApiError(400, "Failed to add Images")

        }

        
        //commit transaction
        await transaction.commit()

        res.status(201).json(new ApiResponse(201, createdProduct, "Product Added Successfully"))

    } catch(error) {
        await transaction.rollback()
        throw new ApiError(500, error.message)
    }
})

export {createProduct}