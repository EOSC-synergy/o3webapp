import React, { type FC, useState } from 'react';
import SeasonCheckBoxGroup from './SeasonCheckBoxGroup';
import { Alert, Checkbox, Divider, FormControlLabel, Grid } from '@mui/material';
import { NUM_MONTHS, NUM_MONTHS_IN_SEASON } from 'utils/constants';
import Typography from '@mui/material/Typography';
import { fetchPlotDataForCurrentModels } from 'services/API/apiSlice';
import { useSelector } from 'react-redux';
import { selectPlotMonths, setMonths } from 'store/plotSlice';
import { useAppDispatch } from 'store';

/**
 * Stores the season Winter and its corresponding months. Used in {@link SEASONS_ARRAY}.
 *
 * @memberof TimeCheckBoxGroup
 * @constant {Object}
 * @default {name: Symbol('Winter'), months: [12, 1, 2], seasonId: 0}
 */
const Winter = { name: Symbol('Winter'), months: [12, 1, 2], seasonId: 0 };

/**
 * Stores the season Spring and its corresponding months. Used in {@link SEASONS_ARRAY}.
 *
 * @memberof TimeCheckBoxGroup
 * @constant {Object}
 * @default {name: Symbol('Spring'), months: [3, 4, 5], seasonId: 1}
 */
const Spring = { name: Symbol('Spring'), months: [3, 4, 5], seasonId: 1 };

/**
 * Stores the season Summer and its corresponding months. Used in {@link SEASONS_ARRAY}.
 *
 * @memberof TimeCheckBoxGroup
 * @constant {Object}
 * @default {name: Symbol('Summer'), months: [6, 7, 8], seasonId: 2}
 */
const Summer = { name: Symbol('Summer'), months: [6, 7, 8], seasonId: 2 };

/**
 * Stores the season Autumn and its corresponding months. Used in {@link SEASONS_ARRAY}.
 *
 * @memberof TimeCheckBoxGroup
 * @constant {Object}
 * @default {name: Symbol('Autumn'), months: [9, 10, 11], seasonId: 3}
 */
const Autumn = { name: Symbol('Autumn'), months: [9, 10, 11], seasonId: 3 };

/**
 * Array containing all season indext with the corresponding seasonId
 *
 * @memberof TimeCheckBoxGroup
 * @constant {Array}
 * @default [Winter, Spring, Summer, Autumn]
 * @see {@link TimeCheckBoxGroup.Winter}
 * @see {@link TimeCheckBoxGroup.Spring}
 * @see {@link TimeCheckBoxGroup.Summer}
 * @see {@link TimeCheckBoxGroup.Autumn}
 */
const SEASONS_ARRAY = [Winter, Spring, Summer, Autumn];

