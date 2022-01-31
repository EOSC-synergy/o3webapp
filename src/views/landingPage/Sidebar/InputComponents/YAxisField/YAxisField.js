import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDisplayYRange, selectPlotYRange } from "../../../../../store/plotSlice/plotSlice";
import { Typography, Grid, FormControl, TextField } from "@mui/material";
import {END_YEAR, START_YEAR} from "../../../../../utils/constants";

/**
 * Enables the user to choose the range that should be visible on the y-axis of the plot.
 * @param {Object} props 
 * @param {function} props.reportError function for error handling
 * @returns {JSX.Element} a jsx containing two text-fields and labels
 */
function YAxisField(props) {
    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * An object containing the minY and maxY values for the y-axis.
     */
    const {minY, maxY} = useSelector(selectPlotYRange);

    /**
     * Handles the change of the minimum value.
     *
     * @param event the input value
     */
    const handleChangeMin = (event) => {
        if (event.target.value === '') {
            dispatch(setDisplayYRange({minY: 0, maxY: maxY}));
        } else if (!isNaN(parseInt(event.target.value))) {
            dispatch(setDisplayYRange({minY: parseInt(event.target.value), maxY: maxY}));
        }
    }

    /**
     * Handles the change of the maximum value.
     *
     * @param event the input value
     */
    const handleChangeMax = (event) => {
        if (event.target.value === '') {
            dispatch(setDisplayYRange({minY: minY, maxY: 0}));
        } else {
            dispatch(setDisplayYRange({minY: minY, maxY: parseInt(event.target.value)}));
        }
    }


    return (
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}}>
            <Grid item xs={3}>
                <Typography>Y-Axis:</Typography>
            </Grid>
            <Grid item xs={4} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '80%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={minY}
                        onChange={handleChangeMin}
                        error={minY < 0}
                        helperText={minY < 0 ? `< 0` : ''}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={1} sx={{mt: "-5px"}}>
                <h2 style={{display: "inline", px: "10px", textAlign: "center"}} > - </h2>
            </Grid>
            <Grid item xs={4} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '80%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={maxY}
                        onChange={handleChangeMax}
                        error={maxY < 0}
                        helperText={maxY < 0 ? `< 0` : ''}
                    />
                </FormControl>
            </Grid>
        </Grid> 
    );
}

export default YAxisField;