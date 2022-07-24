import React, { ChangeEvent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setDisplayYRange, selectPlotYRange, selectPlotId } from 'store/plotSlice';
import { Typography, Grid, FormControl, TextField } from '@mui/material';
import { O3AS_PLOTS } from 'utils/constants';
import PropTypes from 'prop-types';
import { useAppDispatch, useAppStore } from 'store/store';

type YAxisFieldProps = {
    reportError?: (error: string) => void;
};

/**
 * Enables the user to choose the range that should be visible on the y-axis of the plot.
 * @component
 * @param reportError function for error handling
 * @returns {JSX.Element} a jsx containing two text-fields and labels
 */
const YAxisField: React.FC<YAxisFieldProps> = ({ reportError = () => undefined }) => {
    const store = useAppStore();

    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useAppDispatch();

    /**
     * An object containing the minY and maxY values for the y-axis.
     * @see {@link selectPlotYRange}
     * @constant {Object}
     */
    const { minY, maxY } = useSelector(selectPlotYRange);

    /**
     * A string containing the active plot type.
     * @see {@link selectPlotId}
     * @constant {String}
     */
    const plotId = useSelector(selectPlotId);

    /**
     * Stores the minY and maxY values for tco3_zm
     * and checks their validation before sending it to the Redux store.
     * @constant {Array}
     */
    const [stateY_zm, setStateY_zm] = React.useState(
        store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange
    );

    /**
     * Stores the minY and maxY values for tco3_return
     * and checks their validation before sending it to the Redux store.
     * @constant {Array}
     */
    const [stateY_return, setStateY_return] = React.useState(
        store.getState().plot.plotSpecificSettings.tco3_return.displayYRange
    );

    /**
     * The maximum y-axis difference the apexcharts library can handle.
     * @constant {number}
     */
    const maxDiff = 400;

    /**
     * Handles the change of the minimum value.
     *
     * @param event {Event} event that triggered the call of this function
     * @function
     * @see {@link setStateY_zm}
     * @see {@link setStateY_return}
     */
    const handleChangeMin = (event: ChangeEvent<HTMLInputElement>) => {
        handleChange(event, 'minY');
    };

    /**
     * Handles the change of the maximum value.
     *
     * @param event {Event} event that triggered the call of this function
     * @function
     * @see {@link setStateY_zm}
     * @see {@link setStateY_return}
     */
    const handleChangeMax = (event: ChangeEvent<HTMLInputElement>) => {
        handleChange(event, 'maxY');
    };

    /**
     * Handles the change of the minimum and the maximum value.
     *
     * @param event {Event} event that triggered the {@link handleChangeMin} or the {@link handleChangeMax} function
     * @param extremum 'minY' or 'maxY', depending on the function that called this function
     * @function
     * @see {@link setStateY_zm}
     * @see {@link setStateY_return}
     */
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        extremum: 'minY' | 'maxY'
    ) => {
        console.log('Hello');
        if (isNaN(event.target.valueAsNumber)) {
            console.error('input is NaN');
            return;
        }
        const value = event.target.valueAsNumber;
        if (plotId === O3AS_PLOTS.tco3_zm) {
            console.info('plot zm');
            if (extremum === 'minY') {
                console.info('minY');
                setStateY_zm({ minY: value, maxY: stateY_zm.maxY });
                if (
                    !isNaN(parseInt(stateY_zm.maxY.toString())) &&
                    value > 0 &&
                    parseInt(stateY_zm.maxY.toString()) > 0 &&
                    value < parseInt(stateY_zm.maxY.toString()) &&
                    parseInt(stateY_zm.maxY.toString()) - value <= maxDiff
                ) {
                    console.info('dispatch growing minY', value);
                    dispatch(
                        setDisplayYRange({
                            minY: value,
                            maxY: parseInt(stateY_zm.maxY.toString()),
                        })
                    );
                }
            } else if (extremum === 'maxY') {
                setStateY_zm({ minY: stateY_zm.minY, maxY: value });
                if (
                    !isNaN(parseInt(stateY_zm.minY.toString())) &&
                    parseInt(stateY_zm.minY.toString()) > 0 &&
                    value > 0 &&
                    parseInt(stateY_zm.minY.toString()) < value &&
                    value - parseInt(stateY_zm.minY.toString()) <= maxDiff
                ) {
                    dispatch(
                        setDisplayYRange({
                            minY: parseInt(stateY_zm.minY.toString()),
                            maxY: value,
                        })
                    );
                }
            } else {
                reportError('Invalid extremum string name in YAxisField.js');
            }
        } else {
            if (extremum === 'minY') {
                setStateY_return({ minY: value, maxY: stateY_return.maxY });
                if (
                    !isNaN(parseInt(stateY_return.maxY.toString())) &&
                    value > 0 &&
                    parseInt(stateY_return.maxY.toString()) > 0 &&
                    value < parseInt(stateY_return.maxY.toString()) &&
                    parseInt(stateY_return.maxY.toString()) - value <= maxDiff
                ) {
                    dispatch(
                        setDisplayYRange({
                            minY: value,
                            maxY: parseInt(stateY_return.maxY.toString()),
                        })
                    );
                }
            } else if (extremum === 'maxY') {
                setStateY_return({ minY: stateY_return.minY, maxY: value });
                if (
                    !isNaN(parseInt(stateY_return.minY.toString())) &&
                    parseInt(stateY_return.minY.toString()) > 0 &&
                    value > 0 &&
                    parseInt(stateY_return.minY.toString()) < value &&
                    value - parseInt(stateY_return.minY.toString()) <= maxDiff
                ) {
                    dispatch(
                        setDisplayYRange({
                            minY: parseInt(stateY_return.minY.toString()),
                            maxY: value,
                        })
                    );
                }
            } else {
                reportError('Invalid extremum string name in YAxisField.js');
            }
        }
    };

    /**
     * Evaluates, whether the input of the minimum input is valid or not.
     *
     * @return {boolean} true=valid, false=not valid
     * @function
     */
    const errorMin = () => {
        if (plotId === O3AS_PLOTS.tco3_zm) {
            if (isNaN(parseInt(stateY_zm.minY.toString()))) {
                return true;
            }
            if (isNaN(parseInt(stateY_zm.maxY.toString()))) {
                return false;
            }
            return (
                parseInt(stateY_zm.minY.toString()) < 0 ||
                parseInt(stateY_zm.minY.toString()) >= parseInt(stateY_zm.maxY.toString()) ||
                parseInt(stateY_zm.maxY.toString()) - parseInt(stateY_zm.minY.toString()) > maxDiff
            );
        } else {
            if (isNaN(parseInt(stateY_return.minY.toString()))) {
                return true;
            }
            if (isNaN(parseInt(stateY_return.maxY.toString()))) {
                return false;
            }
            return (
                parseInt(stateY_return.minY.toString()) < 0 ||
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
     * @return {string} the error message
     * @function
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
     * @return {boolean} true=valid, false=not valid
     * @function
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
     * @return {string} the error message
     * @function
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
                        error={errorMin()}
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

YAxisField.propTypes = {
    /**
     * function for error handling
     */
    reportError: PropTypes.func,
};

export default YAxisField;
