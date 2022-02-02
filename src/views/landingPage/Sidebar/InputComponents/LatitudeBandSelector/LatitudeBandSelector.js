import React from "react";
import {useDispatch, useSelector} from "react-redux"
import {selectPlotLocation, setLocation} from "../../../../../store/plotSlice/plotSlice";
import {Box, Divider, Grid, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import { latitudeBands } from "../../../../../utils/constants";
import PropTypes from 'prop-types'; 


/**
 * The minimum possible latitude value 
 */
const min = -90;
/**
 * The biggest possible latitude value
 */
const max = +90;

/**
 * A custom latitude band input that allows the user to enter a custom latitude band
 * @param {String} label the label of the input
 * @param {int} value the value of the input
 * @param {func} onChange the function that handles change of the input
 * @returns {JSX.Element} containing a text field to enter custom latitude band
 */
const customLatitudeBandInput = (label, value, onChange) => {
    return (
        <Grid container>
            <Grid item xs={4}>
                <Typography><br />{label}</Typography>
            </Grid>
            <Grid item xs={8}>
                <TextField
                    id={label}
                    label={label}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="standard"
                    size="small"
                    value={value}
                    onChange={onChange}
                    error={(value < min || value > max)}
                    helperText={(value < min || value > max) ? `value must be between ${min} and ${max}` : " "}
                />
            </Grid>
        </Grid>);
}

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
     * The selectedLocation Object from Redux as an array.
     */
    const selectedLocationArray = [selectedLocation.minLat, selectedLocation.maxLat];

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
        }
    };

    /**
     * changes one single index of the latitude band
     * @param {event} event the event that triggered this function call
     * @param {String} extrema minimum or maximum that should be changed
     */
    const handleChangeLatitudeBandSingleElement = (event, extrema) => {
        let selectedLocationCopy = {...selectedLocation};
        switch(extrema) {
            case "min":
                selectedLocationCopy.minLat = parseInt(event.target.value);
                break;
            case "max":
                selectedLocationCopy.maxLat = parseInt(event.target.value);
                break;
            default:
                props.reportError("Invalid extrema string for single value change.");
        }
        dispatch(setLocation({minLat: selectedLocationCopy.minLat, maxLat: selectedLocationCopy.maxLat}));
    };

    /**
     * Finds selectedLocation in latitudeBands.
     * @returns {{number, number}} the location
     */
    const findLatitudeBandByLocation = () => {
        for (let i = 0; i < latitudeBands.length; i++) {
            if (latitudeBands[i].text.description === 'Custom' ||
                latitudeBands[i].value.minLat === selectedLocation.minLat && latitudeBands[i].value.maxLat === selectedLocation.maxLat) {
                return latitudeBands[i].value;
            }
        }
        /*
        latitudeBands.forEach( latBand => {
            if (latBand.value === 'custom' ||
                latBand.value.minLat === selectedLocation.minLat && latBand.value.maxLat === selectedLocation.maxLat) {
                console.log(latBand.value);
                return latBand.value;
            }
        });

         */
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
                {
                    isCustomizable &&
                    <>
                        {customLatitudeBandInput('lat min', selectedLocationArray[0], (event) => handleChangeLatitudeBandSingleElement(event, "min"))}
                        {customLatitudeBandInput('lat max', selectedLocationArray[1], (event) => handleChangeLatitudeBandSingleElement(event, "max"))}
                    </>
                }
            </Box>
        </>
    );
}

LatitudeBandSelector.propTypes = {
    reportError: PropTypes.func,
}

export default LatitudeBandSelector;