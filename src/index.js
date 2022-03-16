import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store';
import {Provider} from 'react-redux';
import {fetchModels, fetchPlotDataForCurrentModels, fetchPlotTypes} from './services/API/apiSlice/apiSlice';
import {setModelsOfModelGroup} from "./store/modelsSlice/modelsSlice";
import {DEFAULT_MODEL_GROUP} from './utils/constants';
import {updateStoreWithURL, updateURL} from "./services/url/url";

const queryString = window.location.search;

store.dispatch(fetchPlotTypes());
store.dispatch(fetchModels()).then(
    () => {
        updateStoreWithURL();
        store.dispatch(fetchPlotDataForCurrentModels(queryString === ''));
        updateURL();
    }
);

if (queryString === '') {
    // add default model group
    store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP));
}


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
