import React, { type FC, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { setModel, selectRefModel } from 'store/referenceSlice';
import { fetchPlotDataForCurrentModels, REQUEST_STATE } from 'services/API/apiSlice';
import { type AppState, useAppDispatch } from 'store';
import { type ErrorReporter } from 'utils/reportError';

type ReferenceModelSelectorProps = {
    reportError: ErrorReporter;
};
/**
 * Enables the user to select a reference model.
 * @returns a jsx containing a dropdown to select the reference model from all currently visible models
 */
const ReferenceModelSelector: FC<ReferenceModelSelectorProps> = ({ reportError }) => {
    /**
     * A dispatch function to dispatch actions to the Redux store.
     */
    const dispatch = useAppDispatch();

    /**
     * Selects the model list from the Redux store.
     * @constant {Array}
     */
    const modelListRequestedData = useSelector((state: AppState) => state.api.models);

    /**
     * Selects the current reference model.
     * @see {@link selectRefModel}
     */
    const selectedModel = useSelector(selectRefModel);

    /**
     * Array with all the models.
     */
    let allModels: string[] = [];
    if (modelListRequestedData.status === REQUEST_STATE.success) {
        allModels = modelListRequestedData.data;
    }

    useEffect(() => {
        if (modelListRequestedData.status === REQUEST_STATE.error) {
            reportError('API not responding: ' + modelListRequestedData.error);
        }
    });

    /**
     * Handles the change of the reference model selection.
     * @see {@link fetchPlotDataForCurrentModels}
     * @function
     */
    const handleChangeForRefModel = (_: unknown, value: string | null) => {
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
};

export default ReferenceModelSelector;
