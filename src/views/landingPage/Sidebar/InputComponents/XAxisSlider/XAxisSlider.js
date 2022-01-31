import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { setDisplayXRange, selectPlotXRange } from "../../../../../store/plotSlice/plotSlice";
import { Slider, Typography, Grid } from "@mui/material";

/**
 * enables the user to choose the range that should be visible on the x Axis of the plot
 * @param {Object} props
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a jsx containing a range slider
 */
function XAxisSlider(props) {

    const dispatch = useDispatch()

    const {minX, maxX} = useSelector(selectPlotXRange);

    const handleChange = (event) => {
        const val = event.target.value;
        dispatch(setDisplayXRange({minX: val[0], maxX: val[1]}))
    }

    return (
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: "3%"}}>
            <Grid item xs={3}>
                <Typography>X-Axis:</Typography>
            </Grid>
            <Grid item xs={9}>
                <Slider
                    step={1}
                    size="small"
                    max={2200}
                    min={1900}
                    value={[minX, maxX]}
                    onChange={handleChange}
                />
            </Grid>
        </Grid>    
    );
}

export default XAxisSlider;