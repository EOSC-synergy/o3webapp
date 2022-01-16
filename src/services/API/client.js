import axios from 'axios';

const baseURL = "https://api.o3as.fedcloud.eu/api/v1";

const timeoutVal = 5000;


const getFromAPI = (endpoint) => {
    return axios.get(baseURL + endpoint, { timeout: timeoutVal });
}

const postAtAPI = (endpoint, data) => {
    return axios.post(baseURL + endpoint, { data }, { timeout: timeoutVal });
}

export const getPlotTypes = () => {
  return getFromAPI("/data");
};

export const postData = (plotType, data) => {
    return postAtAPI(
        `/data/${plotType}`,
        { data }
    );
}

export const getModels = (plotType, select) => {
    const hasPlotType = typeof plotType !== "undefined";
    const hasSelect = typeof select !== "undefined";
    const hasOne = hasPlotType || hasSelect;
    const hasBoth = hasPlotType && hasSelect;
    
    return getFromAPI(
        `/models${hasOne ? "?" : ""}${hasPlotType ? `ptype=${plotType}` : ""}${hasBoth ? "&" : ""}${hasSelect ? `select=${select}` : ""}`);
}

export const postModelsPlotStyle = (plotType) => {
    return postAtAPI(
        '/models/plotstyle',
        {
            ptype: plotType
        }
    );
}

export const fetchModels = createAsyncThunk('api/fetchModels', async () => {
    const response = await getModels();
    return response.data;
});

export const fetchPlotTypes = createAsyncThunk('api/fetchPlotTypes', async () => {
    const response = await getPlotTypes();
    return response.data;
});
