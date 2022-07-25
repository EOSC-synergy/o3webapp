import React, { ChangeEvent } from 'react';
import { Grid, Typography, FormControl, TextField, Checkbox } from '@mui/material';
import { useSelector } from 'react-redux';
import { END_YEAR, START_YEAR, O3AS_PLOTS } from 'utils/constants';
import { fetchPlotDataForCurrentModels } from 'services/API/apiSlice/apiSlice';
import { setYear, setVisibility, selectRefYear, selectVisibility } from 'store/referenceSlice';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiVisibilityIcon from '@mui/icons-material/Visibility';
import { selectPlotId } from 'store/plotSlice';
import { useAppDispatch } from 'store/store';

/**
 * Enables the user to select a reference year.
 * @component
 * @returns {JSX.Element} a jsx containing a text field to select the reference year
 */
const ReferenceYearField: React.FC = () => {
    /**
     * A dispatch function to dispatch actions to the redux store.
     * @constant {function}
     */
    const dispatch = useAppDispatch();

    /**
     * The selected reference year from the redux store.
     * @see {@link selectRefYear}
     * @constant {int}
     */
    const selectedYear = useSelector(selectRefYear);

    /**
     * Whether the reference line is visble. Taken from the redux store.
     * @constant {int}
     * @see {@link selectVisibility}
     */
    const refLineVisibility = useSelector(selectVisibility);
    /**
     * The id of the current plot. Taken from the redux store.
     * @constant {String}
     * @see {@link selectPlotId}
     */
    const plotId = useSelector(selectPlotId);

    /**
     * Handles the change of the reference year field if it is modified.
     * @function
     * @see {@link fetchPlotDataForCurrentModels}
     * @param {Event} event the event that triggered the call of this function.
     */
    const handleChangeForRefYear = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(event.target.valueAsNumber)) {
            dispatch(setYear({ year: event.target.valueAsNumber }));
            if (
                event.target.valueAsNumber >= START_YEAR &&
                event.target.valueAsNumber <= END_YEAR
            ) {
                // fetch for tco3_zm and tco3_return
                dispatch(fetchPlotDataForCurrentModels());
            }
        }
    };

    /**
     * Handles the change of the reference line visibility field if it is modified.
     * @function
     * @param {Event} event the event that triggered the call of this function
     */
    const handleShowRefLineClicked = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setVisibility({ visible: event.target.checked }));
    };

    return (
        <>
            <Grid
                container
                sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '5%' }}
            >
                <Grid item xs={5}>
                    <Typography>Reference Year:</Typography>
                </Grid>
                <Grid item xs={7} sx={{ mt: '-8px' }}>
                    <FormControl sx={{ width: '35%' }}>
                        <TextField
                            variant="outlined"
                            id="outlined-basic"
                            size="small"
                            value={selectedYear}
                            onChange={handleChangeForRefYear}
                            error={selectedYear < START_YEAR || selectedYear > END_YEAR}
                            helperText={
                                selectedYear < START_YEAR
                                    ? `<${START_YEAR}`
                                    : selectedYear > END_YEAR
                                    ? `>${END_YEAR}`
                                    : ''
                            }
                            inputProps={{ 'data-testid': 'ReferenceYearField-year' }}
                            type="number"
                        />
                    </FormControl>
                    {plotId === O3AS_PLOTS.tco3_zm && (
                        <FormControl>
                            <Checkbox
                                checked={refLineVisibility}
                                icon={<VisibilityOffIcon data-testid="RefLineInvisibleCheckbox" />}
                                checkedIcon={<MuiVisibilityIcon />}
                                onChange={handleShowRefLineClicked}
                                inputProps={{
                                    // @ts-expect-error https://github.com/mui/material-ui/issues/20160
                                    'data-testid': 'ReferenceYearField-toggleVisibility',
                                }}
                            />
                        </FormControl>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default ReferenceYearField;
