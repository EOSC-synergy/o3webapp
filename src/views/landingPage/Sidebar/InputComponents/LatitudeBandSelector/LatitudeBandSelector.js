import React from "react";
import {useDispatch, useSelector} from "react-redux"
import {selectPlotLocation, setLocation} from "../../../../../store/plotSlice/plotSlice";
import {Box, Divider, Grid, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {latitudeBands, modelListBegin, modelListEnd, O3AS_PLOTS} from "../../../../../utils/constants";
import PropTypes from 'prop-types';
import {fetchPlotData} from "../../../../../services/API/apiSlice";
import CustomLatitudeSelector from "./CustomLatitudeSelector/CustomLatitudeSelector";


/**
 * Enables the user to choose minimum and maximum latitude
 * @param {Object} props
 * @param {function} props.reportError - error handling
 * @returns {JSX.Element} a JSX containing a dropdown and if "individual latitude band" is selected a number input field
 */
function LatitudeBandSelector(props) {

    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * An object containing the current minLat and maxLat Values.
     */
    const selectedLocation = useSelector(selectPlotLocation);

    /**
     * whether the user selected to enter a custom latitude band
     */
    const [isCustomizable, setIsCustomizable] = React.useState(false);

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
            dispatch(fetchPlotData({plotId: O3AS_PLOTS.tco3_zm, modelListBegin, modelListEnd}));
            dispatch(fetchPlotData({plotId: O3AS_PLOTS.tco3_return, modelListBegin, modelListEnd}));
        }
    };

    /**
     * Finds selectedLocation in latitudeBands.
     * @returns {{number, number}} the location
     */
    const findLatitudeBandByLocation = () => {
        if (isCustomizable) {
            return latitudeBands[latitudeBands.length - 1].value;
        }
        for (let i = 0; i < latitudeBands.length; i++) {
            if (latitudeBands[i].value.minLat === selectedLocation.minLat && latitudeBands[i].value.maxLat === selectedLocation.maxLat) {
                return latitudeBands[i].value;
            }
        }
    }

    return (
        <>
            <Divider>
                <Typography>LATITUDE BAND</Typography>
            </Divider>
            <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%'}}>
                <Select
                    sx={{width: '100%' }}
                    id="latitudeBandSelector"
                    value={findLatitudeBandByLocation()}
                    onChange={handleChangeLatitudeBand}
                    defaultValue={findLatitudeBandByLocation()}
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