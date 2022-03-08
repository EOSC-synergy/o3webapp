import React, { useState } from "react";
import SeasonCheckBoxGroup from "./SeasonCheckboxGroup/SeasonCheckBoxGroup";
import {Alert, Box, Checkbox, Divider, FormControlLabel, Grid} from "@mui/material";
import {
    Winter,
    Spring,
    Summer,
    Autumn,
    NUM_MONTHS_IN_SEASON,
    NUM_MONTHS,
    SEASONS_ARRAY
} from "../../../../../utils/constants";
import Typography from "@mui/material/Typography";
import {fetchPlotDataForCurrentModels} from "../../../../../services/API/apiSlice";
import { useSelector, useDispatch } from "react-redux";
import { selectPlotMonths, setMonths } from "../../../../../store/plotSlice/plotSlice";
import PropTypes from 'prop-types';


/**
 * enables the user to select a month, season or the whole year
 * @component
 * @param {Object} props
 * @param {function} props.reportError - function for error handling
 * @returns {JSX.Element} a jsx containing a checkboxgroup per season and a "all year" checkbox
 */
function TimeCheckBoxGroup(props) {
    
    /**
     * keeps track of the selection a user did. Notifies the user if he did perform
     * an incorrect selection i.e. selecting no month at all.
     */
    const [correctSelection, setCorrectSelection] = useState(true);

    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch()

    /** 
     * An array containing the selected months.
     * 
     * Examples:
     * If e.g. January is selected the array would have the following form: [1]
     * If e.g. February and December are selected the array would look as follows: [2, 12]
     */
    const selectedMonths = useSelector(selectPlotMonths);

    /**
     * Checks if every month is selected.
     * 
     * @returns True if all months are selected
     */
    const isEveryMonthChecked = () => {
        let isChecked = true;
        for (let i = 0; i < NUM_MONTHS; i++) {
            if(!selectedMonths.includes(i + 1)) {
                isChecked = false;
            }
        }
        return isChecked;
    }

    /**
     * Checks if the "All Year"-Checkbox should be displayed as indeterminate.
     * 
     * @returns True if the checkbox should be displayed as indeterminate
     */
    const isIndeterminate = () => {
        let indetCount = 0;
        for (let i = 0; i < NUM_MONTHS; i++) {
            if(!selectedMonths.includes(i + 1)) {
                indetCount++;
            }
        }
        return 0 < indetCount && indetCount < NUM_MONTHS;
    }

    /**
     * This method is called in the end whenever a data change is handled.
     * It takes care of dispatching the months, fetching the plot data
     * and checking whether the selection of the months was correct or not
     * to adjust the stateful variable that decides whether a warning message
     * gets displayed or not.
     * 
     * @param {array} monthCpy an array of months that should be dispatched against the store
     */
    const updateDataProcedure = (monthCpy) => {

        if (monthCpy.length === 0) {
            setCorrectSelection(false);
        } else {
            setCorrectSelection(true);
        };

        dispatch(setMonths({ months: monthCpy.sort((a, b) => a - b)}));

        dispatch(fetchPlotDataForCurrentModels());
    }

    /**
     * Handles the change if the "All Year"-Checkbox is clicked (selected/deselected).
     */
    const handleYearChecked = () => {
        let shouldBeSelected = false;
        for (let i = 0; i < NUM_MONTHS; i++) {
            if (!selectedMonths.includes(i + 1)) shouldBeSelected = true;
        }
        const monthCpy = [];
        if (shouldBeSelected) {
            for (let i = 0; i < NUM_MONTHS; i++) {
                monthCpy.push(i + 1);
            }
        }

        updateDataProcedure(monthCpy);
    }


    /**
     * Handles the change if a season is clicked (selected/deselected).
     * 
     * @param {int} seasonId The id of the season that was clicked
     */
    const handleSeasonChecked = (seasonId) => {
        
        let monthCpy = [...selectedMonths];
        const monthsInSeason = [];
        let shouldBeSelected = false;

        for(let i = 0; i < NUM_MONTHS_IN_SEASON; i++) {
            const currMonthInSeason = SEASONS_ARRAY[seasonId].months[i];
            monthsInSeason.push(currMonthInSeason);

            if(shouldBeSelected) continue;
            shouldBeSelected = !monthCpy.includes(currMonthInSeason)
        }

        if(shouldBeSelected) {
            for (let i = 0; i < NUM_MONTHS_IN_SEASON; i++) {
                if (!monthCpy.includes(monthsInSeason[i])) {
                    monthCpy.push(monthsInSeason[i]);
                }
            }
        } else {
            monthCpy = monthCpy.filter((m) => !monthsInSeason.includes(m));
        }

        updateDataProcedure(monthCpy);
    }

    /**
     * Handles the change if a month is clicked (selected/deselected).
     * 
     * @param {int} monthId - The id of the month that was clicked
     */
    const handleMonthChecked = (monthId) => {
        let monthCpy = [...selectedMonths]
        if (monthCpy.includes(monthId)) {
            monthCpy = monthCpy.filter((m) => m !== monthId);
        } else {
            monthCpy.push(monthId);
        }

        if (monthCpy.length === 0) {
            setCorrectSelection(false);
        } else {
            setCorrectSelection(true);
        };

        updateDataProcedure(monthCpy);
    }

    /**
     * Constructs a SeasonCheckbox for a given season
     * 
     * @param {Object} param - The parameter object representing a season
     * @param {string} param.name - The season name
     * @param {int[]} param.months - An array of monthId's of the months included in this season
     * @param {int} param.seasonId - The id of this season
     * @returns {JSX.Element}                   A preconfigured SeasonCheckbox
     */
    const toSeasonCheckbox = ({name, months, seasonId}) => {
        const monthsInSeason = []
        for (let i = 0; i < months.length; i++) {
            monthsInSeason.push({monthId: months[i], checked: selectedMonths.includes(months[i])})
        }

        return (
            <Grid item xs={6}>
                <SeasonCheckBoxGroup
                    label = {name.description}
                    months = {monthsInSeason}
                    seasonId= {seasonId}
                    handleSeasonClicked = {handleSeasonChecked}
                    handleMonthClicked = {handleMonthChecked}
                    reportError={props.reportError}
                />
            </Grid>
        );
    }

    return (
        <>
            <Divider style={{marginTop: "5%"}}><Typography>TIME</Typography></Divider>
            <Grid container justifyContent="center">
                {
                    !correctSelection
                    &&
                    <Grid item>
                        <Alert severity="warning">
                            No month was selected. Data can only be fetched if at least one month is selected.
                        </Alert>
                    </Grid>
                }
                <Grid item container justifyContent="center">
                    <Grid item>
                        <FormControlLabel
                            label="All year"
                            control={
                                <Checkbox
                                    inputProps={{'data-testid':"CheckboxAllYear"}}
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
}

/**
 * Prop Types of the TimeCheckBoxGroup
 */
TimeCheckBoxGroup.propTypes = {
    reportError: PropTypes.func.isRequired
}

export default TimeCheckBoxGroup;