// store logged in user
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    accessToken: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // store logged in user data
        login: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        
        // reset user data
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
        },

    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;