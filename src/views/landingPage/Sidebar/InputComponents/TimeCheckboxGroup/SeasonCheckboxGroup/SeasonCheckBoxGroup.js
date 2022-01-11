import React, { useState } from "react";
import {Box, Checkbox, FormControlLabel} from "@mui/material";
import { months } from "../../../../../../utils/constants";


/**
 * Enables the user to select/deselect seasons.
 * @param {Object} props
 * @param {String} props.label - label of this season
 * @param {Array of Object: {String, boolean}} props.months - array containing labels for this season
 * @param {function} props.handleSeasonClicked - function to handle if the whole season got selected / deselected
 * @param {function} props.handleMonthClicked - function to handle if a month got selected / deselected
 * @param {function} props.reportError -
 * @returns {JSX} a jsx containing a checkbox-group with given months and label
 */
function SeasonCheckBoxGroup(props) {

    const [monthsBool, setMonthsBool] = React.useState(new Array(months.length).fill(false))

    const changeMonthBoolArray = (idx) => {
        let arr = monthsBool;
        arr[idx] = !arr[idx];
        return arr;
    }

    /**
     * handles update the time selection by pushing the new value to the redux store
     */
    const handleUpdatedSelection = () => {
        // do stuff
        // dispatch(setMonths(months))
    }

    /**
     * handles if a users wants to select / deselect a season
     * @param {event} event the event that triggered a function call
     * @param {int} seasonId the index of the season that has been clicked
     */
    const handleChangeSeason = (event, seasonId) => {
        // do stuff
        handleUpdatedSelection();
    }

    /**
     * selects / deselects a single month
     * //@param {event} event the event that triggered the function call
     * @param {int} idx the number representing the month
     */
    const handleChangeMonth = (idx) => {
        setMonthsBool(changeMonthBoolArray(idx));
        console.log(monthsBool);
        console.log(monthsBool[idx]);
        handleUpdatedSelection();
    }

    const monthsChecked = (monthsList) => {
        let all = monthsBool[monthsList[0]];
        if (all === false) return all;
        for (let i = monthsList[1]; i < monthsList[monthsList.length]; i++) {
            if (monthsBool[i] === false) {
                all = false;
                break;
            }
        }
        return all;
    }

    const monthsIndeterminate = (monthsList) => {
        let some = monthsBool[monthsList[0]];
        for (let i = monthsList[1]; i < monthsList[monthsList.length]; i++) {
            if (monthsBool[i] !== some) {
                some = true;
                break;
            }
        }
        return some;
    }

    return (
        <>
            <FormControlLabel
                label={props.label}
                control={
                    <Checkbox
                        indeterminate={monthsIndeterminate(props.months)}
                        checked={monthsChecked(props.months)}
                        onChange={(event) => handleChangeSeason(props.key)}
                    />
                }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                {months.map((m, idx) =>
                    (<React.Fragment key={idx}> {
                        (idx >= props.months[0] - 1 && idx <= props.months[props.months.length - 1] - 1) &&
                        <FormControlLabel
                            label={m.description}
                            control={<Checkbox checked={monthsBool[idx]} onChange={(event) => handleChangeMonth(idx)} />}
                        />
                    }
                    </React.Fragment>))
                }
            </Box>
        </>
    );
}

export default SeasonCheckBoxGroup;