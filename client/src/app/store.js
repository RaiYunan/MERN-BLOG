import { configureStore } from '@reduxjs/toolkit'
import userReducer from "../redux/user/user.slice.js"

//useSelector=used to access current state of store
//useDispatch=used to update the store by sending payload(data)
export const store = configureStore({
  reducer: {
    user:userReducer
  },
})
