import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDisplayXRange, selectPlotXRange } from "../../../../../store/plotSlice/plotSlice";
import { Typography, Grid, TextField, FormControl } from "@mui/material";
import { START_YEAR, END_YEAR } from '../../../../../utils/constants';

/**
 * Enables the user to choose the range that should be visible on the x-axis of the plot.
 * @param {Object} props
 * @param {function} props.reportError function for error handling
 * @returns {JSX.Element} a jsx containing two text-fields and labels
 */
function XAxisField(props) {
    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * An object containing the minX and maxX values for the x-axis.
     */
    const {minX, maxX} = useSelector(selectPlotXRange);

    /**
     * Handles the change of the minimum value.
     *
     * @param event the input value
     */
    const handleChangeMin = (event) => {
        if (event.target.value === '') {
            dispatch(setDisplayXRange({minX: 0, maxX: maxX}));
        } else if (!isNaN(parseInt(event.target.value))) {
            dispatch(setDisplayXRange({minX: parseInt(event.target.value), maxX: maxX}));
        }
    }

    /**
     * Handles the change of the maximum value.
     *
     * @param event the input value
     */
    const handleChangeMax = (event) => {
        if (event.target.value === '') {
            dispatch(setDisplayXRange({minX: minX, maxX: 0}));
        } else {
            dispatch(setDisplayXRange({minX: minX, maxX: parseInt(event.target.value)}));
        }
    }

    return (
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}}>
            <Grid item xs={3}>
                <Typography>X-Axis:</Typography>
            </Grid>
            <Grid item xs={3} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '80%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={minX}
                        onChange={handleChangeMin}
                        error={minX < START_YEAR || minX > END_YEAR}
                        helperText={minX < START_YEAR ? `<${START_YEAR}` : (minX > END_YEAR ? `>${END_YEAR}` : '')}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={1} sx={{mt: "-5px"}}>
                <h2 style={{display: "inline"}} > - </h2>
            </Grid>
            <Grid item xs={3} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '80%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={maxX}
                        onChange={handleChangeMax}
                        error={maxX < START_YEAR || maxX > END_YEAR}
                        helperText={maxX < START_YEAR ? `<${START_YEAR}` : (maxX > END_YEAR ? `>${END_YEAR}` : '')}
                    />
                </FormControl>
            </Grid>
        </Grid>    
    );
}

export default XAxisField;