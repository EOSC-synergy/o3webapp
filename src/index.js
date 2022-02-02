import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store'
import { Provider } from 'react-redux'
import "./index.css"
import { fetchModels, fetchPlotData, fetchPlotTypes } from './services/API/apiSlice';

// on "startup" of the app: request default values for all models
store.dispatch(fetchModels())
    .then(() => {
        if (store.getState().api.models.error === null) {
            store.dispatch(fetchPlotData(0, 10)); // after fetching models fetch the data for the plot
        }
    });
store.dispatch(fetchPlotTypes());

ReactDOM.render(
<React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
</React.StrictMode>,
document.getElementById('root')
);
