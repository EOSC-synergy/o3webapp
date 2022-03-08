import React from "react";
import {Box, Checkbox, FormControlLabel, Grid} from "@mui/material";
import { months, NUM_MONTHS_IN_SEASON } from "../../../../../../utils/constants";
import PropTypes from 'prop-types';


/**
 * Enables the user to select/deselect seasons.
 * 
 * @param {Object} props
 * @param {String} props.label - label of this season
 * @param {int} props.seasonId - the id of the season
 * @param {Array.<Object>} props.months - array containing the months with monthId and selected status.
 * @param {function} props.handleSeasonClicked - function to handle if the whole season got selected / deselected
 * @param {function} props.handleMonthClicked - function to handle if a month got selected / deselected
 * @param {function} props.reportError - a function to report an error
 * @returns {JSX.Element} a jsx containing a checkbox-group with given months and label
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
        <div data-test-id={`CheckboxSeason${props.seasonId}`}>
            <Grid container justifyContent="center">
                <Grid item>
                    <FormControlLabel
                        label={props.label}
                        control={
                            <Checkbox
                                inputProps={{'data-testid':`CheckboxSeasonNum${props.seasonId}`}}
                                indeterminate={isIndeterminate()}
                                checked={isEveryMonthChecked()}
                                onChange={() => props.handleSeasonClicked(props.seasonId)}

                            />
                        }
                    />
                </Grid>
                <Grid item>
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                        {props.months.map(({monthId, checked}) => {
                            return (<React.Fragment key={monthId}> {
                                <FormControlLabel
                                    label={months[monthId - 1].description}
                                    control={
                                        <Checkbox
                                            inputProps={{'data-testid':"CheckboxMonth" + monthId}}
                                            checked={checked}
                                            onChange={() => props.handleMonthClicked(monthId) }
                                        />
                                    }
                                />
                            }
                            </React.Fragment>)}
                        )}
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

/**
 * Prop Types of the SeasonCheckBoxGroup
 */
SeasonCheckBoxGroup.propTypes = {
    label: PropTypes.string.isRequired,
    seasonId: PropTypes.number.isRequired,
    months: PropTypes.array.isRequired,
    handleMonthClicked: PropTypes.func.isRequired,
    handleSeasonClicked: PropTypes.func.isRequired,
    reportError: PropTypes.func.isRequired
}

export default SeasonCheckBoxGroup;