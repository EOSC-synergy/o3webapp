import React from "react";
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux";
import { setYear } from "../../../../../store/referenceSlice/referenceSlice";
import {REF_SLIDER_MAX_YEAR, REF_SLIDER_MIN_YEAR, REF_SLIDER_DEFAULT_YEAR} from  "../../../../../utils/constants";
import { Grid, Typography, Slider, MenuItem } from "@mui/material";
import { Select, InputLabel, OutlinedInput, FormControl } from "@mui/material";

/**
 * enables the user to select a reference year
 * @todo add redux connection: should min and max also be in redux?
 * @param {Object} props
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX} a jsx containing a slider to select the reference year
 */
function ReferenceYearSlider(props) {

     
    // /** Dispatcher to dispatch the plot name change action. */
    const dispatch = useDispatch();

    const selectedYear = useSelector(state => state.reference.settings.year);

    /** Handles the change of the reference year slider if it's is modified.*/
    const handleChangeForRefYear = (event) => {
        dispatch(setYear({year: event.target.value}));
    };

    return (
        <>
        <Grid container>
            <Grid item xs={4}>
            <Typography>Reference year:</Typography>
            </Grid>
            <Grid item xs={8}>
                <Slider
                    defaultValue={REF_SLIDER_DEFAULT_YEAR}
                    step={1}
                    min={REF_SLIDER_MIN_YEAR}
                    max={REF_SLIDER_MAX_YEAR}
                    value={selectedYear}
                    onChange={handleChangeForRefYear}
                    valueLabelDisplay="on"
                    size="small"
                    track={false}
                />
            </Grid>
        </Grid>
        </>
    );
}

export default ReferenceYearSlider;
