import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setDisplayYRange, selectPlotYRange, selectPlotId} from "../../../../../store/plotSlice/plotSlice";
import {Typography, Grid, FormControl, TextField} from "@mui/material";
import store from '../../../../../store/store';
import {O3AS_PLOTS} from "../../../../../utils/constants";

/**
 * Enables the user to choose the range that should be visible on the y-axis of the plot.
 * @component
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
     * A string containing the active plot type.
     */
    const plotId = useSelector(selectPlotId);

    /**
     * Stores the minY and maxY values for tco3_zm
     * and checks their validation before sending it to the Redux store.
     */
    const [stateY_zm, setStateY_zm] = React.useState(store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange);

    /**
     * Stores the minY and maxY values for tco3_return
     * and checks their validation before sending it to the Redux store.
     */
    const [stateY_return, setStateY_return] = React.useState(store.getState().plot.plotSpecificSettings.tco3_return.displayYRange);

    /**
     * Handles the change of the minimum value.
     *
     * @param event the input value
     */
    const handleChangeMin = (event) => {
        if (!isNaN(event.target.value)) {
            if (plotId === O3AS_PLOTS.tco3_zm) setStateY_zm({minY: event.target.value, maxY: maxY});
            else setStateY_return({minY: event.target.value, maxY: maxY});
            if (event.target.value > 0 && event.target.value < maxY) {
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
            if (plotId === O3AS_PLOTS.tco3_zm) setStateY_zm({minY: minY, maxY: event.target.value});
            else setStateY_return({minY: minY, maxY: event.target.value});
            if (event.target.value > 0 && minY < event.target.value) {
                dispatch(setDisplayYRange({minY: minY, maxY: parseInt(event.target.value)}));
            }
        }
    }

    useEffect(() => {
        if (plotId === O3AS_PLOTS.tco3_zm) setStateY_zm({minY, maxY});
        else setStateY_return({minY, maxY});
    }, [plotId, minY, maxY]);

    return (
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto"}}>
            <Grid item xs={3}>
                <Typography>Y-Axis:</Typography>
            </Grid>
            <Grid item xs={3} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '85%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={plotId === 'tco3_zm' ? stateY_zm.minY : stateY_return.minY}
                        onChange={handleChangeMin}
                        error={
                            plotId === O3AS_PLOTS.tco3_zm ?
                                stateY_zm.minY < 0 || stateY_zm.minY >= maxY :
                                stateY_return.minY < 0 || stateY_return.minY >= maxY
                        }
                        helperText={
                            plotId === O3AS_PLOTS.tco3_zm ?
                                (stateY_zm.minY < 0 ? `<0` : (stateY_zm.minY >= maxY ? `min>=max` : '')) :
                                (stateY_return.minY < 0 ? `<0` : (stateY_return.minY >= maxY ? `min>=max` : ''))
                        }
                        inputProps={{"data-testid": "YAxisField-left-input"}}
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
                        value={plotId === O3AS_PLOTS.tco3_zm ? stateY_zm.maxY : stateY_return.maxY}
                        onChange={handleChangeMax}
                        error={
                            plotId === O3AS_PLOTS.tco3_zm ?
                                stateY_zm.maxY < 0 || minY >= stateY_zm.maxY :
                                stateY_return.maxY < 0 || minY >= stateY_return.maxY
                        }
                        helperText={
                            plotId === O3AS_PLOTS.tco3_zm ?
                                (stateY_zm.maxY < 0 ? `<0` : (minY >= stateY_zm.maxY ? `min>=max` : '')) :
                                (stateY_return.maxY < 0 ? `<0` : (minY >= stateY_return.maxY ? `min>=max` : ''))
                        }
                        inputProps={{"data-testid": "YAxisField-right-input"}}
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
}

export default YAxisField;