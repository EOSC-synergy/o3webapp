import React, { type ChangeEvent } from 'react';
import { Checkbox, FormControl, Grid, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { END_YEAR, O3AS_PLOTS, START_YEAR } from 'utils/constants';
import { fetchPlotDataForCurrentModels } from 'services/API/apiSlice';
import { selectRefYear, selectVisibility, setVisibility, setYear } from 'store/referenceSlice';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiVisibilityIcon from '@mui/icons-material/Visibility';
import { selectPlotId } from 'store/plotSlice';
import { useAppDispatch } from 'store';

/**
 * Enables the user to select a reference year.
 *
 * @returns {JSX.Element} A jsx containing a text field to select the reference year
 * @component
 */
const ReferenceYearField: React.FC = () => {
    /**
     * A dispatch function to dispatch actions to the redux store.
     *
     * @constant {function}
     */
    const dispatch = useAppDispatch();

    /**
     * The selected reference year from the redux store.
     *
     * @constant {int}
     * @see {@link selectRefYear}
     */
    const selectedYear = useSelector(selectRefYear);

    /**
     * Whether the reference line is visble. Taken from the redux store.
     *
     * @constant {int}
     * @see {@link selectVisibility}
     */
    const refLineVisibility = useSelector(selectVisibility);
    /**
     * The id of the current plot. Taken from the redux store.
     *
     * @constant {String}
     * @see {@link selectPlotId}
     */
    const plotId = useSelector(selectPlotId);

    /**
     * Handles the change of the reference year field if it is modified.
     *
     * @function
     * @param {Event} event The event that triggered the call of this function.
     * @see {@link fetchPlotDataForCurrentModels}
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
     *
     * @function
     * @param {Event} event The event that triggered the call of this function
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
