import React, { type FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormControl, Grid, TextField } from '@mui/material';
import { selectPlotLocation, setLocation } from 'store/plotSlice';
import { fetchPlotDataForCurrentModels } from 'services/API/apiSlice';
import { type Latitude } from 'utils/constants';
import { useAppDispatch } from 'store';

/**
 * A component to select the specific min and max latitude values for the custom region.
 *
 * @memberof LatitudeBandSelector
 * @returns JSX with the component
 */
const CustomLatitudeSelector: FC = () => {
    /**
     * The biggest possible latitude value.
     *
     * @memberof CustomLatitudeSelector
     */
    const LATITUDE_BAND_MAX_VALUE = 90;

    /**
     * The smallest possible latitude value.
     *
     * @memberof CustomLatitudeSelector
     */
    const LATITUDE_BAND_MIN_VALUE = -90;

    /** A dispatch function to dispatch actions to the redux store. */
    const dispatch = useAppDispatch();

    /**
     * An object containing the current minLat and maxLat Values.
     *
     * @constant {Object}
     */
    const selectedLocation = useSelector(selectPlotLocation) as Latitude;

    /**
     * The currently selected minLat value.
     *
     * @constant {number}
     */
    const minLat = selectedLocation.minLat;

    /**
     * The currently selected maxLat value.
     *
     * @constant {number}
     */
    const maxLat = selectedLocation.maxLat;

    /**
     * A state variable to store the state of the min. latitude box.
     *
     * @constant
     */
    const [minLatState, setMinLatState] = useState(minLat);

    /**
     * A state variable to store the state of the max. latitude box.
     *
     * @constant
     */
    const [maxLatState, setMaxLatState] = useState(maxLat);

    /**
     * Handles the change if the min. latitude box is changed.
     *
     * @function
     * @param event The event object holding the new value of the text box
     */
    const handleChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedLocationCopy = { ...selectedLocation };
        const val = parseInt(event.target.value);
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
            setMinLatState(parseFloat(event.target.value));
        }
    };

    /**
     * Handles the change if the max. latitude box is changed.
     *
     * @function
     * @param event The event object holding the new value of the text box
     */
    const handleChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedLocationCopy = { ...selectedLocation };
        const val = parseInt(event.target.value);
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
            setMaxLatState(parseFloat(event.target.value));
        }
    };

    /**
     * A function to generate the helper text for the min. latitude box.
     *
     * @function
     * @returns Text that should be displayed in the helper text
     */
    const generateHelperTextMin = () => {
        if (typeof minLatState === 'string') {
            return '';
        }
        if (typeof minLatState === 'string' && typeof maxLatState === 'string') {
            return `< ${LATITUDE_BAND_MIN_VALUE}`;
        }
        if (minLatState < LATITUDE_BAND_MIN_VALUE) {
            return `> ${LATITUDE_BAND_MIN_VALUE}`;
        }
        if (minLatState > LATITUDE_BAND_MAX_VALUE) {
            return `< ${LATITUDE_BAND_MAX_VALUE}`;
        }
        if (minLatState > maxLatState) {
            return maxLatState >= LATITUDE_BAND_MAX_VALUE ? '' : `< ${maxLatState}`;
        }
    };

    /**
     * A function to generate the helper text for the max. latitude box.
     *
     * @function
     * @returns {String} Text that should be displayed in the helper text
     */
    const generateHelperTextMax = () => {
        if (typeof maxLatState === 'string') {
            return '';
        }
        if (typeof minLatState === 'string' && typeof maxLatState === 'string') {
            return `> ${LATITUDE_BAND_MAX_VALUE}`;
        }
        if (maxLatState < LATITUDE_BAND_MIN_VALUE) {
            return `> ${LATITUDE_BAND_MIN_VALUE}`;
        }
        if (maxLatState > LATITUDE_BAND_MAX_VALUE) {
            return `< ${LATITUDE_BAND_MAX_VALUE}`;
        }
        if (minLatState > maxLatState) {
            return minLatState >= LATITUDE_BAND_MAX_VALUE ? '' : `> ${minLatState}`;
        }
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
};

export default CustomLatitudeSelector;
