import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setDisplayXRange,
    selectPlotXRange,
    YearsBasedXRange,
} from '../../../../../store/plotSlice/plotSlice';
import { Typography, Grid, TextField, FormControl } from '@mui/material';
import { START_YEAR, END_YEAR } from '../../../../../utils/constants';

/**
 * Enables the user to choose the range that should be visible on the x-axis of the plot.
 * @component
 * @returns {JSX.Element} a jsx containing two text-fields and labels
 */
const XAxisField: React.FC = () => {
    /**
     * A dispatch function to dispatch actions to the redux store.
     * @constant {function}
     */
    const dispatch = useDispatch();

    /**
     * An object containing the minX and maxX values for the x-axis.
     * @see {@link selectPlotXRange}
     * @constant {Object}
     */
    const {
        years: { minX, maxX },
    } = useSelector(selectPlotXRange) as YearsBasedXRange;

    /**
     * Stores the minX and maxX values
     * and checks their validation before sending it to the Redux store.
     * @constant {Array}
     */
    const [stateX, setStateX] = React.useState({ minX, maxX });

    /**
     * Handles the change of the minimum value.
     *
     * @see {@link setStateX}
     * @see {@link setDisplayXRange}
     * @param event {Event} event that triggered the call of this function
     */
    const handleChangeMin = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(event.target.valueAsNumber)) {
            setStateX({ minX: event.target.valueAsNumber, maxX: maxX });
            if (
                event.target.valueAsNumber >= START_YEAR &&
                event.target.valueAsNumber <= END_YEAR &&
                event.target.valueAsNumber < maxX
            ) {
                dispatch(
                    setDisplayXRange({ years: { minX: event.target.valueAsNumber, maxX: maxX } })
                );
            }
        }
    };

    useEffect(() => {
        setStateX({ minX, maxX });
    }, [minX, maxX]);

    /**
     * Handles the change of the maximum value.
     *
     * @param event {Event} event that triggered the call of this function
     * @see {@link setStateX}
     * @see {@link setDisplayXRange}
     */
    const handleChangeMax = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(event.target.valueAsNumber)) {
            setStateX({ minX: minX, maxX: event.target.valueAsNumber });
            if (
                event.target.valueAsNumber >= START_YEAR &&
                event.target.valueAsNumber <= END_YEAR &&
                minX < event.target.valueAsNumber
            ) {
                dispatch(
                    setDisplayXRange({ years: { minX: minX, maxX: event.target.valueAsNumber } })
                );
            }
        }
    };

    return (
        <Grid container sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
            <Grid item xs={3}>
                <Typography>X-Axis:</Typography>
            </Grid>
            <Grid item xs={3} sx={{ mt: '-8px' }}>
                <FormControl sx={{ width: '85%' }}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={stateX.minX}
                        onChange={handleChangeMin}
                        error={
                            stateX.minX < START_YEAR ||
                            stateX.minX > END_YEAR ||
                            stateX.minX >= maxX
                        }
                        helperText={
                            stateX.minX < START_YEAR
                                ? `<${START_YEAR}`
                                : stateX.minX > END_YEAR
                                ? `>${END_YEAR}`
                                : stateX.minX >= maxX
                                ? `min>=max`
                                : ''
                        }
                        inputProps={{ 'data-testid': 'XAxisField-left-input' }}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={1} sx={{ mt: '-5px' }}>
                <h2 style={{ display: 'inline' }}> - </h2>
            </Grid>
            <Grid item xs={3} sx={{ mt: '-8px' }}>
                <FormControl sx={{ width: '85%' }}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={stateX.maxX}
                        onChange={handleChangeMax}
                        error={
                            stateX.maxX < START_YEAR ||
                            stateX.maxX > END_YEAR ||
                            minX >= stateX.maxX
                        }
                        helperText={
                            stateX.maxX < START_YEAR
                                ? `<${START_YEAR}`
                                : stateX.maxX > END_YEAR
                                ? `>${END_YEAR}`
                                : minX >= stateX.maxX
                                ? `min>=max`
                                : ''
                        }
                        inputProps={{ 'data-testid': 'XAxisField-right-input' }}
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default XAxisField;
