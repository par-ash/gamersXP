import { combineReducers } from '@reduxjs/toolkit'
import backgroundReducer from 'features/background/background-slice'

const rootReducer = combineReducers({
  background: backgroundReducer,
})

export type RootReducer = ReturnType<typeof rootReducer>
export default rootReducer
