import React, { useEffect } from "react";
import { useDispatch } from "react-redux"
import { selectPlotId, setTitle } from "../../../../../store/plotSlice/plotSlice";
import { Divider, Typography, Box, FormControl, TextField} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectPlotTitle } from "../../../../../store/plotSlice/plotSlice";
import PropTypes from 'prop-types';
import { PLOT_NAME_MAX_LEN } from "../../../../../utils/constants"

/**
 * Enables the user to rename and change the plot title.
 * @component
 * @param {Object} props specified in propTypes
 * @returns {JSX.Element} a jsx containing a text-field to change the plot name
 */
function PlotNameField() {
    
    /** The title that should be displayed above the TextField.
     * @constant {string}
    */
    const componentTitle = "PLOT NAME";

    /** The label displayed inside the TextField while nothing is typed in.
     * @constant {string}
    */
    const textFieldLabel = "New Plot Name";
     
    /** Dispatcher to dispatch the plot name change action.
     * @constant {function}
    */
    const dispatch = useDispatch();

    /**
     * the currently selected plotType
     * @constant {string}
     */
    const plotId = useSelector(selectPlotId);

    /** The current plot title from the store
     * @constant {string}
    */
    const plotTitle = useSelector(selectPlotTitle);

    useEffect(() => {
        // this might be done better but a controlled state throws a (yet) unsolvable redux error
        const textField = document.getElementById("standard-basic-plot-title-input");
        textField.value = plotTitle;
    }, [plotId]);

    /** Handles the change if the text in TextField is modified.
     * @constant {function}
     */
    const updatePlotName = (event) => {
        if (event.target.value.length > PLOT_NAME_MAX_LEN) {
            event.target.value = event.target.value.slice(0, PLOT_NAME_MAX_LEN);
        }
        dispatch(setTitle({title: event.target.value}));
    }
    return (
        <>
            <Divider><Typography>{componentTitle}</Typography></Divider>
            <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%', paddingBottom: '3%'}}>
                <FormControl sx={{width: '100%' }}>
                    <TextField
                        data-testid="plot-field"
                        id="standard-basic-plot-title-input"
                        label={textFieldLabel}
                        variant="standard"
                        defaultValue={plotTitle}
                        onBlur={updatePlotName}
                        onKeyUp={(event) => {
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
    /**
     * function for error handling
     */
    reportError: PropTypes.func.isRequired
}

export default PlotNameField;