import React, { type ChangeEvent, ChangeEventHandler, FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPlotId, selectPlotYRange, setDisplayYRange } from 'store/plotSlice';
import { FormControl, Grid, TextField, Typography } from '@mui/material';
import { O3AS_PLOTS } from 'utils/constants';
import { useAppDispatch, useAppStore } from 'store';
import { ErrorReporter } from 'utils/reportError';

type YAxisFieldProps = {
    reportError: ErrorReporter;
};

const YAxisField: FC<YAxisFieldProps> = ({ reportError }) => {
    const store = useAppStore();

    const dispatch = useAppDispatch();

    const { minY, maxY } = useSelector(selectPlotYRange);

    const plotId = useSelector(selectPlotId);

    const [stateY_zm, setStateY_zm] = useState(
        store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange
    );

    const [stateY_return, setStateY_return] = useState(
        store.getState().plot.plotSpecificSettings.tco3_return.displayYRange
    );

    const maxDiff = 400;

    const handleChangeMin: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.valueAsNumber;
        if (Number.isNaN(value)) {
            console.error('got NaN from min change event handler');
            return;
        }
        if (plotId === O3AS_PLOTS.tco3_zm) {
            setStateY_zm({ minY: value, maxY: stateY_zm.maxY });
            if (value > 0 && value < stateY_zm.maxY && stateY_zm.maxY - value <= maxDiff) {
                dispatch(
                    setDisplayYRange({
                        minY: value,
                        maxY: parseInt(stateY_zm.maxY.toString()),
                    })
                );
            }
        } else {
            setStateY_return({ minY: value, maxY: stateY_return.maxY });
            if (value > 0 && value < stateY_return.maxY && stateY_return.maxY - value <= maxDiff) {
                dispatch(
                    setDisplayYRange({
                        minY: value,
                        maxY: stateY_return.maxY,
                    })
                );
            }
        }
    };

    const handleChangeMax: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.valueAsNumber;
        if (Number.isNaN(value)) {
            console.error('got NaN from max change event handler');
            return;
        }
        if (plotId === O3AS_PLOTS.tco3_zm) {
            setStateY_zm({ minY: stateY_zm.minY, maxY: value });
            if (value > 0 && stateY_zm.minY < value && value - stateY_zm.minY <= maxDiff) {
                dispatch(
                    setDisplayYRange({
                        minY: stateY_zm.minY,
                        maxY: value,
                    })
                );
            }
        } else {
            setStateY_return({ minY: stateY_return.minY, maxY: value });
            if (value > 0 && stateY_return.minY < value && value - stateY_return.minY <= maxDiff) {
                dispatch(
                    setDisplayYRange({
                        minY: stateY_return.minY,
                        maxY: value,
                    })
                );
            }
        }
    };

    const isMinValid = () => {
        if (plotId === O3AS_PLOTS.tco3_zm) {
            if (Number.isNaN(stateY_zm.minY)) {
                return true;
            }
            return (
                stateY_zm.minY < 0 ||
                stateY_zm.minY >= stateY_zm.maxY ||
                stateY_zm.maxY - stateY_zm.minY > maxDiff
            );
        } else {
            if (Number.isNaN(stateY_return.minY)) {
                return true;
            }
            return (
                stateY_return.minY < 0 ||
                stateY_return.minY >= stateY_return.maxY ||
                stateY_return.maxY - stateY_return.minY > maxDiff
            );
        }
    };

    /**
     * Returns the corresponding error message if the input value is not valid.
     *
     * @function
     * @returns {string} The error message
     */
    const helperTextMin = () => {
        if (plotId === O3AS_PLOTS.tco3_zm) {
            if (isNaN(parseInt(stateY_zm.minY.toString()))) {
                return '';
            }
            if (isNaN(parseInt(stateY_zm.maxY.toString()))) {
                return '';
            }
            if (parseInt(stateY_zm.minY.toString()) < 0) {
                return `<0`;
            } else if (parseInt(stateY_zm.minY.toString()) >= parseInt(stateY_zm.maxY.toString())) {
                return `min>=max`;
            } else if (
                parseInt(stateY_zm.maxY.toString()) - parseInt(stateY_zm.minY.toString()) >
                maxDiff
            ) {
                return `ΔY>${maxDiff}`;
            } else {
                return '';
            }
        } else {
            if (isNaN(parseInt(stateY_return.minY.toString()))) {
                return '';
            }
            if (isNaN(parseInt(stateY_return.maxY.toString()))) {
                return '';
            }
            if (parseInt(stateY_return.minY.toString()) < 0) {
                return `<0`;
            } else if (
                parseInt(stateY_return.minY.toString()) >= parseInt(stateY_return.maxY.toString())
            ) {
                return `min>=max`;
            } else if (
                parseInt(stateY_return.maxY.toString()) - parseInt(stateY_return.minY.toString()) >
                maxDiff
            ) {
                return `ΔY>${maxDiff}`;
            } else {
                return '';
            }
        }
    };

    /**
     * Evaluates, whether the input of the maximum input is valid or not.
     *
     * @function
     * @returns {boolean} True=valid, false=not valid
     */
    const errorMax = () => {
        if (plotId === O3AS_PLOTS.tco3_zm) {
            if (isNaN(parseInt(stateY_zm.maxY.toString()))) {
                return true;
            }
            if (isNaN(parseInt(stateY_zm.minY.toString()))) {
                return false;
            }
            return (
                parseInt(stateY_zm.maxY.toString()) < 0 ||
                parseInt(stateY_zm.minY.toString()) >= parseInt(stateY_zm.maxY.toString()) ||
                parseInt(stateY_zm.maxY.toString()) - parseInt(stateY_zm.minY.toString()) > maxDiff
            );
        } else {
            if (isNaN(parseInt(stateY_return.maxY.toString()))) {
                return true;
            }
            if (isNaN(parseInt(stateY_return.minY.toString()))) {
                return false;
            }
            return (
                parseInt(stateY_return.maxY.toString()) < 0 ||
                parseInt(stateY_return.minY.toString()) >=
                    parseInt(stateY_return.maxY.toString()) ||
                parseInt(stateY_return.maxY.toString()) - parseInt(stateY_return.minY.toString()) >
                    maxDiff
            );
        }
    };

    /**
     * Returns the corresponding error message if the input value is not valid.
     *
     * @function
     * @returns {string} The error message
     */
    const helperTextMax = () => {
        if (plotId === O3AS_PLOTS.tco3_zm) {
            if (isNaN(parseInt(stateY_zm.minY.toString()))) {
                return '';
            }
            if (isNaN(parseInt(stateY_zm.maxY.toString()))) {
                return '';
            }
            if (parseInt(stateY_zm.maxY.toString()) < 0) {
                return `<0`;
            } else if (parseInt(stateY_zm.minY.toString()) >= parseInt(stateY_zm.maxY.toString())) {
                return `min>=max`;
            } else if (
                parseInt(stateY_zm.maxY.toString()) - parseInt(stateY_zm.minY.toString()) >
                maxDiff
            ) {
                return `ΔY>${maxDiff}`;
            } else {
                return '';
            }
        } else {
            if (isNaN(parseInt(stateY_return.minY.toString()))) {
                return '';
            }
            if (isNaN(parseInt(stateY_return.maxY.toString()))) {
                return '';
            }
            if (parseInt(stateY_return.maxY.toString()) < 0) {
                return `<0`;
            } else if (
                parseInt(stateY_return.minY.toString()) >= parseInt(stateY_return.maxY.toString())
            ) {
                return `min>=max`;
            } else if (
                parseInt(stateY_return.maxY.toString()) - parseInt(stateY_return.minY.toString()) >
                maxDiff
            ) {
                return `ΔY>${maxDiff}`;
            } else {
                return '';
            }
        }
    };

    useEffect(() => {
        if (plotId === O3AS_PLOTS.tco3_zm) {
            setStateY_zm({ minY, maxY });
        } else {
            setStateY_return({ minY, maxY });
        }
    }, [plotId, minY, maxY]);

    return (
        <Grid container sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
            <Grid item xs={3}>
                <Typography>Y-Axis:</Typography>
            </Grid>
            <Grid item xs={3} sx={{ mt: '-8px' }}>
                <FormControl sx={{ width: '85%' }}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={plotId === 'tco3_zm' ? stateY_zm.minY : stateY_return.minY}
                        onChange={handleChangeMin}
                        error={isMinValid()}
                        helperText={helperTextMin()}
                        inputProps={{ 'data-testid': 'YAxisField-left-input' }}
                        type="number"
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
                        value={plotId === O3AS_PLOTS.tco3_zm ? stateY_zm.maxY : stateY_return.maxY}
                        onChange={handleChangeMax}
                        error={errorMax()}
                        helperText={helperTextMax()}
                        inputProps={{ 'data-testid': 'YAxisField-right-input' }}
                        type="number"
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default YAxisField;
