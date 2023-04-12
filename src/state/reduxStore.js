import authReducer from './authSlice'
import taskReducer from './tasksSlice'
import projectReducer from './projectsSlice'
import teamReducer from './teamsSlice'
import datagridReducer from './datagridSlice'

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

const rootReducer = combineReducers({
    auth: authReducer,
    task: taskReducer,
    project: projectReducer,
    team: teamReducer,
    datagrid: datagridReducer
})
const persistedReducers = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducers,
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