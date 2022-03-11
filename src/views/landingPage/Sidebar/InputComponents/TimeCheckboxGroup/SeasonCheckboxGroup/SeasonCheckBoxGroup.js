import React from "react";
import {Box, Checkbox, FormControlLabel, Grid} from "@mui/material";
import { months, NUM_MONTHS_IN_SEASON } from "../../../../../../utils/constants";
import PropTypes from 'prop-types';


/**
 * Enables the user to select/deselect seasons.
 * Used in {@link TimeCheckBoxGroup}
 * 
 * @component
 * @param {Object} props specified in propTypes
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
    /**
     * label of this season
     */
    label: PropTypes.string.isRequired,
    /**
     * the id of the season
     */
    seasonId: PropTypes.number.isRequired,
    /**
     * array containing the months with monthId and selected status
     */
    months: PropTypes.array.isRequired,
    /**
     * function to handle if a month got selected / deselected
     */
    handleMonthClicked: PropTypes.func.isRequired,
    /**
     * function to handle if the whole season got selected / deselected
     */
    handleSeasonClicked: PropTypes.func.isRequired,
    /**
     * a function to report an error
     */
    reportError: PropTypes.func.isRequired
}

export default SeasonCheckBoxGroup;