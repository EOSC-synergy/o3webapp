import {useDispatch, useSelector} from "react-redux"
import {Grid, TextField, Typography, FormControl, Divider} from "@mui/material";
import {selectPlotLocation, setLocation} from "../../../../../../store/plotSlice/plotSlice";
import {fetchPlotDataForCurrentModels} from "../../../../../../services/API/apiSlice";
import {
    LATITUDE_BAND_MAX_VALUE,
    LATITUDE_BAND_MIN_VALUE
} from "../../../../../../utils/constants";
import React from "react";


/**
 * A component to select the specific min and max latitude values for the custom region.
 * @memberof LatitudeBandSelector
 * @component
 * @returns {JSX.Element}    JSX with the component
 */
function CustomLatitudeSelector(props) {

    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * An object containing the current minLat and maxLat Values.
     */
    const selectedLocation = useSelector(selectPlotLocation);

    /**
     * The currently selected minLat value.
     */
    const minLat = selectedLocation.minLat;

    /**
     * The currently selected maxLat value.
     */
    const maxLat = selectedLocation.maxLat;

    /**
     * A state variable to store the state of the min. latitude box.
     */
    const [minLatState, setMinLatState] = React.useState(minLat);

    /**
     * A state variable to store the state of the max. latitude box.
     */
    const [maxLatState, setMaxLatState] = React.useState(maxLat);

    /**
     * Handles the change if the min. latitude box is changed.
     *
     * @param {*} event the event object
     */
    const handleChangeMin = (event) => {
        let selectedLocationCopy = {...selectedLocation};
        let val = parseInt(event.target.value);
        if (!isNaN(val)) {
            if (val > maxLat || val > LATITUDE_BAND_MAX_VALUE || val < LATITUDE_BAND_MIN_VALUE) {
                setMinLatState(val);
                return;
            }
            selectedLocationCopy.minLat = val;
            dispatch(setLocation({minLat: selectedLocationCopy.minLat, maxLat: selectedLocationCopy.maxLat}));
            dispatch(fetchPlotDataForCurrentModels());
            setMinLatState(val);
        } else {
            setMinLatState(event.target.value);
        }

    }

    /**
     * Handles the change if the max. latitude box is changed.
     *
     * @param {*} event the event object
     */
    const handleChangeMax = (event) => {
        let selectedLocationCopy = {...selectedLocation};
        let val = parseInt(event.target.value);
        if (!isNaN(val)) {
            if (val < minLat || val > LATITUDE_BAND_MAX_VALUE || val < LATITUDE_BAND_MIN_VALUE) {
                setMaxLatState(val);
                return;
            }
            selectedLocationCopy.maxLat = val;
            dispatch(setLocation({minLat: selectedLocationCopy.minLat, maxLat: selectedLocationCopy.maxLat}));
            dispatch(fetchPlotDataForCurrentModels());
            setMaxLatState(val);
        } else {
            setMaxLatState(event.target.value);
        }


    }

    /**
     * A function to generate the helper text for the min. latitude box.
     *
     * @returns     Text that should be displayed in the helper text
     */
    const generateHelperTextMin = () => {
        if (typeof minLatState === "string") return "";
        if ((typeof minLatState === "string") && (typeof maxLatState === "string")) return `< ${LATITUDE_BAND_MIN_VALUE}`
        if (minLatState < LATITUDE_BAND_MIN_VALUE) return `> ${LATITUDE_BAND_MIN_VALUE}`;
        if (minLatState > LATITUDE_BAND_MAX_VALUE) return `< ${LATITUDE_BAND_MAX_VALUE}`;
        if (minLatState > maxLatState) return maxLatState >= LATITUDE_BAND_MAX_VALUE ? "" : `< ${maxLatState}`


    }

    /**
     * A function to generate the helper text for the max. latitude box.
     *
     * @returns     Text that should be displayed in the helper text
     */
    const generateHelperTextMax = () => {
        if (typeof maxLatState === "string") return "";
        if ((typeof minLatState === "string") && (typeof maxLatState === "string")) return `> ${LATITUDE_BAND_MAX_VALUE}`
        if (maxLatState < LATITUDE_BAND_MIN_VALUE) return `> ${LATITUDE_BAND_MIN_VALUE}`;
        if (maxLatState > LATITUDE_BAND_MAX_VALUE) return `< ${LATITUDE_BAND_MAX_VALUE}`;
        if (minLatState > maxLatState) return minLatState >= LATITUDE_BAND_MAX_VALUE ? "" : `> ${minLatState}`


    }

    return (<>
        <div style={{width: "100%", marginTop: "5%"}}>
            <Divider><Typography>SELECT LATITUDE RANGE</Typography></Divider>
        </div>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: "10%",
            marginLeft: "5%"
        }}>


            <Grid container>
                <Grid item xs={5.5} sx={{mt: "-8px"}}>
                    <FormControl sx={{width: '90%'}}>
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
                                (typeof minLatState === "string") ||
                                ((typeof minLatState === "string") && (typeof maxLatState === "string")) ||
                                minLatState < LATITUDE_BAND_MIN_VALUE ||
                                maxLatState > LATITUDE_BAND_MAX_VALUE ||
                                minLatState > maxLatState
                            }
                            helperText={generateHelperTextMin()}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={1} sx={{mt: "-5px"}}>
                    <h2 style={{display: "inline"}}> - </h2>
                </Grid>
                <Grid item xs={5.5} sx={{mt: "-8px"}}>
                    <FormControl sx={{width: '90%'}}>
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
                                (typeof maxLatState === "string") ||
                                ((typeof minLatState === "string") && (typeof maxLatState === "string")) ||
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
    </>);


}

export default CustomLatitudeSelector;