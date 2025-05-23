import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    product: {},
    variants: [],
    images: []
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProduct: (state, action) => {
            state.product = {
                ...state.product,
                ...action.payload
            }
        },
        addImage: (state, action) => {
            state.images.push(action.payload)
        },
        removeImage: (state, action) => {
            state.images = state.images.filter((image) => image !== action.payload)
        }
    }

})

export const {setProduct, addImage, removeImage} = productSlice.actions
export default productSlice.reducer