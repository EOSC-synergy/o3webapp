import React, {useEffect} from "react";
import {Autocomplete, TextField} from "@mui/material";
import {useDispatch} from "react-redux";
import {useSelector} from "react-redux";
import {setModel, selectRefModel} from "../../../../../store/referenceSlice/referenceSlice";
import PropTypes from 'prop-types';
import {fetchPlotDataForCurrentModels} from "../../../../../services/API/apiSlice";
import { REQUEST_STATE } from "../../../../../services/API/apiSlice";
/**
 * enables the user to select a reference model
 * @param {Object} props
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX.Element} a jsx containing a dropdown to select the reference model from all currently visible models
 */
function ReferenceModelSelector(props) {

    const dispatch = useDispatch();

    const modelListRequestedData = useSelector(state => state.api.models);

    const selectedModel = useSelector(selectRefModel);

    let allModels = [];
    if (modelListRequestedData.status === REQUEST_STATE.success) {
        allModels = modelListRequestedData.data;
    }

    useEffect(() => {
        if (modelListRequestedData.status === REQUEST_STATE.error) {
            props.reportError("API not responding: " + modelListRequestedData.error);
        }
    });

    /** Handles the change of the reference model selection when it is modified.*/
    const handleChangeForRefModel = (event, value) => {
        dispatch(setModel({model: value}));
        // fetch for tco3_zm and tco3_return
        dispatch(fetchPlotDataForCurrentModels());
    };

    return (
        <Autocomplete
            id="locationAutocomplete"
            value={selectedModel}
            onChange={handleChangeForRefModel}
            disableClearable //maybe remove later?
            options={allModels}
            renderInput={(params) => <TextField {...params} label="Reference Model" />}
            sx={{width: "100%"}}
        />
    );
}

ReferenceModelSelector.propTypes = {
    reportError: PropTypes.func
}

export default ReferenceModelSelector;