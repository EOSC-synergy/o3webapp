import { createSlice } from "@reduxjs/toolkit";

const STATISTICAL_VALUES = ["mean", "median", "derivative", "percentile"];

const initialState = {
    // currently active plot
    plotId: "tco3_zm",
    settings: {
        "tco3_zm": { 
            // this objects holds key-value-pairs, the keys being the model-group 
            // identifier and the values being the settings for each group 
            "all": { 
                // model group storing all information until it is possible 
                // to implement more model groups
                name: "All OCTS models",
                modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
                models: { // models is lookup table
                    "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                        institute: "IMK",
                        dataset: {
                            x: [42],
                            y: [42],
                        },
                        color: "#000000",
                        plotStyle: "solid",
                        isVisible: true, // show/hide individual models from a group
                        mean: true,
                        derivative: true,
                        median: true,
                        percentile: true,
                    }
                },
                hidden: false, // show/hide complete group
                visibileSV: { // lookup table so the reducer impl. can be more convenient
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                }
            }
        },
        "tco3_return": {
            "all": { 
                name: "All Return/Recovery models",
                modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
                models: { // models is lookup table
                    "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                        institute: "IMK",
                        dataset: {
                            x: [42],
                            y: [42],
                        },
                        hidden: false, // show/hide individual models from a group
                        mean: true,
                        derivative: true,
                        median: true,
                        percentile: true,
                        color: "#000000",
                        plotStyle: "solid",
                    }
                },
                hidden: false, // show/hide complete group
                visibileSV: { // lookup table so the reducer impl. can be more convenient
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                }
            }
        }
    }
}

const modelsSlice = createSlice({
    name: "models",
    initialState,
    reducers: {
        // set models
        // add models

        addModels(state, action) { 
            const { groupId, newModelList }  = action.payload;
            const activeSettings = state.settings[state.plotId];
            const selectedGroup = activeSettings[groupId];
            const activeModelList = selectedGroup.modelList;

            if (selectedGroup === undefined) {
                throw `Tried to access model-group with groupID "${groupId}" that is not yet defined!`;
            }

            // Add model to modelList if it is not already included
            for (var i = 0; i < newModelList.length; i++) {
                if (activeModelList.indexOf(newModelList[i]) !== -1) {
                    continue;
                }

                activeModelList.push(newModelList[i]);
            }

            // ---------------------------------------------------------
            // TODO: Add Model information to the model lookup table
            // ---------------------------------------------------------


        }, // expects groupID, list of models 
        removeModels(state, action) { 
            const { groupId, removeModelList }  = action.payload;
            const activeSettings = state.settings[state.plotId];
            const selectedGroup = activeSettings[groupId];
            const activeModelList = selectedGroup.modelList;

            if (selectedGroup === undefined) {
                throw `Tried to access model-group with groupID "${groupId}" that is not yet defined!`;
            }

            for (var i = 0; i < removeModelList.length; i++) {
                // Remove model from modelList
                activeModelList = activeModelList.filter(item => item !== removeModelList[i]);

                // Delete model object from models
                delete selectedGroup.models[removeModelList[i]];
            }

        }, // expects groupdID, list of models
        updatedModelGroup(state, action) { }, // implementing this requires more knowledge about the UI
        addedModelGroup(state, action) { },
        setVisibility(state, action) { 
            const { groupID, modelID, isVisible } = action.payload;
            const activeSettings = state.settings[state.plotId];
            const activeModel = activeSettings[groupID].models[modelID];
            if (activeModel === undefined) {
                throw `tried to access model with modelID "${modelID}" that is not yet defined!`;
            } 
            activeModel.isVisible = isVisible;
        },
        setStatisticalValuesIncluded(state, action) { // this is for an individual model
            // svType has to be a string of the form: 
            // mean | derivative | median | percentile
            const { groupID, modelID, svType, isIncluded } = action.payload;
            const activeSettings = state.settings[state.plotId];
            const activeModel = activeSettings[groupID].models[modelID];
            if (activeModel === undefined) {
                throw `tried to access model with modelID "${modelID}" that is not yet defined!`;
            }
            if (STATISTICAL_VALUES.includes(svType)) { // svType doesn't represent a valid statistical value
                throw `tried to set statistial value "${svType}" that is not a valid statistical value (${STATISTICAL_VALUES.join("|")})`;
            }
            activeModel[svType] = isIncluded;
        },
        setStatisticalValueForGroup(state, action) { // this is for an entire group
            const { groupID, svType, isIncluded } = action.payload;
            const activeSettings = state.settings[state.plotId];
            if (STATISTICAL_VALUES.includes(svType)) { // svType doesn't represent a valid statistical value
                throw `tried to set statistial value "${svType}" that is not a valid statistical value (${STATISTICAL_VALUES.join("|")})`;
            }
            activeSettings[groupID].visibileSV[svType] = isIncluded;
        },
    }
})

export const { 
    addModels,
    removeModels,
    updatedModelGroup,
    addedModelGroup,
    setVisibility, 
    setStatisticalValuesIncluded, 
    setStatisticalValueForGroup
} = modelsSlice.actions;

export default modelsSlice.reducer;

export const selectCurrentModelGroups = state => state.models[state.plot.plotId];
export const selectCurrentModelGroup = (state, groupId) => state.models[state.plot.plotId][groupId];