/** Enables the user to select a month, season or the whole year */
const TimeCheckBoxGroup: FC = () => {
    /**
     * Keeps track of the selection a user did. Notifies the user if he did perform an incorrect
     * selection i.e. selecting no month at all.
     *
     * @constant {Array}
     */
    const [correctSelection, setCorrectSelection] = useState(true);

    /** A dispatch function to dispatch actions to the redux store. */
    const dispatch = useAppDispatch();

    /**
     * An array containing the selected months.
     *
     * Examples: If e.g. January is selected the array would have the following form: [1] If e.g.
     * February and December are selected the array would look as follows: [2, 12]
     *
     * @constant {Array}
     */
    const selectedMonths = useSelector(selectPlotMonths);

    /**
     * Checks if every month is selected.
     *
     * @function
     * @returns {boolean} True if all months are selected
     */
    const isEveryMonthChecked = () => {
        let isChecked = true;
        for (let i = 0; i < NUM_MONTHS; i++) {
            if (!selectedMonths.includes(i + 1)) {
                isChecked = false;
            }
        }
        return isChecked;
    };

    /**
     * Checks if the "All Year"-Checkbox should be displayed as indeterminate.
     *
     * @function
     * @returns {boolean} True if the checkbox should be displayed as indeterminate
     */
    const isIndeterminate = () => {
        let indetCount = 0;
        for (let i = 0; i < NUM_MONTHS; i++) {
            if (!selectedMonths.includes(i + 1)) {
                indetCount++;
            }
        }
        return 0 < indetCount && indetCount < NUM_MONTHS;
    };

    /**
     * This method is called in the end whenever a data change is handled. It takes care of
     * dispatching the months, fetching the plot data and checking whether the selection of the
     * months was correct or not to adjust the stateful variable that decides whether a warning
     * message gets displayed or not.
     *
     * @function
     * @param monthCpy An array of months that should be dispatched against the store
     */
    const updateDataProcedure = (monthCpy: number[]) => {
        if (monthCpy.length === 0) {
            setCorrectSelection(false);
        } else {
            setCorrectSelection(true);
        }

        dispatch(setMonths({ months: monthCpy.sort((a, b) => a - b) }));

        dispatch(fetchPlotDataForCurrentModels());
    };

    /**
     * Handles the change if the "All Year"-Checkbox is clicked (selected/deselected).
     *
     * @function
     */
    const handleYearChecked = () => {
        let shouldBeSelected = false;
        for (let i = 0; i < NUM_MONTHS; i++) {
            if (!selectedMonths.includes(i + 1)) {
                shouldBeSelected = true;
            }
        }
        const monthCpy = [];
        if (shouldBeSelected) {
            for (let i = 0; i < NUM_MONTHS; i++) {
                monthCpy.push(i + 1);
            }
        }

        updateDataProcedure(monthCpy);
    };

    /**
     * Handles the change if a season is clicked (selected/deselected).
     *
     * @function
     * @param seasonId The id of the season that was clicked
     */
    const handleSeasonChecked = (seasonId: number) => {
        let monthCpy = [...selectedMonths];
        const monthsInSeason: number[] = [];
        let shouldBeSelected = false;

        for (let i = 0; i < NUM_MONTHS_IN_SEASON; i++) {
            const currMonthInSeason = SEASONS_ARRAY[seasonId].months[i];
            monthsInSeason.push(currMonthInSeason);

            if (shouldBeSelected) {
                continue;
            }
            shouldBeSelected = !monthCpy.includes(currMonthInSeason);
        }

        if (shouldBeSelected) {
            for (let i = 0; i < NUM_MONTHS_IN_SEASON; i++) {
                if (!monthCpy.includes(monthsInSeason[i])) {
                    monthCpy.push(monthsInSeason[i]);
                }
            }
        } else {
            monthCpy = monthCpy.filter((m) => !monthsInSeason.includes(m));
        }

        updateDataProcedure(monthCpy);
    };

    /**
     * Handles the change if a month is clicked (selected/deselected).
     *
     * @function
     * @param monthId - The id of the month that was clicked
     */
    const handleMonthChecked = (monthId: number) => {
        let monthCpy = [...selectedMonths];
        if (monthCpy.includes(monthId)) {
            monthCpy = monthCpy.filter((m) => m !== monthId);
        } else {
            monthCpy.push(monthId);
        }

        if (monthCpy.length === 0) {
            setCorrectSelection(false);
        } else {
            setCorrectSelection(true);
        }

        updateDataProcedure(monthCpy);
    };

    /**
     * Constructs a SeasonCheckbox for a given season
     *
     * @function
     * @param name - The season name
     * @param months - An array of monthId's of the months included in this season
     * @param seasonId - The id of this season
     * @returns A preconfigured SeasonCheckbox
     */
    const toSeasonCheckbox = ({
        name,
        months,
        seasonId,
    }: {
        name: symbol;
        months: number[];
        seasonId: number;
    }) => {
        const monthsInSeason = months.map((month) => ({
            monthId: month,
            checked: selectedMonths.includes(month),
        }));

        return (
            <Grid item xs={6}>
                <SeasonCheckBoxGroup
                    label={name.description ?? '?'}
                    months={monthsInSeason}
                    seasonId={seasonId}
                    handleSeasonClicked={handleSeasonChecked}
                    handleMonthClicked={handleMonthChecked}
                />
            </Grid>
        );
    };

    return (
        <>
            <Divider>
                <Typography>TIME</Typography>
            </Divider>
            <Grid container justifyContent="center">
                {!correctSelection && (
                    <Grid item>
                        <Alert severity="warning">
                            No month was selected. Data can only be fetched if at least one month is
                            selected.
                        </Alert>
                    </Grid>
                )}
                <Grid item container justifyContent="center">
                    <Grid item>
                        <FormControlLabel
                            label="All year"
                            control={
                                <Checkbox
                                    inputProps={{
                                        // @ts-expect-error data-testid is ok
                                        'data-testid': 'CheckboxAllYear',
                                    }}
                                    onClick={handleYearChecked}
                                    checked={isEveryMonthChecked()}
                                    indeterminate={isIndeterminate()}
                                />
                            }
                        />
                    </Grid>
                    <Grid item container justifyContent="center">
                        <Grid item container>
                            {toSeasonCheckbox(Winter)}
                            {toSeasonCheckbox(Spring)}
                        </Grid>
                        <Grid item container>
                            {toSeasonCheckbox(Summer)}
                            {toSeasonCheckbox(Autumn)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default TimeCheckBoxGroup;
