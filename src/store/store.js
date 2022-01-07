import { configureStore } from '@reduxjs/toolkit'
import plotReducer from './plotSlice'
import modelsReducer from './modelsSlice'
import referenceReducer from './referenceSlice'


export default configureStore({
  reducer: {
    plot: plotReducer,
    models: modelsReducer,
    reference: referenceReducer,
  }
})