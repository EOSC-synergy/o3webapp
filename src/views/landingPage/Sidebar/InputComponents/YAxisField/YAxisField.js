import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {setDisplayYRange, selectPlotYRange} from "../../../../../store/plotSlice/plotSlice";
import {Typography, Grid, FormControl, TextField} from "@mui/material";

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

    const [stateY, setStateY] = React.useState({minY, maxY});

    /**
     * Handles the change of the minimum value.
     *
     * @param event the input value
     */
    const handleChangeMin = (event) => {
        if (!isNaN(event.target.value)) {
            setStateY({minY: event.target.value, maxY: maxY});
            if (event.target.value > 0 && event.target.value <= maxY) {
                dispatch(setDisplayYRange({minY: parseInt(event.target.value), maxY: maxY}));
            }
        }
    }

    /**
     * Handles the change of the maximum value.
     *
     * @param event the input value
     */
    const handleChangeMax = (event) => {
        if (!isNaN(event.target.value)) {
            setStateY({minY: minY, maxY: event.target.value});
            if (event.target.value > 0 && minY <= event.target.value) {
                dispatch(setDisplayYRange({minY: minY, maxY: parseInt(event.target.value)}));
            }
        }
    }


    return (
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}}>
            <Grid item xs={3}>
                <Typography>Y-Axis:</Typography>
            </Grid>
            <Grid item xs={3} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '85%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={stateY.minY}
                        onChange={handleChangeMin}
                        error={stateY.minY < 0 || stateY.minY >= maxY}
                        helperText={stateY.minY < 0 ? `<0` : (stateY.minY > maxY ? `min>=max` : '')}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={1} sx={{mt: "-5px"}}>
                <h2 style={{display: "inline"}}> - </h2>
            </Grid>
            <Grid item xs={3} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '85%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={stateY.maxY}
                        onChange={handleChangeMax}
                        error={stateY.maxY < 0 || minY >= stateY.maxY}
                        helperText={stateY.maxY < 0 ? `<0` : (minY > stateY.maxY ? `min>=max` : '')}
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
}

export default YAxisField;