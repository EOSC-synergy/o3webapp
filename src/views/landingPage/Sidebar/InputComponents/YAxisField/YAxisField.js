import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDisplayYRange, selectPlotYRange } from "../../../../../store/plotSlice/plotSlice";
import { Typography, Grid, FormControl, TextField } from "@mui/material";

/**
 * enables the user to select a range that should be displayed at the y axis of the plot
 * @param {Object} props 
 * @param {function} props.reportError -> function for error handling
 * @returns {JSX.Element} a jsx containing a range slider
 */
function YAxisField(props) {
    
    const dispatch = useDispatch();

    const {minY, maxY} = useSelector(selectPlotYRange);

    const handleChangeMin = (event) => {
        if (event.target.value === '') {
            dispatch(setDisplayYRange({minY: 0, maxY: maxY}));
        } else if (!isNaN(parseInt(event.target.value))) {
            dispatch(setDisplayYRange({minY: parseInt(event.target.value), maxY: maxY}));
        }
    }

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
                    />
                </FormControl>
            </Grid>
        </Grid> 
    );
}

export default YAxisField;