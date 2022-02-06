import {useDispatch, useSelector} from "react-redux"
import {Grid, TextField, Typography, FormControl, Divider} from "@mui/material";
import {selectPlotLocation, setLocation} from "../../../../../../store/plotSlice/plotSlice";
import {fetchPlotData} from "../../../../../../services/API/apiSlice";
import {latitudeBands, modelListBegin, modelListEnd, LATITUDE_BAND_MAX_VALUE, LATITUDE_BAND_MIN_VALUE} from "../../../../../../utils/constants";
import React from "react";


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
     const [minLatState, setMinLatState]= React.useState(minLat);

     /**
      * A state variable to store the state of the max. latitude box.
      */
     const [maxLatState, setMaxLatState]= React.useState(maxLat);

     /**
      * Handles the change if the min. latitude box is changed.
      * 
      * @param {*} event the event object
      */
    const handleChangeMin = (event) => {
        let selectedLocationCopy = {...selectedLocation};
        let val = parseInt(event.target.value);
        if (!isNaN(val)) {
            if (val > LATITUDE_BAND_MAX_VALUE) {
                val = LATITUDE_BAND_MAX_VALUE
            } else if (val < LATITUDE_BAND_MIN_VALUE) {
                val = LATITUDE_BAND_MIN_VALUE;
            } else if (val >= maxLat) {
                setMinLatState(event.target.value);
                return;
            }
            selectedLocationCopy.minLat = val;
            dispatch(setLocation({minLat: selectedLocationCopy.minLat, maxLat: selectedLocationCopy.maxLat}));
            dispatch(fetchPlotData(modelListBegin, modelListEnd));
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
            if (val > LATITUDE_BAND_MAX_VALUE) {
                val = LATITUDE_BAND_MAX_VALUE
            } else if (val < LATITUDE_BAND_MIN_VALUE) {
                val = LATITUDE_BAND_MIN_VALUE;
            } else if (val <= minLat) {
                setMaxLatState(event.target.value);
                return;
            }

            selectedLocationCopy.maxLat = val;
            dispatch(setLocation({minLat: selectedLocationCopy.minLat, maxLat: selectedLocationCopy.maxLat}));
            dispatch(fetchPlotData(modelListBegin, modelListEnd));
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
        if (minLat < LATITUDE_BAND_MIN_VALUE) return `> ${LATITUDE_BAND_MIN_VALUE}`;
        if (minLat > LATITUDE_BAND_MAX_VALUE) return `< ${LATITUDE_BAND_MAX_VALUE}`;
        if (minLat > maxLat) return `< ${maxLat}`
    
    }

     /**
     * A function to generate the helper text for the max. latitude box.
     * 
     * @returns     Text that should be displayed in the helper text
     */
    const generateHelperTextMax = () => {
        if (typeof maxLatState === "string") return "";
        if (maxLat < LATITUDE_BAND_MIN_VALUE) return `> ${LATITUDE_BAND_MIN_VALUE}`;
        if (maxLat > LATITUDE_BAND_MAX_VALUE) return `< ${LATITUDE_BAND_MAX_VALUE}`;
        if (minLat > maxLat) return `> ${minLat}`

    }

    return (<>
        <div style={{width: "100%", marginTop: "5%"}}>
        <Divider><Typography>SELECT LATITUDE RANGE</Typography></Divider>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "10%", marginLeft: "5%"}}>  
        
        
        <Grid container>
            <Grid item xs={5.5} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '90%'}}>
                    <TextField
                        variant="outlined"
                        label="Min. Lat"
                        id="outlined-basic"
                        size="small"
                        type="number"
                        value={minLatState}
                        onChange={handleChangeMin}
                        error={(typeof minLatState === "string")|| minLat < LATITUDE_BAND_MIN_VALUE|| maxLat > LATITUDE_BAND_MAX_VALUE || minLat >= maxLat}
                        helperText={generateHelperTextMin()}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={1} sx={{mt: "-5px"}}>
                <h2 style={{display: "inline"}} > - </h2>
            </Grid>
            <Grid item xs={5.5} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '90%'}}>
                    <TextField
                        variant="outlined"
                        label="Max. Lat"
                        id="outlined-basic"
                        size="small"
                        type="number"
                        value={maxLatState}
                        onChange={handleChangeMax}
                        error={(typeof maxLatState === "string") || maxLat < LATITUDE_BAND_MIN_VALUE|| maxLat > LATITUDE_BAND_MAX_VALUE || minLat >= maxLat}
                        helperText={generateHelperTextMax()}
                    />
                </FormControl>
            </Grid>
        </Grid>    
        </div>
        </>);

    
}

export default CustomLatitudeSelector;