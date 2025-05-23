import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice'
import productReducer from '../features/productSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

const persistConfig = {
  key: "user",
  storage
}

const rootReducer = combineReducers({
    user: persistReducer(persistConfig, userReducer),
    product: productReducer
})

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

persistor.subscribe(() => {
  console.log("Persisted state:", store.getState());
});
