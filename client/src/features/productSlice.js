import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: {},
    variants: [], // Stores modified/new variants
    images: [],
    existingImages: []   // Stores modified/new images
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        addProduct: (state, action) => {
            state.product = action.payload
        },
        updateProduct: (state, action) => {
            const { field, value } = action.payload;
            state.product[field] = value;
        },
        addVariants: (state, action) => {
            state.variants = action.payload
        },
        addVariant: (state, action) => {
            state.variants.push(action.payload); // Store newly added variants
        },
        updateVariant: (state, action) => {
            const { index, field, value } = action.payload;

            state.variants = state.variants.map((variant, i) =>
                i === index ? { ...variant, [field]: value } : variant
            );


        },
        addImages: (state, action) => {
            state.existingImages = action.payload
        },
        addImage: (state, action) => {
            state.images.push(action.payload); // Track newly added image
        },
        updateImage: (state, action) => {
            const { id, updatedImage } = action.payload;
            const existingIndex = state.images.findIndex(img => img.id === id);

            if (existingIndex !== -1) {
                state.images[existingIndex] = updatedImage; // Update existing image
            } else {
                state.images.push(updatedImage); // Track new image
            }
        },
        removeImage: (state, action) => {
            state.images = state.images.filter((image) => image !== action.payload)
        },
        resetUpdatedData: (state) => {
            state.product = {};
            state.variants = [];
            state.images = [];
        },
    },
});

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