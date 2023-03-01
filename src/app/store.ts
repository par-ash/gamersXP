import rootReducer from './rootReducer'
import { configureStore } from '@reduxjs/toolkit'
// import devToolsEnhancer from 'remote-redux-devtools'

const reduxStore = configureStore({
  reducer: rootReducer,
})

declare global {
  interface Window {
    reduxStore: typeof reduxStore
    injectedProvider: any
    firstLoad: boolean
  }
}

window.reduxStore = reduxStore
const store = overwolf.windows.getMainWindow().reduxStore
export type AppDispatch = typeof store.dispatch
export default store
