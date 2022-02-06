import React from "react";
import { Grid, Typography, FormControl, TextField, Checkbox } from "@mui/material";
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux";
import { setYear, setVisibility, selectVisibility } from "../../../../../store/referenceSlice/referenceSlice";
import { END_YEAR, START_YEAR } from "../../../../../utils/constants";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiVisibilityIcon from '@mui/icons-material/Visibility';

/**
 * Enables the user to select a reference year.
 * @param {Object} props
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX.Element} a jsx containing a text field to select the reference year
 */
function ReferenceYearField(props) {
    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * The selected reference year from the redux store.
     */
    const selectedYear = useSelector(state => state.reference.settings.year);

    /**
     * The selected visibility of the reference line from the redux store
     */
    const refYearVisible = useSelector(selectVisibility)

    /**
     * Handles the change of the reference year field if it is modified.
     */
    const handleChangeForRefYear = (event) => {
        dispatch(setYear({year: event.target.value}));
    };

    /**
     * Handles the change of the reference line visibility field if it is modified.
     */
    const handleShowRefLineClicked = (event) => {
        dispatch(setVisibility({visible: event.target.checked}))
    }

    return (
        <>
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}}>
            <Grid item xs={5}>
            <Typography>Reference year:</Typography>
            </Grid>
            <Grid item xs={7} sx={{mt: "-8px"}}>
                <FormControl sx={{width: '35%'}}>
                    <TextField
                        variant="outlined"
                        id="outlined-basic"
                        size="small"
                        value={selectedYear}
                        onChange={handleChangeForRefYear}
                        error={selectedYear < START_YEAR || selectedYear > END_YEAR}
                        helperText={selectedYear < START_YEAR ? `<${START_YEAR}` : (selectedYear > END_YEAR ? `>${END_YEAR}` : '')}
                    />
                </FormControl>

                <FormControl>
                    <Checkbox
                        icon={<VisibilityOffIcon data-testid="RefLineInvisibleCheckbox" />}
                        checkedIcon={<MuiVisibilityIcon />}
                        onClick={handleShowRefLineClicked} 
                        //checked={refYearVisible} 
                    />
                </FormControl>
                
            </Grid>
        </Grid>
        </>
    );
}

export default ReferenceYearField;
