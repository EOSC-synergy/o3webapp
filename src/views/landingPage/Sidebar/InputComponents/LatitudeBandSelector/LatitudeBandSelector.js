import React from "react";
import { useDispatch } from "react-redux"
import { setLocation } from "../../../../../store/plotSlice/plotSlice";
import {Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
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
                <Typography>{label}</Typography>
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
     * The default value that should be selected after initially loading this module
     */
    const defaultValue = [-90, 90];

    // const dispatch = useDispatch()
    /***
     * the value of the currently selected latatide band or the entered custom latitude band
     */
    const [latitudeBand, setLatitudeBand] = React.useState([0, 0]);
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
            setLatitudeBand(event.target.value);
            setIsCustomizable(false);
        }
    };

    /**
     * changes one single index of the latitude band
     * @param {event} event the event that triggered this function call
     * @param {int} idx the index that should be changed of the latitude band
     */
    const handleChangeLatitudeBandSingleElement = (event, idx) => {
        if (idx < latitudeBand.length || idx > 0) {
            let latitudeBandCopy = [...latitudeBand];
            latitudeBandCopy[idx] = event.target.value;
            setLatitudeBand(latitudeBandCopy);
        }
    };

    return (
        <>
            <Divider><Typography>LATITUDE BAND</Typography></Divider>
            <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%'}}>
                <FormControl sx={{width: '100%' }}>
                    <Select
                        labelId="latitudeBandSelectorLabel"
                        id="latitudeBandSelector"
                        value={isCustomizable ? 'custom' : latitudeBand}
                        label="LatitudeBand"
                        onChange={handleChangeLatitudeBand}
                        defaultValue={defaultValue}
                    >
                        {
                            // maps all latitude bands from constants.js to ´MenuItem´s
                            latitudeBands.map(
                                (s, idx) => <MenuItem key={idx} value={s.value}>{s.text.description}</MenuItem>
                            )
                        }
                    </Select>
                    <InputLabel id="latitudeBandSelectorLabel">Latitude Band</InputLabel>
                    {
                        isCustomizable &&
                        <> 
                            {customLatitudeBandInput('lat min', latitudeBand[0], (event) => handleChangeLatitudeBandSingleElement(event, 0))}
                            {customLatitudeBandInput('lat max', latitudeBand[1], (event) => handleChangeLatitudeBandSingleElement(event, 1))}
                        </>
                    }

                </FormControl>
            </Box>
        </>
    );
}

LatitudeBandSelector.propTypes = {
    reportError: PropTypes.func,
}

export default LatitudeBandSelector;