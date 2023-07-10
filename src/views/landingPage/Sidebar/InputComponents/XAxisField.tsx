import React, { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlotId, selectPlotXRange, setDisplayXRangeForPlot } from 'store/plotSlice';
import { FormControl, Grid, TextField, Typography } from '@mui/material';
import { END_YEAR, START_YEAR } from 'utils/constants';
import invariant from 'tiny-invariant';

const XAxisField: FC = () => {
    const dispatch = useDispatch();

    const activePlot = useSelector(selectPlotId);
    invariant(activePlot === 'tco3_zm', 'XAxisField is only available for tco3_zm plot');

    const {
        years: { minX, maxX },
    } = useSelector(selectPlotXRange(activePlot));

    const [xRange, setXRange] = useState({ minX, maxX });

    const handleChangeMin: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.valueAsNumber;

        if (!isNaN(value)) {
            setXRange({ minX: value, maxX: maxX });
            if (value >= START_YEAR && value <= END_YEAR && value < maxX) {
                dispatch(
                    setDisplayXRangeForPlot({
                        plotId: activePlot,
                        displayXRange: {
                            years: {
                                minX: value,
                                maxX: maxX,
                            },
                        },
                    })
                );
            }
        }
    };

    useEffect(() => {
        setXRange({ minX, maxX });
    }, [minX, maxX]);

    const handleChangeMax: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.valueAsNumber;
        if (!isNaN(value)) {
            setXRange({ minX: minX, maxX: value });
            if (value >= START_YEAR && value <= END_YEAR && minX < value) {
                dispatch(
                    setDisplayXRangeForPlot({
                        plotId: activePlot,
                        displayXRange: {
                            years: {
                                minX: minX,
                                maxX: value,
                            },
                        },
                    })
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
                        value={xRange.minX}
                        onChange={handleChangeMin}
                        error={
                            xRange.minX < START_YEAR ||
                            xRange.minX > END_YEAR ||
                            xRange.minX >= maxX
                        }
                        helperText={
                            xRange.minX < START_YEAR
                                ? `<${START_YEAR}`
                                : xRange.minX > END_YEAR
                                ? `>${END_YEAR}`
                                : xRange.minX >= maxX
                                ? `min>=max`
                                : ''
                        }
                        inputProps={{ 'data-testid': 'XAxisField-left-input' }}
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
                        value={xRange.maxX}
                        onChange={handleChangeMax}
                        error={
                            xRange.maxX < START_YEAR ||
                            xRange.maxX > END_YEAR ||
                            minX >= xRange.maxX
                        }
                        helperText={
                            xRange.maxX < START_YEAR
                                ? `<${START_YEAR}`
                                : xRange.maxX > END_YEAR
                                ? `>${END_YEAR}`
                                : minX >= xRange.maxX
                                ? `min>=max`
                                : ''
                        }
                        inputProps={{ 'data-testid': 'XAxisField-right-input' }}
                        type="number"
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default XAxisField;
