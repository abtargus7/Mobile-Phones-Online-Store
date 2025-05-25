// this state stores recieved product from database and update it 

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: {},
    variants: [], // Stores existing product variants
    images: [], //stores newly uploaded images 
    existingImages: []   // Stores existing product images
};

// create product slice with initial values and reducers to update state
const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // store recieved product from db
        addProduct: (state, action) => {
            state.product = action.payload
        },
        // update existing product fields
        updateProduct: (state, action) => {
            const { field, value } = action.payload;
            state.product[field] = value;
        },
        // store recieved product variants
        addVariants: (state, action) => {
            state.variants = action.payload
        },
        // Store newly added variants
        addVariant: (state, action) => {
            state.variants.push(action.payload); 
        },
        // update existing variant
        updateVariant: (state, action) => {
            const { index, field, value } = action.payload;

            state.variants = state.variants.map((variant, i) =>
                i === index ? { ...variant, [field]: value } : variant
            );
        },
        // store recieved images
        addImages: (state, action) => {
            state.existingImages = action.payload
        },
        // store newly added image
        addImage: (state, action) => {
            state.images.push(action.payload); // Track newly added image
        },
        // update existing image
        updateImage: (state, action) => {
            const { id, updatedImage } = action.payload;
            const existingIndex = state.images.findIndex(img => img.id === id);

            if (existingIndex !== -1) {
                state.images[existingIndex] = updatedImage; // Update existing image
            } else {
                state.images.push(updatedImage); // Track new image
            }
        },
        // remove image from state
        removeImage: (state, action) => {
            state.images = state.images.filter((image) => image !== action.payload)
        },

        // reset entire state
        resetUpdatedData: (state) => {
            state.product = {};
            state.variants = [];
            state.images = [];
        },
    },
});

// export slice and reducers
export const {
    addProduct,
    updateProduct,
    addVariant,
    updateVariant,
    addImage,
    removeImage,
    updateImage,
    resetUpdatedData,
    addVariants,
    addImages,
} = productSlice.actions;

export default productSlice.reducer;