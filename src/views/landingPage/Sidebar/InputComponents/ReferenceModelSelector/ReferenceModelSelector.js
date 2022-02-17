import React, { useEffect } from "react";
import { Typography, MenuItem} from "@mui/material";
import { Select, InputLabel, FormControl } from "@mui/material";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setModel, selectRefModel } from "../../../../../store/referenceSlice/referenceSlice";
import PropTypes from 'prop-types';
import {modelListBegin, modelListEnd, O3AS_PLOTS} from "../../../../../utils/constants";
import {fetchPlotData, fetchPlotDataForCurrentModels} from "../../../../../services/API/apiSlice";
import { REQUEST_STATE } from "../../../../../services/API/apiSlice";
/**
 * enables the user to select a reference model
 * @param {Object} props 
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX} a jsx containing a dropdown to select the reference model from all currently visible models
 */
function ReferenceModelSelector(props) {
    const dispatch = useDispatch()

    const modelListRequestedData = useSelector(state => state.api.models);

    let isLoading = true;
    let allModels = [];
    if (modelListRequestedData.status === REQUEST_STATE.idle
        || modelListRequestedData.status === REQUEST_STATE.loading) {
            isLoading = true;
    }
    else if (modelListRequestedData.status === REQUEST_STATE.success) {
        allModels = modelListRequestedData.data;
        isLoading = false;
    }

    useEffect(() => {
        if (modelListRequestedData.status === REQUEST_STATE.error) {
            props.reportError("API not responding: " + modelListRequestedData.error);
        }
    });


    const selectedModel = useSelector(selectRefModel);

    /** Handles the change of the reference model selection when it is modified.*/
    const handleChangeForRefModel = (event) => {
        dispatch(setModel({model: event.target.value}));
        // fetch for tco3_zm and tco3_return
        dispatch(fetchPlotDataForCurrentModels());

    };


    return (
        <div>
        <FormControl sx={{ m: 1, width: "100%" , size: "small"}}>
        <Select
            labelId="locationSelectLabel"
            id="locationSelect"
            label="Reference Model"
            onChange={handleChangeForRefModel}
            value={selectedModel}
        >
          {allModels.map((elem) => {return <MenuItem key={elem} value={elem}> {elem} </MenuItem>})}
        </Select>
        <InputLabel id="locationSelectLabel"><Typography>Reference Model</Typography></InputLabel>
        </FormControl>
        </div>
    );
}

ReferenceModelSelector.propTypes = {
    reportError: PropTypes.func
}

export default ReferenceModelSelector;