import React, { type FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectPlotLocation, setLocation } from 'store/plotSlice';
import { Box, Divider, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import Typography from '@mui/material/Typography';
import { type Latitude, latitudeBands } from 'utils/constants';
import { fetchPlotDataForCurrentModels } from 'services/API/apiSlice';
import CustomLatitudeSelector from './CustomLatitudeSelector';
import { useAppDispatch } from '../../../../../store';

/**
 * Enables the user to choose minimum and maximum latitude
 *
 * @returns A JSX containing a dropdown and if "individual latitude band" is selected a number input
 *   field
 * @component
 */
const LatitudeBandSelector: FC = () => {
    /**
     * An object containing the current minLat and maxLat Values.
     *
     * @memberof LatitudeBandSelector
     * @type {Object}
     * @see {@link selectPlotLocation}
     */
    const selectedLocation = useSelector(selectPlotLocation);

    /**
     * Whether the user selected to enter a custom latitude band
     *
     * @memberof LatitudeBandSelector
     * @default [null, null]
     * @type {Array}
     */
    const [isCustomizable, setIsCustomizable] = useState(false);

    /** A dispatch function to dispatch actions to the redux store. */
    const dispatch = useAppDispatch();

    /**
     * Handles the change when the user clicked on a new latitude band option if the user selected
     * custom sets isCustomizable to true
     *
     * @param {event} event The event that triggered this function call
     */
    const handleChangeLatitudeBand = (event: SelectChangeEvent<Latitude>) => {
        if (event.target.value === 'custom') {
            setIsCustomizable(true);
        } else {
            setIsCustomizable(false);
            const latitude = event.target.value as Latitude;
            dispatch(
                setLocation({
                    minLat: latitude.minLat,
                    maxLat: latitude.maxLat,
                })
            );

            // fetch for tco3_zm and tco3_return
            dispatch(fetchPlotDataForCurrentModels());
        }
    };

    return (
        <>
            <Divider>
                <Typography>LATITUDE BAND</Typography>
            </Divider>
            <Box sx={{ paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%' }}>
                <Select
                    sx={{ width: '100%' }}
                    id="latitudeBandSelector"
                    value={
                        isCustomizable
                            ? latitudeBands[latitudeBands.length - 1].value
                            : findLatitudeBandByLocation(
                                  isCustomizable,
                                  setIsCustomizable,
                                  selectedLocation,
                                  false
                              )
                    }
                    onChange={handleChangeLatitudeBand}
                    defaultValue={findLatitudeBandByLocation(
                        isCustomizable,
                        setIsCustomizable,
                        selectedLocation,
                        false
                    )}
                    inputProps={{ 'data-testid': 'LatitudeBandSelector-select-region' }}
                >
                    {
                        // maps all latitude bands from constants.js to ´MenuItem´s
                        latitudeBands.map((s, idx) => (
                            // @ts-expect-error MenuItem accepts objects, see https://github.com/mui/material-ui/issues/14286
                            <MenuItem key={idx} value={s.value}>
                                {s.text.description}
                            </MenuItem>
                        ))
                    }
                </Select>
                {isCustomizable && <div style={{ height: '10px' }} />}
                {isCustomizable && <CustomLatitudeSelector />}
            </Box>
        </>
    );
};

export default LatitudeBandSelector;

/**
 * Finds selectedLocation in latitudeBands.
 *
 * @memberof LatitudeBandSelector
 * @function
 * @param isCustomizable
 * @param setIsCustomizable
 * @param selectedLocation
 * @param {boolean} forceCustomizable If true, acts like isCustomizable is true - if false, does
 *   nothing
 * @returns The location
 */
const findLatitudeBandByLocation = (
    isCustomizable: boolean,
    setIsCustomizable: (customizable: boolean) => void,
    selectedLocation: Latitude,
    forceCustomizable?: boolean
): Latitude => {
    if (!forceCustomizable) {
        for (let i = 0; i < latitudeBands.length - 1; i++) {
            if (
                latitudeBands[i].value.minLat === selectedLocation.minLat &&
                latitudeBands[i].value.maxLat === selectedLocation.maxLat
            ) {
                return latitudeBands[i].value;
            }
        }
    }
    if (isCustomizable || forceCustomizable) {
        return latitudeBands[latitudeBands.length - 1].value;
    }
    setIsCustomizable(true);
    return findLatitudeBandByLocation(isCustomizable, setIsCustomizable, selectedLocation, true);
};
