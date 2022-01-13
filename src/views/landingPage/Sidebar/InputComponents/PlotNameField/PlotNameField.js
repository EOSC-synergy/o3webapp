import React from "react";
import { useDispatch } from "react-redux"
import { setTitle } from "../../../../../store/plotSlice/plotSlice";
import { Divider, Typography, Box, FormControl, TextField} from '@mui/material';

/**
 * Enables the user to rename the plot
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a textfield to change the plotname
 */
function PlotNameField(props) {
    
    /** The title that should be displayed above the TextField. */
    const componentTitle = "PLOT NAME";

    /** The label displayed inside the TextField while nothing is typed in. */
    const textFieldLabel = "New Plot Name";

    /** The max. length of the plot name */
    const PLOT_NAME_MAX_LEN = 40;
     
    // /** Dispatcher to dispatch the plot name change action. */
    //const dispatch = useDispatch();

    /** Handles the change if the text in TextField is modified. */
    const handleChange = (event) => {
        if (event.target.value.length > PLOT_NAME_MAX_LEN) {
            event.target.value = event.target.value.slice(0, PLOT_NAME_MAX_LEN);
        }

        // TODO
        // dispatch(setTitle({title: event.target.value}));
    }
    

    return ( <>
        <Divider><Typography>{componentTitle}</Typography></Divider>
        <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%', paddingBottom: '3%'}}>
            <FormControl sx={{width: '100%' }}>
                <TextField id="standard-basic" label={textFieldLabel} variant="standard" onChange={handleChange} />
            </FormControl>
        </Box>
        </>
    );
}

export default PlotNameField;