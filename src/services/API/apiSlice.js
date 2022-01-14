import axios from 'axios';

// Define our single API slice object
/*
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.o3as.fedcloud.eu/api/v1' }),
  
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({

    getApiSpecification: builder.query({
      query: () => '/openapi.json'
    }),
    
    getModels: builder.query({
      query: () => '/models'
    }),
    getPlots: builder.query({
      query: () => '/plots'
    }),
    
    getRawPlotData: builder.mutation({
      query: payload => ({
        // /data/tco3_return?begin=1959&end=2100&lat_min=-90&lat_max=90
        url: `/data/${payload.plotType}?begin=1959&end=2100&lat_min=${payload.lat_min}&lat_max=${payload.lat_max}`,
        method: "POST",
        body: payload.modelList,
      })
    }),
    
    getBuiltPlotData: builder.mutation({
      query: payload => ({
        
        url: `/plots/${payload.plotType}?begin=1959&end=2100&lat_min=${payload.lat_min}&lat_max=${payload.lat_max}`,
        method: "POST",
        body: payload.modelList,
      })
    }),
    
  })
})

// Export the auto-generated hook for the query endpoints
export const { 
  useGetApiSpecificationQuery,
  useGetPlotsQuery,
  useGetModelsQuery,
  useGetBuiltPlotDataMutation,
  useGetRawPlotDataMutation,
 } = apiSlice

 */

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
    return getFromAPI(`/models?ptype=${plotType}&select=${select}`);
}

export const postModelsPlotStyle = (plotType) => {
    return postAtAPI(
        '/models/plotstyle',
        {
            ptype: plotType
        }
    );
}