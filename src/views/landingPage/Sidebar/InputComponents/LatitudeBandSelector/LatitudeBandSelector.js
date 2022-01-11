import React from "react";
import { useDispatch } from "react-redux"
import { setLocation } from "../../../../../store/plotSlice";
import {Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import { latitudeBands } from "../../../../../utils/constants";

const min = -90;
const max = +90;
const cols = 4;

const customLatitudeBandInput = (label, value, onChange) => {
    return (
        <>
            <Grid item xs={cols}>
                <Typography>{label}</Typography>
            </Grid>
            <Grid item xs={2 * cols}>
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
        </>);
}

/**
 * Enables the user to choose minimum and maximum latitude
 * @param {Object} props
 * @param {function} props.reportError - error handling
 * @returns {JSX.Element} a JSX containing a dropdown and if "individual latitude band" is selected a number input field
 */
function LatitudeBandSelector(props) {
    /*
    const predefinedOptions = [
        {
            name: "global",
            min: 90,
            max: -90
        }
    ]
    */

    // const dispatch = useDispatch()
    const [latitudeBand, setLatitudeBand] = React.useState([0, 0]);
    const [isCustomizable, setIsCustomizable] = React.useState(false);

    const handleChangeLatitudeBand = (event) => {
        if (event.target.value === 'custom') {
            setIsCustomizable(true);
        } else {
            setLatitudeBand(event.target.value);
            setIsCustomizable(false);
        }
    };

    const handleChangeLatitudeBandSingleElement = (event, idx) => {
        if (idx < latitudeBand.length || idx > 0) {
            let latitudeBandCopy = [...latitudeBand];
            latitudeBandCopy[idx] = event.target.value;
            setLatitudeBand(latitudeBandCopy);
        }
    };

    console.log(latitudeBands);

    return (
        <>
            <Divider>LATITUDE BAND</Divider>
            <Box sx={{paddingLeft: '8%', paddingRight: '8%', paddingTop: '3%'}}>
                <FormControl sx={{width: '100%' }}>
                    <Select
                        labelId="latitudeBandSelectorLabel"
                        id="latitudeBandSelector"
                        value={isCustomizable ? 'custom' : latitudeBand}
                        label="LatitudeBand"
                        onChange={handleChangeLatitudeBand}
                        defaultValue={[-90, 90]}
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

export default LatitudeBandSelector;