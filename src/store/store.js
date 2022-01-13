import { configureStore } from '@reduxjs/toolkit'
import plotReducer from './plotSlice/plotSlice'
import modelsReducer from './modelsSlice/modelsSlice'
import referenceReducer from './referenceSlice'


export default configureStore({
  reducer: {
    plot: plotReducer,
    models: modelsReducer,
    reference: referenceReducer,
  }
})