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

        if (!createProduct) throw new ApiError(400, "Failed to create Product")

        if (variants && variants.length > 0) {
            const variantInstances = variants.map(variant => ({
                ...variant,
                productId: createdProduct.id
            }))

            const createVariants = await ProductVariant.bulkCreate(variantInstances, { transaction })

            if (!createVariants) throw new ApiError(400, "Failed to create Variants")
        }



        if (images && images.length > 0) {
            const imageInstances = images.map((image, index) => ({
                image,
                position: index,
                productId: createdProduct.id
            }))

            const createImages = await ProductImage.bulkCreate(imageInstances, { transaction })
            if (!createImages) throw new ApiError(400, "Failed to add Images")

        }

        //commit transaction
        await transaction.commit()

        return res.status(201).json(new ApiResponse(201, createdProduct, "Product Added Successfully"))

    } catch (error) {
        await transaction.rollback()
        throw new ApiError(500, error.message)
    }
})

const getProduct = asyncHandler(async (req, res) => {
    const id = req.params.id

    const product = await Product.findOne({
        where: { id },
        include: [
            { model: ProductVariant },
            { model: ProductImage }
        ]
    })

    console.log(product)

    if (!product) throw new ApiError(404, "Product not found")

    return res.status(200).json(new ApiResponse(200, product, "Product Retrieved successfully"))

})

const updateProduct = asyncHandler(async (req, res) => {
    const { product, variants, images } = req.body

    const transaction = await sequelize.transaction()

    try {
        if (product) {
            const [rowsUpdated, updatedProduct] = await Product.update(product, {
                where: { id: req.params.id },
                returning: true,
                transaction
            })

            if (!rowsUpdated) throw new ApiError(400, "Failed to update product")

        }

        if (variants && variants.length > 0) {
            const variantInstances = variants.map(variant => ({
                ...variant,
                productId: req.params.id
            }))

            if (variantInstances.length > 0) {
                await ProductVariant.bulkCreate(variantInstances, {
                    updateOnDuplicate: ["variantTitle", "inventoryQuantity", "price", "comparePrice", "cost", "sku"],
                    transaction
                })
            }

        }

        if (images && images.length > 0) {
            const imageInstances = images.map((image, index) => ({
                image: image.image,
                position: image.position ?? index,
                productId: req.params.id
            }))

            if (imageInstances > 0) {
                await ProductImage.bulkCreate(imageInstances, {
                    updateOnDuplicate: ["image", "position"],
                    transaction
                })
            }

        }

        await transaction.commit()

        return res.status(200).json(new ApiResponse(200, null, "Product Updated successfully"))

    } catch (error) {
        await transaction.rollback()
        throw new ApiError(500, error.message)
    }
})

const deleteProduct = asyncHandler( async( req, res) => {
    const {id} = req.params

    const transaction = await sequelize.transaction()

    try {
        const product = await Product.findByPk(id)
        if(!product) throw new ApiError(404, "Product not found")

        await ProductVariant.destroy({
            where: {productId: id},
            transaction
        })

        await ProductImage.destroy({
            where: {productId: id},
            transaction
        })

        await Product.destroy({where: {id}, transaction})
        await transaction.commit()

        return res.status(200).json(new ApiResponse(200, {}, "Product removed successfully"))
    } catch (error) {
        await transaction.rollback()
        throw new ApiError(500, error.message)
    }
})

const getProductsCreatedByUser = asyncHandler( async(req, res) => {
    const userId = req.user.id

    const products = await Product.findAll({
        where: {createdBy: userId},
        include: [
            {model: ProductVariant},
            {model: ProductImage}
        ],
        order: [["createdAt", "DESC"]]
    })

    if(!products.length) throw new ApiError(404, "No products found for this user")

    return res.status(200).json(new ApiResponse(200, products, "Products retrieved successfully"))
})

const getAllProducts = asyncHandler( async(req ,res) => {

    const products = await Product.findAll({
        include: [{model: ProductImage}],
        order: [["createdAt", "DESC"]]
    })

    if(!products) throw new ApiError(404, "No products found")

    return res.status(200).json(new ApiResponse(200, products, "All products retrieved Successfully"))
})

const getProducImages = asyncHandler( async(req, res) => {
    const {id} = req.params

    const images = ProductImage.findAll({
        where: {productId : id},
        order: [["position", "ASC"]]
    })

    if(!images.lenngth) throw new ApiError(404 , "No image found for the product")

    return res.status(200).json(new ApiResponse(200, images, "Product images fetched Successfully"))
})

export { createProduct, getProduct, updateProduct, deleteProduct, getProductsCreatedByUser, getAllProducts, getProducImages }