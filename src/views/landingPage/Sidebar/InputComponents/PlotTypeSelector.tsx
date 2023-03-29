import React, { FC, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { selectPlotId, setActivePlotId } from 'store/plotSlice';
import { REQUEST_STATE } from 'services/API/apiSlice/apiSlice';
import { AppState, useAppDispatch } from 'store/store';
import { ErrorReporter } from 'utils/reportError';
import { SelectChangeEvent } from '@mui/material';
import { O3AS_PLOTS } from '../../../../utils/constants';

type PlotTypeSelectorProps = {
    reportError: ErrorReporter;
};
/**
 * Enables the user to select a different plot type.
 * @component
 * @param {Object} props
 * @param {function} props.reportError - function for error handling
 * @returns {JSX.Element} a jsx containing a dropdown to select the plot type
 */
const PlotTypeSelector: FC<PlotTypeSelectorProps> = (props) => {
    const dispatch = useAppDispatch();

    /**
     * Get the requested data from the redux store
     * @constant {Object}
     */
    const plotTypesRequestData = useSelector((state: AppState) => state.api.plotTypes);

    /**
     * Currently selected plot type. Taken from the redux store.
     * @constant {String}
     * @see {@link selectPlotId}
     */
    const plotType = useSelector(selectPlotId);

    /**
     * Calls the redux store to change the plot type
     * @param event the event that called this function
     * @function
     */
    const changePlotType = (event: SelectChangeEvent) => {
        dispatch(setActivePlotId({ plotId: event.target.value as O3AS_PLOTS }));
    };

    let dropdownData;
    let plotTypeData: O3AS_PLOTS | undefined = plotType;
    if (
        plotTypesRequestData.status === REQUEST_STATE.loading ||
        plotTypesRequestData.status === REQUEST_STATE.idle
    ) {
        dropdownData = (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress data-testid="plotTypeSelectorLoading" />
            </Box>
        );
        plotTypeData = undefined;
    } else if (plotTypesRequestData.status === REQUEST_STATE.success) {
        dropdownData = plotTypesRequestData.data.map((name, idx) => {
            return (
                <MenuItem key={idx} value={name}>
                    {name}
                </MenuItem>
            );
        });
    }

    useEffect(() => {
        if (plotTypesRequestData.status === REQUEST_STATE.error) {
            props.reportError('API not responding: ' + plotTypesRequestData.error);
        }
    });

    return (
        <>
            <FormControl
                sx={{
                    width: '80%',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    marginTop: '2%',
                    marginBottom: '2%',
                }}
                data-testid="plotTypeSelectorForm"
            >
                <InputLabel id="plotTypeLabel" data-testid="plotTypeSelector">
                    Plot Type
                </InputLabel>
                <Select
                    labelId="plotTypeLabel"
                    id="plotType"
                    value={plotTypeData}
                    label="Plot Type"
                    onChange={changePlotType}
                >
                    {dropdownData}
                </Select>
            </FormControl>
        </>
    );
};

PlotTypeSelector.propTypes = {
    reportError: PropTypes.func.isRequired,
};

export default PlotTypeSelector;
