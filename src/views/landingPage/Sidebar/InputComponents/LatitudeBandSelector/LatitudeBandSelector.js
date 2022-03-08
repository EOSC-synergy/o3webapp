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
 * Enables the user to choose minimum and maximum latitude
 * @component
 * @param {Object} props
 * @param {function} props.reportError - error handling
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
            dispatch(setLocation({minLat: event.target.value.minLat, maxLat: event.target.value.maxLat}));
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
                    sx={{width: '100%' }}
                    id="latitudeBandSelector"
                    value={findLatitudeBandByLocation(false, false)}
                    onChange={handleChangeLatitudeBand}
                    defaultValue={findLatitudeBandByLocation(false, false)}
                >
                    {
                        // maps all latitude bands from constants.js to ´MenuItem´s
                        latitudeBands.map(
                            (s, idx) => <MenuItem key={idx} value={s.value}>{s.text.description}</MenuItem>
                        )
                    }
                </Select>
                {isCustomizable && <CustomLatitudeSelector />}
            </Box>
        </>
    );
}

LatitudeBandSelector.propTypes = {
    reportError: PropTypes.func,
}

export default LatitudeBandSelector;



/**
 * Finds selectedLocation in latitudeBands.
 *
 * @param {boolean} forceCustomizable if true, acts like isCustomizable is true - if false, does nothing
 * @param {boolean} returnText if true, return the text - if false, return the value
 * @returns the location
 */
export const findLatitudeBandByLocation = (forceCustomizable, returnText) => {
    if (typeof selectedLocation === 'undefined') return null;
    if (isCustomizable  || forceCustomizable) {
        if (returnText) {
            return latitudeBands[latitudeBands.length - 1].text.description;
        } else {
            return latitudeBands[latitudeBands.length - 1].value;
        }
    }
    for (let i = 0; i < latitudeBands.length; i++) {
        if (latitudeBands[i].value.minLat === selectedLocation.minLat && latitudeBands[i].value.maxLat === selectedLocation.maxLat) {
            if (returnText) {
                return latitudeBands[i].text.description;
            } else {
                return latitudeBands[i].value;
            }
        }
    }
    setIsCustomizable(true);
    findLatitudeBandByLocation(true, false);
}