import React, { type ChangeEvent, ChangeEventHandler, FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPlotId, selectPlotYRange, setDisplayYRange } from 'store/plotSlice';
import { Box, FormControl, Grid, TextField, Typography } from '@mui/material';
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
            reportError('got NaN from min change event handler');
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
            reportError('got NaN from max change event handler');
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

    const helperTextMin = () => {
        const { minY, maxY } = plotId === O3AS_PLOTS.tco3_zm ? stateY_zm : stateY_return;
        if (Number.isNaN(minY)) {
            return '';
        } else if (minY < 0) {
            return `must be positive`;
        } else if (minY >= maxY) {
            return `must be lower than maximum`;
        } else if (maxY - minY > maxDiff) {
            return `the difference must be lower than ${maxDiff}`;
        }
        return '';
    };

    const errorMax = () => {
        const { minY, maxY } = plotId === O3AS_PLOTS.tco3_zm ? stateY_zm : stateY_return;
        if (isNaN(maxY)) {
            return true;
        }
        return maxY < 0 || minY >= maxY || maxY - minY > maxDiff;
    };

    const maxHelperText = () => {
        const { minY, maxY } = plotId === O3AS_PLOTS.tco3_zm ? stateY_zm : stateY_return;
        if (Number.isNaN(maxY)) {
            return '';
        } else if (maxY < 0) {
            return `must be positive`;
        } else if (minY >= maxY) {
            return `must be higher than minimum`;
        } else if (maxY - minY > maxDiff) {
            return `the difference must be lower than ${maxDiff}`;
        }
        return '';
    };

    useEffect(() => {
        if (plotId === O3AS_PLOTS.tco3_zm) {
            setStateY_zm({ minY, maxY });
        } else {
            setStateY_return({ minY, maxY });
        }
    }, [plotId, minY, maxY]);

    return (
        <Grid container sx={{ justifyContent: 'center', marginTop: '.5rem' }}>
            <Grid xs={5}>
                <TextField
                    size="small"
                    variant="outlined"
                    value={plotId === 'tco3_zm' ? stateY_zm.minY : stateY_return.minY}
                    onChange={handleChangeMin}
                    error={isMinValid()}
                    helperText={helperTextMin()}
                    inputProps={{ 'data-testid': 'YAxisField-left-input' }}
                    type="number"
                    label="Y Minimum"
                />
            </Grid>
            <Grid xs={1} sx={{ display: 'flex', justifyContent: 'center', marginTop: '.5rem' }}>
                -
            </Grid>
            <Grid xs={5}>
                <TextField
                    size="small"
                    variant="outlined"
                    id="outlined-basic"
                    value={plotId === O3AS_PLOTS.tco3_zm ? stateY_zm.maxY : stateY_return.maxY}
                    onChange={handleChangeMax}
                    error={errorMax()}
                    helperText={maxHelperText()}
                    inputProps={{ 'data-testid': 'YAxisField-right-input' }}
                    type="number"
                    label="Y Maximum"
                />
            </Grid>
        </Grid>
    );
};

export default YAxisField;
