import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store'
import { Provider } from 'react-redux'
import "./index.css"
import { fetchModels, fetchPlotTypes, fetchRawData } from './services/API/apiSlice';

// on "startup" of the app: request default values for all models

store.dispatch(fetchModels());
store.dispatch(fetchPlotTypes());
store.dispatch(fetchRawData(
  {
    plotId: "tco3_zm",
    plotType: "tco3_zm",
    latMin: "-90", 
    latMax: "90", 
    months: [1,2,3], 
    startYear: 1960, 
    endYear: 2100, 
    modelList: [
      "CCMI-1_ACCESS_ACCESS-CCM-refC2"
    ],
  }
));

//https://api.o3as.fedcloud.eu/api/v1/data/tco3_zm?begin=1959&end=2100&month=1,2,3&lat_min=-90&lat_max=90

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
