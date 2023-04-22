import authReducer from './authSlice'
import userReducer from './usersSlice'
import taskReducer from './tasksSlice'
import projectReducer from './projectsSlice'
import teamReducer from './teamsSlice'
import datagridReducer from './datagridSlice'
import roleReducer from './rolesSlice'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'

import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage
}

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  task: taskReducer,
  project: projectReducer,
  team: teamReducer,
  datagrid: datagridReducer,
  role: roleReducer
})
const persistedReducers = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})

export const persistor = persistStore(store)
