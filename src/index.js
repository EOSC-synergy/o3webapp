import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store';
import {Provider} from 'react-redux';
import {fetchModels, fetchPlotDataForCurrentModels, fetchPlotTypes} from './services/API/apiSlice';
import {setModelsOfModelGroup} from "./store/modelsSlice/modelsSlice";
import {DEFAULT_MODEL_GROUP, O3AS_PLOTS} from './utils/constants';

// add default model group
store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP));

// on "startup" of the app: load plot types, models and data for default group set above
store.dispatch(fetchPlotTypes());
store.dispatch(fetchModels());
store.dispatch(fetchPlotDataForCurrentModels({plotId: O3AS_PLOTS.tco3_zm}));
store.dispatch(fetchPlotDataForCurrentModels({plotId: O3AS_PLOTS.tco3_return}));


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
