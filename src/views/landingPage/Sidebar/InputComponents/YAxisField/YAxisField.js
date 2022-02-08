import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    setDisplayYRange,
    selectPlotYRange,
    selectPlotId,
    selectUpdateSwitch
} from "../../../../../store/plotSlice/plotSlice";
import {Typography, Grid, FormControl, TextField} from "@mui/material";
import store from '../../../../../store/store';

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
     * A string containing the active plot type.
     */
    const plotId = useSelector(selectPlotId);

    /**
     * A boolean containing the state of the update switch.
     */
    const updateSwitch = useSelector(selectUpdateSwitch);

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
            if (plotId === 'tc03_zm') setStateY_zm({minY: event.target.value, maxY: maxY});
            else setStateY_return({minY: event.target.value, maxY: maxY});
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
            if (plotId === 'tco3_zm') setStateY_zm({minY: minY, maxY: event.target.value});
            else setStateY_return({minY: minY, maxY: event.target.value});
            if (event.target.value > 0 && minY <= event.target.value) {
                dispatch(setDisplayYRange({minY: minY, maxY: parseInt(event.target.value)}));
            }
        }
    }

    useEffect(() => {
        console.log('useEffect');
        console.log(minY);
        console.log(maxY);
        if (plotId === 'tco3_zm') setStateY_zm({minY, maxY});
        else setStateY_return({minY, maxY});
    }, [updateSwitch]);

    /*
    useEffect(() => {
        // this might be done better but a controlled state, throws a (yet) unsolvable redux error
        if (plotId === 'tco3_zm') {
            if (minY !== stateY_zm.minY || maxY !== stateY_zm.maxY) setStateY_zm({minY, maxY});
        } else {
            if (minY !== stateY_return.minY || maxY !== stateY_return.maxY) setStateY_return({minY, maxY});
        }
    }, [{minY, maxY}]);

     */


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
                        value={plotId === 'tco3_zm' ? stateY_zm.minY : stateY_return.minY}
                        onChange={handleChangeMin}
                        error={
                            plotId === 'tco3_zm' ?
                                stateY_zm.minY < 0 || stateY_zm.minY >= maxY :
                                stateY_return.minY < 0 || stateY_return.minY >= maxY
                        }
                        helperText={
                            plotId === 'tco3_zm' ?
                                (stateY_zm.minY < 0 ? `<0` : (stateY_zm.minY > maxY ? `min>=max` : '')) :
                                (stateY_return.minY < 0 ? `<0` : (stateY_return.minY > maxY ? `min>=max` : ''))
                        }
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
                        value={plotId === 'tco3_zm' ? stateY_zm.maxY : stateY_return.maxY}
                        onChange={handleChangeMax}
                        error={
                            plotId === 'tco3_zm' ?
                                stateY_zm.maxY < 0 || minY >= stateY_zm.maxY :
                                stateY_return.maxY < 0 || minY >= stateY_return.maxY
                        }
                        helperText={
                            plotId === 'tco3_zm' ?
                                (stateY_zm.maxY < 0 ? `<0` : (minY > stateY_zm.maxY ? `min>=max` : '')) :
                                (stateY_return.maxY < 0 ? `<0` : (minY > stateY_return.maxY ? `min>=max` : ''))
                        }
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
}

export default YAxisField;