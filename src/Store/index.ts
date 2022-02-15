import AsyncStorage from '@react-native-async-storage/async-storage'
import { combineReducers, Middleware } from 'redux'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { api, pcApi } from '@/Services/api'
import * as modules from '@/Services/modules'
import theme from './Theme'
import authReducer from './auth'
import allEnterprisesReducer from './enterprises/all'
import { authApi } from '@/Services/auth'
import { enterpriseApi } from '@/Services/enterprise'

const reducers = combineReducers({
  theme,
  ...Object.values(modules).reduce(
    (acc, module) => ({
      ...acc,
      [module.reducerPath]: module.reducer,
    }),
    {},
  ),
  [authApi.reducerPath]: authApi.reducer,
  [enterpriseApi.reducerPath]: enterpriseApi.reducer,
  auth: authReducer,
  allEnterprises: allEnterprisesReducer,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['theme', 'auth'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      thunk: true,
    })
      .concat(api.middleware as Middleware)
      .concat(authApi.middleware as Middleware)
      .concat(pcApi.middleware as Middleware)

    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      const createDebugger = require('redux-flipper').default
      middlewares.push(createDebugger())
    }

    return middlewares
  },
})

const persistor = persistStore(store)

setupListeners(store.dispatch)

export { store, persistor }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
