import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux"
import { selectPlotId, setTitle } from "../../../../../store/plotSlice/plotSlice";
import { Divider, Typography, Box, FormControl, TextField} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectPlotTitle } from "../../../../../store/plotSlice/plotSlice";
import PropTypes from 'prop-types';
import { O3AS_PLOTS, PLOT_NAME_MAX_LEN } from "../../../../../utils/constants"

/**
 * Enables the user to rename and change the plot title.
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a textfield to change the plotname
 */
function PlotNameField() {
    
    /** The title that should be displayed above the TextField. */
    const componentTitle = "PLOT NAME";

    /** The label displayed inside the TextField while nothing is typed in. */
    const textFieldLabel = "New Plot Name";
     
    /** Dispatcher to dispatch the plot name change action. */
    const dispatch = useDispatch();

    const plotId = useSelector(selectPlotId);
    const plotTitle = useSelector(selectPlotTitle);
    const [title, setTitle] = useState(plotTitle);

    useEffect(() => {
        setTitle(plotTitle);
    }, [plotId]);

    /** The current plot title from the store */
    console.log(plotTitle)

    /** Handles the change if the text in TextField is modified. */
    const updatePlotName = (event) => {
        if (event.target.value.length > PLOT_NAME_MAX_LEN) {
            event.target.value = event.target.value.slice(0, PLOT_NAME_MAX_LEN);
        } 
        console.log({title: event.target.value});
        dispatch(setTitle({title: event.target.value}));
    }

    const updatePlotTitleState = (event) => {
        setTitle(event.target.value);
    }
    
    let isUpdating = false;
    return ( <>
        <Divider><Typography>{componentTitle}</Typography></Divider>
        <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%', paddingBottom: '3%'}}>
            <FormControl sx={{width: '100%' }}>
                <TextField
                    data-testid="plot-field"
                    id="standard-basic"
                    label={textFieldLabel}
                    variant="standard"
                    value={title}
                    defaultValue={plotTitle}
                    onBlur={updatePlotName}
                    onChange={updatePlotTitleState}
                    onKeyPress={(event) => {
                        if (event.key === "Enter" && !isUpdating) {
                            isUpdating = true;
                            updatePlotName(event);
                            isUpdating = false;
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