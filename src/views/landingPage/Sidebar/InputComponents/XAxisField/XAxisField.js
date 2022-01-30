import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { setDisplayXRange, selectPlotXRange } from "../../../../../store/plotSlice/plotSlice";
import {Typography, Grid, TextField, FormControl} from "@mui/material";

/**
 * enables the user to choose the range that should be visible on the x Axis of the plot
 * @param {Object} props
 * @param {function} props.reportError - function for error handling
 * @returns {JSX.Element} a jsx containing a range slider
 */
function XAxisField(props) {

    const dispatch = useDispatch()

    const {minX, maxX} = useSelector(selectPlotXRange);

    const handleChangeMin = (event) => {
        if (event.target.value === '') {
            dispatch(setDisplayXRange({minX: 0, maxX: maxX}));
        } else if (!isNaN(parseInt(event.target.value))) {
            dispatch(setDisplayXRange({minX: parseInt(event.target.value), maxX: maxX}));
        }
    }

    const handleChangeMax = (event) => {
        if (event.target.value === '') {
            dispatch(setDisplayXRange({minX: minX, maxX: 0}));
        } else {
            dispatch(setDisplayXRange({minX: minX, maxX: parseInt(event.target.value)}));
        }
    }

    return (
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: "3%"}}>
            <Grid item xs={3}>
                <Typography>X-Axis:</Typography>
            </Grid>
            <Grid item xs={4} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '80%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={minX}
                        onChange={handleChangeMin}
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
                        value={maxX}
                        onChange={handleChangeMax}
                    />
                </FormControl>
            </Grid>
        </Grid>    
    );
}

export default XAxisField;