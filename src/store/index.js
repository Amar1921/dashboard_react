// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage par défaut
import { combineReducers } from 'redux'

// Importez vos reducers
import uiSlice from "@/store/slices/uiSlice.js";
import authSlice from "@/store/slices/authSlice.js";
// import userReducer from './slices/userSlice'
// ... autres reducers

// Configuration de persist
const persistConfig = {
    key: 'root',
    storage,
    // Optionnel : spécifiez les reducers à persister
    whitelist: ['auth'], // seulement auth sera persisté
    // Ou blacklist pour exclure certains reducers
    // blacklist: ['temporaryData']
}

// Combinez vos reducers
const rootReducer = combineReducers({
    auth: authSlice,
    ui: uiSlice
    // user: userReducer,
    // ... autres reducers
})

// Créez le reducer persisté
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Créez le store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

// Créez le persistor
export const persistor = persistStore(store)