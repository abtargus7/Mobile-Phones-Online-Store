import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

const persistConfig = {
  key: "user",
  storage
}

const persistedUserReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
  reducer: persistedUserReducer,
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
