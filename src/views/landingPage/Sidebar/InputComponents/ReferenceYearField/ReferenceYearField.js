import React from "react";
import {Grid, Typography, FormControl, TextField, Checkbox} from "@mui/material";
import {useDispatch} from "react-redux"
import {useSelector} from "react-redux";
import {END_YEAR, START_YEAR, O3AS_PLOTS} from "../../../../../utils/constants";
import {fetchPlotDataForCurrentModels} from "../../../../../services/API/apiSlice";
import {setYear, setVisibility, selectRefYear, selectVisibility} from "../../../../../store/referenceSlice/referenceSlice";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiVisibilityIcon from '@mui/icons-material/Visibility';
import { selectPlotId } from "../../../../../store/plotSlice/plotSlice";

/**
 * Enables the user to select a reference year.
 * @component
 * @param {Object} props
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX.Element} a jsx containing a text field to select the reference year
 */
function ReferenceYearField() {
    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * The selected reference year from the redux store.
     */
    const selectedYear = useSelector(selectRefYear);
    const refLineVisibility = useSelector(selectVisibility);
    const plotId = useSelector(selectPlotId);

    /**
     * Handles the change of the reference year field if it is modified.
     */
    const handleChangeForRefYear = (event) => {
        if (!isNaN(event.target.value)) {
            dispatch(setYear({year: event.target.value}));
            if (event.target.value >= START_YEAR && event.target.value <= END_YEAR) {
                // fetch for tco3_zm and tco3_return
                dispatch(fetchPlotDataForCurrentModels());
            }
        }
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
                    <Typography>Reference Year:</Typography>
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
                            inputProps={{ "data-testid": "ReferenceYearField-year" }}
                        />
                    </FormControl>
                    {
                        plotId === O3AS_PLOTS.tco3_zm
                        && 
                        <FormControl>
                            <Checkbox
                                checked={refLineVisibility}
                                icon={<VisibilityOffIcon data-testid="RefLineInvisibleCheckbox"/>}
                                checkedIcon={<MuiVisibilityIcon/>}
                                onClick={handleShowRefLineClicked}
                                inputProps={{ "data-testid": "ReferenceYearField-toggleVisibility" }}
                            />
                        </FormControl>
                    }   
                </Grid>
            </Grid>
        </>
    );
}

export default ReferenceYearField;
