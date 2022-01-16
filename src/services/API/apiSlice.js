import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const REQUEST_STATE = {
    idle: "idle",
    loading: "loading",
    success: "success",
    error: "error",
}

const initialState = {
    models: {
        status: REQUEST_STATE.idle,
        error: null,
        data: [],
    },
    plotTypes: {
        status: REQUEST_STATE.idle,
        error: null,
        data: [],
    },
};

const apiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {

    },
    extraReducers(builder) {
        builder
            // fetch models
            .addCase(fetchModels.pending, (state, action) => {
                state.models.status = REQUEST_STATE.loading;
            })
            .addCase(fetchModels.fulfilled, (state, action) => {
                state.models.status = REQUEST_STATE.success;
                state.models.data = action.payload;
            })
            .addCase(fetchModels.rejected, (state, action) => {
                state.models.status = REQUEST_STATE.error;
                state.models.error = action.error.message;
            })
            // fetch plotTypes
            .addCase(fetchPlotTypes.pending, (state, action) => {
                state.plotTypes.status = REQUEST_STATE.loading;
            })
            .addCase(fetchPlotTypes.fulfilled, (state, action) => {
                state.plotTypes.status = REQUEST_STATE.success;
                state.plotTypes.data = action.payload;
            })
            .addCase(fetchPlotTypes.rejected, (state, action) => {
                state.plotTypes.status = REQUEST_STATE.error;
                state.plotTypes.error = action.error.message;
            })
    },
});

export default apiSlice.reducer;