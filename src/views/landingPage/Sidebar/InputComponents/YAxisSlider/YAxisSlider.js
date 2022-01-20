import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { setDisplayYRange, selectPlotYRange } from "../../../../../store/plotSlice/plotSlice";
import {Slider, Typography, Grid} from "@mui/material";

/**
 * enables the user to select a range that should be diisplayed at the y axis of the plot
 * @param {Object} props 
 * @param {function} props.reportError -> function for error handling
 * @returns {JSX} a jsx containing a range slider
 */
function YAxisSlider(props) {
    
    const dispatch = useDispatch()

    const {minY, maxY} = useSelector(selectPlotYRange);

    const handleChange = (event) => {
        const val = event.target.value;
        dispatch(setDisplayYRange({minY: val[0], maxY: val[1]}));
    }


    return (
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: "3%"}}>
            <Grid item xs={3}>
                <Typography>Y-Axis:</Typography>
            </Grid>
            <Grid item xs={9}>
                <Slider
                    step={1}
                    size="small"
                    max={600}
                    min={0}
                    value={[minY, maxY]}
                    onChange={handleChange}
                />
            </Grid>
        </Grid> 
    );
}

export default YAxisSlider;