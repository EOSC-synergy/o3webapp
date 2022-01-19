import React from "react";
import {Box, Checkbox, FormControlLabel} from "@mui/material";
import { months, NUM_MONTHS_IN_SEASON } from "../../../../../../utils/constants";


/**
 * Enables the user to select/deselect seasons.
 * @param {Object} props
 * @param {String} props.label - label of this season
 * @param {Array of Object: {int, boolean}} props.months - array containing the months with monthId and selected status.
 * @param {function} props.handleSeasonClicked - function to handle if the whole season got selected / deselected
 * @param {function} props.handleMonthClicked - function to handle if a month got selected / deselected
 * @param {function} props.reportError -
 * @returns {JSX} a jsx containing a checkbox-group with given months and label
 */
function SeasonCheckBoxGroup(props) {


    /**
     * Checks if every month in this season is checked.
     * 
     * @returns True if every month in this season is checked
     */
    const isEveryMonthChecked = () => {
        let all = true;
        for (let i = 0; i < props.months.length; i++) {
            if (!props.months[i].checked) {
                all = false;
                break;
            }
        }
        return all;
    }

    /**
     * Checks if the SeasonCheckbox should be displayed as indeterminate.
     * 
     * @returns True if the SeasonCheckbox should be displayed as indeterminate
     */
    const isIndeterminate = () => {
        let count = 0;
        for (let i = 0; i < props.months.length; i++) {
            if (props.months[i].checked) {
                count++;
            }
        }
        return ((count > 0 && count < NUM_MONTHS_IN_SEASON));
    }

    return (
        <>
            <FormControlLabel
                label={props.label}
                control={
                    <Checkbox
                        inputProps={{'data-testid':"CheckboxSeason"}}
                        indeterminate={isIndeterminate()}
                        checked={isEveryMonthChecked()}
                        onChange={() => props.handleSeasonClicked(props.seasonId)}

                    />
                }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                {months.map((m, idx) =>
                    (<React.Fragment key={idx}> {
                        ((idx + 1) >= props.months[0].monthId && (idx + 1) <= props.months[props.months.length - 1].monthId) &&
                        <FormControlLabel
                            label={m.description}
                            control={
                                <Checkbox 
                                    inputProps={{'data-testid':"CheckboxMonth" + idx}}
                                    checked={props.months[(idx + 1) - props.months[0].monthId].checked} 
                                    onChange={() => props.handleMonthClicked(idx + 1) }
                                />
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