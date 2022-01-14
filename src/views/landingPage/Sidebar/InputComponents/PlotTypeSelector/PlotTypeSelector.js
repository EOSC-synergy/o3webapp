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


/**
 * enables the user to select a different plot type
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX.Element} a jsx containing a dropdown to select the plot type
 */
function PlotTypeSelector(props) {

    // for dev reasons, should eventually be moved to the redux / API module
    /**
     * @todo move to redux eventually
     */
    const [plotType, setPlotType] = React.useState('');
    /**
     * @todo move to redux eventually
     */
    const [isLoading, setIsLoading] = React.useState(true);
    /**
     * @todo move to redux eventually
     */
    const [plotTypes, setPlotTypes] = React.useState([]);

    const successHTTPCode = 200;

    /**
     * mocks a call to the redux store to change the plot type
     * @param {event} event the event that called this function
     * @todo connect with redux store
     */
    const changePlotType = (event) => {
        setPlotType(event.target.value);
    }

    getPlotTypes()
        .then((response) => {
            if (response.status !== successHTTPCode) {
                props.reportError(`Cannot receive plot type data: ${response.statusText}`);
            }
            setPlotTypes(response.data);
            setIsLoading(false);
        })
        .catch(error => {
            props.reportError(error.code + "\n" + error.message + "\n" + error.stack);
        });
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
                isLoading ? 
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <CircularProgress />
                    </Box>
                :
                    plotTypes.map((name, idx) => {
                        return (
                            <MenuItem key={idx} value={name}>{name}</MenuItem>
                        )
                    })
                }
            </Select>
        </FormControl>
    );
}

PlotTypeSelector.propTypes = {
    reportError: PropTypes.func.isRequired,
}

export default PlotTypeSelector;