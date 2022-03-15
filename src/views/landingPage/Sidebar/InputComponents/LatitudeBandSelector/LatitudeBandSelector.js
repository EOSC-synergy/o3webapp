import React from "react";
import {useDispatch, useSelector} from "react-redux"
import {selectPlotLocation, setLocation} from "../../../../../store/plotSlice/plotSlice";
import {Box, Divider, MenuItem, Select} from "@mui/material";
import Typography from "@mui/material/Typography";
import {latitudeBands} from "../../../../../utils/constants";
import PropTypes from 'prop-types';
import {fetchPlotDataForCurrentModels} from "../../../../../services/API/apiSlice";
import CustomLatitudeSelector from "./CustomLatitudeSelector/CustomLatitudeSelector";

/**
 * An object containing the current minLat and maxLat Values.
 * @memberof LatitudeBandSelector
 */
let selectedLocation;

/**
 * whether the user selected to enter a custom latitude band
 * @memberof LatitudeBandSelector
 */
let [isCustomizable, setIsCustomizable] = [null, null];

/**
 * Enables the user to choose minimum and maximum latitude.
 * Compromised of {@link CustomLatitudeSelector}.
 * @component
 * @param {Object} props specified in propTypes
 * @returns {JSX.Element} a JSX containing a dropdown and if "individual latitude band" is selected a number input field
 */
function LatitudeBandSelector(props) {

    selectedLocation = useSelector(selectPlotLocation);

    [isCustomizable, setIsCustomizable] = React.useState(false);

    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * handles the change when the user clicked on a new latitude band option
     * if the user selected custom sets isCustomizable to true
     * @param {event} event the event that triggered this function call
     */
    const handleChangeLatitudeBand = (event) => {
        if (event.target.value === 'custom') {
            setIsCustomizable(true);
        } else {
            setIsCustomizable(false);
            dispatch(setLocation({
                minLat: event.target.value.minLat,
                maxLat: event.target.value.maxLat
            }));

            // fetch for tco3_zm and tco3_return
            dispatch(fetchPlotDataForCurrentModels());
        }
    };

    return (
        <>
            <Divider>
                <Typography>LATITUDE BAND</Typography>
            </Divider>
            <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%'}}>
                <Select
                    sx={{width: '100%'}}
                    id="latitudeBandSelector"
                    value={isCustomizable ? latitudeBands[latitudeBands.length - 1].value : findLatitudeBandByLocation(false)}
                    onChange={handleChangeLatitudeBand}
                    defaultValue={findLatitudeBandByLocation(false)}
                    inputProps={{"data-testid": "LatitudeBandSelector-select-region"}}
                >
                    {
                        // maps all latitude bands from constants.js to ´MenuItem´s
                        latitudeBands.map(
                            (s, idx) =>
                                <MenuItem key={idx} value={s.value}>{s.text.description}</MenuItem>
                        )
                    }
                </Select>
                {isCustomizable && <div style={{height: '10px'}}/>}
                {isCustomizable && <CustomLatitudeSelector/>}
            </Box>
        </>
    );
}

LatitudeBandSelector.propTypes = {
    /**
     * function for error handling
     */
    reportError: PropTypes.func,
}

export default LatitudeBandSelector;

/**
 * Finds selectedLocation in latitudeBands.
 *
 * @param {boolean} forceCustomizable if true, acts like isCustomizable is true - if false, does nothing
 * @returns the location
 * @memberof LatitudeBandSelector
 * @constant {function}
 */
const findLatitudeBandByLocation = (forceCustomizable) => {
    if (typeof selectedLocation === 'undefined') return null;
    if (!forceCustomizable) {
        for (let i = 0; i < latitudeBands.length - 1; i++) {
            if (latitudeBands[i].value.minLat === selectedLocation.minLat && latitudeBands[i].value.maxLat === selectedLocation.maxLat) {
                return latitudeBands[i].value;
            }
        }
    }
    if (isCustomizable || forceCustomizable) {
        return latitudeBands[latitudeBands.length - 1].value;
    }
    setIsCustomizable(true);
    findLatitudeBandByLocation(true);
}