import React, { useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setDisplayXRange, selectPlotXRange} from "../../../../../store/plotSlice/plotSlice";
import {Typography, Grid, TextField, FormControl} from "@mui/material";
import {START_YEAR, END_YEAR} from '../../../../../utils/constants';

/**
 * Enables the user to choose the range that should be visible on the x-axis of the plot.
 * @component
 * @param {Object} props
 * @param {function} props.reportError function for error handling
 * @returns {JSX.Element} a jsx containing two text-fields and labels
 */
function XAxisField() {
    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * An object containing the minX and maxX values for the x-axis.
     */
    const {years: {minX, maxX}} = useSelector(selectPlotXRange);

    /**
     * Stores the minX and maxX values
     * and checks their validation before sending it to the Redux store.
     */
    const [stateX, setStateX] = React.useState({minX, maxX});

    /**
     * Handles the change of the minimum value.
     *
     * @param event the input value
     */
    const handleChangeMin = (event) => {
        if (!isNaN(event.target.value)) {
            setStateX({minX: event.target.value, maxX: maxX});
            if (event.target.value >= START_YEAR && event.target.value <= END_YEAR && event.target.value < maxX) {
                dispatch(setDisplayXRange({years: {minX: parseInt(event.target.value), maxX: maxX}}));
            }
        }
    }

    useEffect(() => {
        setStateX({minX, maxX});
    }, [minX, maxX]);

    /**
     * Handles the change of the maximum value.
     *
     * @param event the input value
     */
    const handleChangeMax = (event) => {
        if (!isNaN(event.target.value)) {
            setStateX({minX: minX, maxX: event.target.value});
            if (event.target.value >= START_YEAR && event.target.value <= END_YEAR && minX < event.target.value) {
                dispatch(setDisplayXRange({years: {minX: minX, maxX: parseInt(event.target.value)}}));
            }
        }
    }

    return (
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto"}}>
            <Grid item xs={3}>
                <Typography>X-Axis:</Typography>
            </Grid>
            <Grid item xs={3} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '85%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={stateX.minX}
                        onChange={handleChangeMin}
                        error={stateX.minX < START_YEAR || stateX.minX > END_YEAR || stateX.minX >= maxX}
                        helperText={stateX.minX < START_YEAR ? `<${START_YEAR}` : (stateX.minX > END_YEAR ? `>${END_YEAR}` : (stateX.minX >= maxX ? `min>=max` : ''))}
                        inputProps={{"data-testid": "XAxisField-left-input"}}
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
                        value={stateX.maxX}
                        onChange={handleChangeMax}
                        error={stateX.maxX < START_YEAR || stateX.maxX > END_YEAR || minX >= stateX.maxX}
                        helperText={stateX.maxX < START_YEAR ? `<${START_YEAR}` : (stateX.maxX > END_YEAR ? `>${END_YEAR}` : (minX >= stateX.maxX ? `min>=max` : ''))}
                        inputProps={{"data-testid": "XAxisField-right-input"}}
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
}

export default XAxisField;