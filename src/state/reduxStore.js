import authReducer from './auth.redux'
import taskReducer from './task.redux'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist'

import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage
}

const persistedAuth = persistReducer(persistConfig, authReducer)

const rootReducer = combineReducers({
    auth: persistedAuth,
    tasks: taskReducer
})


export const store = configureStore({
    reducer: persistedAuth,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [
                FLUSH,
                REHYDRATE,
                PAUSE,
                PERSIST,
                PURGE,
                REGISTER
            ]
        }
    })
})

export const persistor = persistStore(store)