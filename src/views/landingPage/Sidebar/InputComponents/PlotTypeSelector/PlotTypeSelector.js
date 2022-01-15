import React, { useState } from "react";
// import { useGetPlotsQuery } from "../../../../../services/API/apiSlice";
import PropTypes from "prop-types";
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { getPlotTypes } from '../../../../../services/API/apiSlice';
import { sleep } from '../../../../../utils/mock_dev';
import { useDispatch, useSelector } from "react-redux";
import { selectPlotId, setActivePlotId } from "../../../../../store/plotSlice/plotSlice";
import { REQUEST_STATE } from "../../../../../services/API/apiSlice"


/**
 * enables the user to select a different plot type
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX.Element} a jsx containing a dropdown to select the plot type
 */
function PlotTypeSelector(props) {

    const dispatch = useDispatch();
    const plotTypesRequestData = useSelector(state => state.api.plotTypes);
    const plotType = useSelector(selectPlotId);

    /**
     * mocks a call to the redux store to change the plot type
     * @param {event} event the event that called this function
     * @todo connect with redux store
     */
    const changePlotType = (event) => {
        //console.log(event.target.value);
        dispatch(setActivePlotId({plotId: event.target.value}))
    }

    let dropdownData;
    if (plotTypesRequestData.status === REQUEST_STATE.loading 
        || plotTypesRequestData.status === REQUEST_STATE.idle) {
        dropdownData = (<Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <CircularProgress />
                        </Box>);
    } else if (plotTypesRequestData.status === REQUEST_STATE.success) {
        dropdownData = (
            plotTypesRequestData.data.map((name, idx) => {
                return (
                    <MenuItem key={idx} value={name}>{name}</MenuItem>
                )
            })
        )
    } else if (plotTypesRequestData.status === REQUEST_STATE.error) {
        props.reportError(plotTypesRequestData.error);
    }
    
    return (
        <FormControl sx={{ width: '100%' }} data-testid="plotTypeSelectorForm">
            <InputLabel id="plotTypeLabel" data-testid="plotTypeSelector">Plot Type</InputLabel>
            <Select
                labelId="plotTypeLabel"
                id="plotType"
                value={plotType}
                label="Plot Type"
                onChange={changePlotType}
            >
                {
                    dropdownData
                }
            </Select>
        </FormControl>
    );
}

PlotTypeSelector.propTypes = {
    reportError: PropTypes.func.isRequired,
}

export default PlotTypeSelector;