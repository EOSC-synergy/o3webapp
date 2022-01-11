import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setTitle } from "../../../../../store/plotSlice";
import {Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";

/**
 * enables the user to rename the plot
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a textfield to change the plotname
 */
function PlotNameField(props) {
    
    const componentTitle = "PLOT NAME";
    const textFieldLabel = "New Plot Name";

    return ( <>
        <Divider><Typography>{componentTitle}</Typography></Divider>
        <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%', paddingBottom: '3%'}}>
            <FormControl sx={{width: '100%' }}>
                <TextField id="standard-basic" label={textFieldLabel} variant="standard" />
            </FormControl>
        </Box>
        </>
    );
}

export default PlotNameField;