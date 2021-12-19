// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.o3as.fedcloud.eu/api/v1' }),
  
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    
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
  useGetPostsQuery,
  useGetPostQuery,
  useGetBuiltPlotDataMutation,
  useGetRawPlotDataMutation,
 } = apiSlice