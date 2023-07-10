import React, { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPlotId, selectPlotXRangeZm, setDisplayXRangeForPlot } from 'store/plotSlice';
import { Grid, TextField } from '@mui/material';
import { END_YEAR, START_YEAR } from 'utils/constants';
import invariant from 'tiny-invariant';

const XAxisField: FC = () => {
    const dispatch = useDispatch();

    const activePlot = useSelector(selectPlotId);
    invariant(activePlot === 'tco3_zm', 'XAxisField is only available for tco3_zm plot');

    const {
        years: { minX, maxX },
    } = useSelector(selectPlotXRangeZm);

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
        <Grid container sx={{ justifyContent: 'center' }}>
            <Grid xs={5}>
                <TextField
                    variant="outlined"
                    size="small"
                    value={xRange.minX}
                    onChange={handleChangeMin}
                    error={
                        xRange.minX < START_YEAR || xRange.minX > END_YEAR || xRange.minX >= maxX
                    }
                    helperText={
                        xRange.minX < START_YEAR
                            ? `must be >${START_YEAR}`
                            : xRange.minX > END_YEAR
                            ? `must be <${END_YEAR}`
                            : xRange.minX >= maxX
                            ? `must be lower than maximum`
                            : ''
                    }
                    inputProps={{ 'data-testid': 'XAxisField-left-input' }}
                    type="number"
                    label="X Minimum"
                />
            </Grid>
            <Grid
                xs={1}
                sx={{
                    marginTop: '.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                -
            </Grid>
            <Grid xs={5}>
                <TextField
                    variant="outlined"
                    size="small"
                    value={xRange.maxX}
                    onChange={handleChangeMax}
                    error={
                        xRange.maxX < START_YEAR || xRange.maxX > END_YEAR || minX >= xRange.maxX
                    }
                    helperText={
                        xRange.maxX < START_YEAR
                            ? `must be >${START_YEAR}`
                            : xRange.maxX > END_YEAR
                            ? `must be <${END_YEAR}`
                            : minX >= xRange.maxX
                            ? `must be higher than minimum`
                            : ''
                    }
                    inputProps={{ 'data-testid': 'XAxisField-right-input' }}
                    type="number"
                    label="X Maximum"
                />
            </Grid>
        </Grid>
    );
};

export default XAxisField;
