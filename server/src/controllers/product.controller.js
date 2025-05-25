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
    const product = req.body;

    // Ensure full product replacement by checking for missing fields
    if (!product || !product.title || !product.description || !product.status || !product.vendor) {
        throw new ApiError(400, "All product fields must be provided for a PUT request");
    }

    // Perform full product replacement
    const [rowsUpdated, updatedProduct] = await Product.update(product, {
        where: { id: req.params.id },
        returning: true
    });

    return res.status(200).json(new ApiResponse(200, updatedProduct, "Product updated successfully"));

})

//delete product from the database
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params

    //create transaction
    const transaction = await sequelize.transaction()

    try {
        //find product by id
        const product = await Product.findByPk(id)

        //throw error if product not found
        if (!product) throw new ApiError(404, "Product not found")

        //delete product variants associated with product
        await ProductVariant.destroy({
            where: { productId: id },
            transaction
        })

        //delete product images associated with product
        await ProductImage.destroy({
            where: { productId: id },
            transaction
        })

        //delete product itself
        await Product.destroy({ where: { id }, transaction })

        //commit transaction
        await transaction.commit()

        //send response
        return res.status(201).json(new ApiResponse(201, {}, "Product removed successfully"))
    } catch (error) {
        //rollback transaction if error found
        await transaction.rollback()
        throw new ApiError(500, error.message)
    }
})

//get all products created by admin users from database
const getProductsCreatedByUser = asyncHandler(async (req, res) => {
    const userId = req.user.id

    //fetch products from database
    const products = await Product.findAll({
        where: { createdBy: userId },
        include: [
            { model: ProductVariant },
            { model: ProductImage }
        ],
        order: [["createdAt", "DESC"]]
    })

    //if products not found throw error
    if (!products.length) throw new ApiError(404, "No products found for this user")

    //send response
    return res.status(200).json(new ApiResponse(200, products, "Products retrieved successfully"))
})

//fetch all products from datatbase
const getAllProducts = asyncHandler(async (req, res) => {

    //fetch all products
    const products = await Product.findAll({
        include: [
            { model: ProductImage },
            { model: ProductVariant }
        ],
        order: [["createdAt", "DESC"]]
    })

    //throw error if products not found
    if (!products) throw new ApiError(404, "No products found")

    //send response
    return res.status(200).json(new ApiResponse(200, products, "All products retrieved Successfully"))
})

const updateVariants = asyncHandler(async (req, res) => {
    const variants = req.body;
    const productId = req.params.id


    const transaction = await sequelize.transaction();

    try {
        const updatePromises = [];
        const createPromises = [];

        for (const variant of variants) {
            if (variant.id) {
                updatePromises.push(
                    ProductVariant.update(variant, {
                        where: { id: variant.id },
                        transaction
                    })
                );
            } else {
                createPromises.push(ProductVariant.create({ ...variant, productId }, { transaction }));
            }
        }

        await Promise.all(updatePromises);
        const newVariants = await Promise.all(createPromises);

        await transaction.commit();
        return res.status(200).json(new ApiResponse(200, newVariants, "Updated product Variants"))
    } catch (error) {
        await transaction.rollback();
        throw new ApiError(500, "Failed to update Variants")
    }

})

const updateImages = asyncHandler(async (req, res) => {
    const { images, newImages } = req.body;
    const productId = req.params.id

    const transaction = await sequelize.transaction()

    try {
        const updatePromises = []
        const createPromises = []

        for (const image of images) {
            updatePromises.push(
                ProductImage.update(images, {
                    where: { id: image.id },
                    transaction
                })
            )
        }

        const maxPosition = images.length

        for (let i = 0; i < newImages.length; i++) {
            createPromises.push(
                ProductImage.create({
                    image: newImages[i],
                    position: maxPosition + i + 1,
                    productId,
                }, {transaction})
            );
        }

        await Promise.all(updatePromises)
        const createdImages = await Promise.all(createPromises)

        await transaction.commit()
        return res.status(200).json(new ApiResponse(200, createdImages, "Updated images"))

    } catch (error) {
        await transaction.rollback();
        throw new ApiError(500, "Failed to update Imgaes")
    }
})

//export all controllers
export { createProduct, getProduct, updateProduct, deleteProduct, getProductsCreatedByUser, getAllProducts, updateVariants, updateImages }