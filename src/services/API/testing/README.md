## Mocked Data
This directory stores example data (sometimes shortended to simplify the test cases) to allow integration testing with redux.

## How To Mock
Inside your jest file do the following: 
1. setup the test store 
```
    let store;
    beforeEach(() => {
        store = createTestStore(); // make sure to import this function from store.js
    });
```
2. mock axios
Mocking requirements:
```
import axios from 'axios';
jest.mock('axios');
```
The specific mocking:
```
axios.post.mockImplementation((requestUrl) => {
    let data;
    if (requestUrl.includes("tco3_zm") data = tco3zmResponse;
    else if (requestUrl.includes("tco3_return")) data = tco3returnResponse;
    else if (requestUrl.includes("models")) data = modelsResponse;
    else if (requestUrl.includes("plots")) data = plotsResponse;
    
    return Promise.resolve({data})
});
```
Note: the responses can be imported from ```src/services/API/testing```.


3. Simulate a working WebApp by dispatching three requests to the store 
```
await store.dispatch(fetchPlotTypes());
await store.dispatch(fetchModels());
await store.dispatch(fetchPlotDataForCurrentModels({plotId: O3AS_PLOTS.tco3_zm}));
await store.dispatch(fetchPlotDataForCurrentModels({plotId: O3AS_PLOTS.tco3_return}));
```
Note: there might be no need to fill the store with values for both types of plots
Note: you need to inlucude the ```async``` keyword in your unit tests when using ```await```