import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice'
import productReducer from '../features/productSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'


//persistance storage config
const persistConfig = {
  key: "user",
  storage
}

//combined reducer = userReducer + productReducer
const rootReducer = combineReducers({
    user: persistReducer(persistConfig, userReducer),
    product: productReducer
})


//redux store configuration
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store)

