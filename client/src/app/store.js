import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from "../redux/user/user.slice.js"
import { persistStore, persistReducer } from 'redux-persist'
import sessionStorage from 'redux-persist/es/storage/session'

const rootReducer=combineReducers({
  user:userReducer
})

const persistConfig = {
  key: 'root',
  storage:sessionStorage,
}

const persistedReducer=persistReducer(persistConfig,rootReducer)

//useSelector=used to access current state of store
//useDispatch=used to update the store by sending payload(data)
export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({serializableCheck:false})
})

export const persister=persistStore(store)
