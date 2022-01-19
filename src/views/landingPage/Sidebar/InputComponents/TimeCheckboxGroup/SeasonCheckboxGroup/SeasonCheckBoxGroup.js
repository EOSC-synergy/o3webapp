import React, { useState } from "react";
import {Box, Checkbox, FormControlLabel} from "@mui/material";
import { months, NUM_MONTHS_IN_SEASON } from "../../../../../../utils/constants";


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


    const monthsChecked = () => {
        let all = true;
        for (let i = 0; i < props.months.length; i++) {
            if (!props.months[i].checked) {
                all = false;
                break;
            }
        }
        return all;
    }

    const monthsIndeterminate = () => {
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
                        indeterminate={monthsIndeterminate()}
                        checked={monthsChecked()}
                        onChange={(event) => props.handleSeasonClicked(props.seasonId)}

                    />
                }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                {months.map((m, idx) =>
                    (<React.Fragment key={idx}> {
                        (idx >= props.months[0].monthId - 1 && idx <= props.months[props.months.length - 1].monthId - 1) &&
                        <FormControlLabel
                            label={m.description}
                            control={
                                <Checkbox 
                                    checked={props.months[(idx + 1) - props.months[0].monthId].checked} 
                                    onChange={(event) => props.handleMonthClicked(idx + 1) }
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