import React, { useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setModel, selectRefModel } from '../../../../../store/referenceSlice';
import PropTypes from 'prop-types';
import { fetchPlotDataForCurrentModels } from '../../../../../services/API/apiSlice/apiSlice';
import { REQUEST_STATE } from '../../../../../services/API/apiSlice/apiSlice';

/**
 * Enables the user to select a reference model.
 * @component
 * @param {Object} props
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX.Element} a jsx containing a dropdown to select the reference model from all currently visible models
 */
function ReferenceModelSelector(props) {
    /**
     * A dispatch function to dispatch actions to the Redux store.
     */
    const dispatch = useDispatch();

    /**
     * Selects the model list from the Redux store.
     * @constant {Array}
     */
    const modelListRequestedData = useSelector((state) => state.api.models);

    /**
     * Selects the current reference model.
     * @see {@link selectRefModel}
     * @constant {Array}
     */
    const selectedModel = useSelector(selectRefModel);

    /**
     * Array with all the models.
     * @type {Array.<String>}
     */
    let allModels = [];
    if (modelListRequestedData.status === REQUEST_STATE.success) {
        allModels = modelListRequestedData.data;
    }

    useEffect(() => {
        if (modelListRequestedData.status === REQUEST_STATE.error) {
            props.reportError('API not responding: ' + modelListRequestedData.error);
        }
    });

    /**
     * Handles the change of the reference model selection.
     * @see {@link fetchPlotDataForCurrentModels}
     * @function
     */
    const handleChangeForRefModel = (_, value) => {
        if (value !== null) {
            dispatch(setModel({ model: value }));
            // fetch for tco3_zm and tco3_return
            dispatch(fetchPlotDataForCurrentModels());
        }
    };

    return (
        <Autocomplete
            id="locationAutocomplete"
            value={selectedModel}
            onChange={handleChangeForRefModel}
            options={allModels}
            renderInput={(params) => <TextField {...params} label="Reference Model" />}
            sx={{ width: '100%' }}
            data-testid="ReferenceModelSelector-reference-model"
        />
    );
}

ReferenceModelSelector.propTypes = {
    reportError: PropTypes.func,
};

export default ReferenceModelSelector;
