import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, FormControl } from '@mui/material';
import { selectPlotLocation, setLocation } from '../../../../../../store/plotSlice/plotSlice';
import { fetchPlotDataForCurrentModels } from '../../../../../../services/API/apiSlice/apiSlice';
import PropTypes from 'prop-types';

/**
 * A component to select the specific min and max latitude values for the custom region.
 * @memberof LatitudeBandSelector
 * @component
 * @returns {JSX.Element}    JSX with the component
 */
function CustomLatitudeSelector() {
    /**
     * The biggest possible latitude value.
     * @constant {number}
     * @memberof CustomLatitudeSelector
     */
    const LATITUDE_BAND_MAX_VALUE = 90;

    /**
     * The smallest possible latitude value.
     * @constant {number}
     * @memberof CustomLatitudeSelector
     */
    const LATITUDE_BAND_MIN_VALUE = -90;

    /**
     * A dispatch function to dispatch actions to the redux store.
     * @function
     */
    const dispatch = useDispatch();

    /**
     * An object containing the current minLat and maxLat Values.
     * @constant {Object}
     */
    const selectedLocation = useSelector(selectPlotLocation);

    /**
     * The currently selected minLat value.
     * @constant {number}
     */
    const minLat = selectedLocation.minLat;

    /**
     * The currently selected maxLat value.
     * @constant {number}
     */
    const maxLat = selectedLocation.maxLat;

    /**
     * A state variable to store the state of the min. latitude box.
     * @constant {string}
     */
    const [minLatState, setMinLatState] = React.useState(minLat);

    /**
     * A state variable to store the state of the max. latitude box.
     * @constant {string}
     */
    const [maxLatState, setMaxLatState] = React.useState(maxLat);

    /**
     * Handles the change if the min. latitude box is changed.
     *
     * @param {*} event The event object holding the new value of the text box
     * @function
     */
    const handleChangeMin = (event) => {
        let selectedLocationCopy = { ...selectedLocation };
        let val = parseInt(event.target.value);
        if (!isNaN(val)) {
            if (val > maxLat || val > LATITUDE_BAND_MAX_VALUE || val < LATITUDE_BAND_MIN_VALUE) {
                setMinLatState(val);
                return;
            }
            selectedLocationCopy.minLat = val;
            dispatch(
                setLocation({
                    minLat: selectedLocationCopy.minLat,
                    maxLat: selectedLocationCopy.maxLat,
                })
            );
            dispatch(fetchPlotDataForCurrentModels());
            setMinLatState(val);
        } else {
            setMinLatState(event.target.value);
        }
    };

    /**
     * Handles the change if the max. latitude box is changed.
     *
     * @param {*} event The event object holding the new value of the text box
     * @function
     */
    const handleChangeMax = (event) => {
        let selectedLocationCopy = { ...selectedLocation };
        let val = parseInt(event.target.value);
        if (!isNaN(val)) {
            if (val < minLat || val > LATITUDE_BAND_MAX_VALUE || val < LATITUDE_BAND_MIN_VALUE) {
                setMaxLatState(val);
                return;
            }
            selectedLocationCopy.maxLat = val;
            dispatch(
                setLocation({
                    minLat: selectedLocationCopy.minLat,
                    maxLat: selectedLocationCopy.maxLat,
                })
            );
            dispatch(fetchPlotDataForCurrentModels());
            setMaxLatState(val);
        } else {
            setMaxLatState(event.target.value);
        }
    };

    /**
     * A function to generate the helper text for the min. latitude box.
     *
     * @returns {String}     Text that should be displayed in the helper text
     * @function
     */
    const generateHelperTextMin = () => {
        if (typeof minLatState === 'string') return '';
        if (typeof minLatState === 'string' && typeof maxLatState === 'string')
            return `< ${LATITUDE_BAND_MIN_VALUE}`;
        if (minLatState < LATITUDE_BAND_MIN_VALUE) return `> ${LATITUDE_BAND_MIN_VALUE}`;
        if (minLatState > LATITUDE_BAND_MAX_VALUE) return `< ${LATITUDE_BAND_MAX_VALUE}`;
        if (minLatState > maxLatState)
            return maxLatState >= LATITUDE_BAND_MAX_VALUE ? '' : `< ${maxLatState}`;
    };

    /**
     * A function to generate the helper text for the max. latitude box.
     *
     * @returns {String}     Text that should be displayed in the helper text
     * @function
     */
    const generateHelperTextMax = () => {
        if (typeof maxLatState === 'string') return '';
        if (typeof minLatState === 'string' && typeof maxLatState === 'string')
            return `> ${LATITUDE_BAND_MAX_VALUE}`;
        if (maxLatState < LATITUDE_BAND_MIN_VALUE) return `> ${LATITUDE_BAND_MIN_VALUE}`;
        if (maxLatState > LATITUDE_BAND_MAX_VALUE) return `< ${LATITUDE_BAND_MAX_VALUE}`;
        if (minLatState > maxLatState)
            return minLatState >= LATITUDE_BAND_MAX_VALUE ? '' : `> ${minLatState}`;
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '5%',
                    marginLeft: '5%',
                }}
            >
                <Grid container>
                    <Grid item xs={5.5} sx={{ mt: '-8px' }}>
                        <FormControl sx={{ width: '90%' }}>
                            <TextField
                                data-testid="minLatSelector"
                                variant="outlined"
                                label="Min. Lat"
                                id="outlined-basic"
                                size="small"
                                type="number"
                                value={minLatState}
                                onChange={handleChangeMin}
                                error={
                                    typeof minLatState === 'string' ||
                                    (typeof minLatState === 'string' &&
                                        typeof maxLatState === 'string') ||
                                    minLatState < LATITUDE_BAND_MIN_VALUE ||
                                    maxLatState > LATITUDE_BAND_MAX_VALUE ||
                                    minLatState > maxLatState
                                }
                                helperText={generateHelperTextMin()}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={1} sx={{ mt: '-5px' }}>
                        <h2 style={{ display: 'inline' }}> - </h2>
                    </Grid>
                    <Grid item xs={5.5} sx={{ mt: '-8px' }}>
                        <FormControl sx={{ width: '90%' }}>
                            <TextField
                                data-testid="maxLatSelector"
                                variant="outlined"
                                label="Max. Lat"
                                id="outlined-basic"
                                size="small"
                                type="number"
                                value={maxLatState}
                                onChange={handleChangeMax}
                                error={
                                    typeof maxLatState === 'string' ||
                                    (typeof minLatState === 'string' &&
                                        typeof maxLatState === 'string') ||
                                    maxLatState < LATITUDE_BAND_MIN_VALUE ||
                                    maxLatState > LATITUDE_BAND_MAX_VALUE ||
                                    minLatState > maxLatState
                                }
                                helperText={generateHelperTextMax()}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

CustomLatitudeSelector.propTypes = {
    /**
     * Function for error handling
     */
    reportError: PropTypes.func,
};

export default CustomLatitudeSelector;
