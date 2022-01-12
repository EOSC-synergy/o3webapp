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
    const numMonthsInSeason = 3;
    const [monthsBool, setMonthsBool] = React.useState(new Array(numMonthsInSeason).fill(false))

    const changeMonthBoolArray = (idx) => {
        let arr = [...monthsBool];
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


    const monthsChecked = () => {
        let all = true;
        for (let i = 0; i < monthsBool.length; i++) {
            if (!monthsBool[i]) {
                all = false;
                break;
            }
        }
        return all;
    }

    const monthsIndeterminate = () => {
        let count = 0;
        for (let i = 0; i < monthsBool.length; i++) {
            if (monthsBool[i]) {
                count++;
            }
        }
        return ((count > 0 && count < numMonthsInSeason));
    }

    const seasonChecked = () => {
        setMonthsBool(new Array(numMonthsInSeason).fill(!monthsChecked()))
    }

    const monthChecked = (monthId) => {
        
        let index = monthId - (props.seasonId * numMonthsInSeason) - 1;
        console.log(index)
        let newMonths = [...monthsBool];
        newMonths[index] = !monthsBool[index];
        setMonthsBool(newMonths);
    }

    return (
        <>
            <FormControlLabel
                label={props.label}
                control={
                    <Checkbox
                        indeterminate={monthsIndeterminate()}
                        checked={monthsChecked()}
                        onChange={(event) => {
                                props.handleSeasonClicked(props.seasonId)
                                seasonChecked()
                            }
                        }

                    />
                }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                {months.map((m, idx) =>
                    (<React.Fragment key={idx}> {
                        (idx >= props.months[0] - 1 && idx <= props.months[props.months.length - 1] - 1) &&
                        <FormControlLabel
                            label={m.description}
                            control={<Checkbox 
                                checked={monthsBool[(idx + 1) - props.months[0]]} 
                                onChange={(event) => {
                                        props.handleMonthClicked(idx + 1);
                                        monthChecked(idx + 1);
                                    } 
                                }/>
                            }
                        />
                    }
                    </React.Fragment>))
                }
            </Box>
        </>
    );
}

export default SeasonCheckBoxGroup;