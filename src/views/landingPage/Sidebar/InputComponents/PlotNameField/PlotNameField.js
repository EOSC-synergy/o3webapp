import React from "react";
import { useDispatch } from "react-redux"
import { setTitle } from "../../../../../store/plotSlice/plotSlice";
import { Divider, Typography, Box, FormControl, TextField} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectPlotTitle } from "../../../../../store/plotSlice/plotSlice";
import PropTypes from 'prop-types';
import { PLOT_NAME_MAX_LEN } from "../../../../../utils/constants"

/**
 * Enables the user to rename and change the plot title.
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a textfield to change the plotname
 */
function PlotNameField(props) {
    
    /** The title that should be displayed above the TextField. */
    const componentTitle = "PLOT NAME";

    /** The label displayed inside the TextField while nothing is typed in. */
    const textFieldLabel = "New Plot Name";
     
    /** Dispatcher to dispatch the plot name change action. */
    const dispatch = useDispatch();


    /** The current plot title from the store */
    const plotTitle = useSelector(selectPlotTitle);

    /** Handles the change if the text in TextField is modified. */
    const updatePlotName = (event) => {
        if (event.target.value.length > PLOT_NAME_MAX_LEN) {
            event.target.value = event.target.value.slice(0, PLOT_NAME_MAX_LEN);
        } 

        dispatch(setTitle({title: event.target.value}));
    }
    

    return ( <>
        <Divider><Typography>{componentTitle}</Typography></Divider>
        <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%', paddingBottom: '3%'}}>
            <FormControl sx={{width: '100%' }}>
                <TextField
                    data-testid="plot-field"
                    id="standard-basic"
                    label={textFieldLabel}
                    variant="standard"
                    defaultValue={plotTitle}
                    onBlur={updatePlotName}
                    onKeyPress={(event) => {
                        if (event.key === "Enter") {
                            updatePlotName(event);
                        }
                    }}
                />
            </FormControl>
        </Box> 
        </>
    );
}

PlotNameField.propTypes = {
    reportError: PropTypes.func.isRequired
}

export default PlotNameField;