import React, { FC } from 'react';
import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { NUM_MONTHS_IN_SEASON } from 'utils/constants';

type SeasonCheckBoxGroupProps = {
    label: string;
    seasonId: number;
    months: { monthId: number; checked: boolean; description: string }[];
    handleSeasonClicked: (seasonId: number) => void;
    handleMonthClicked: (monthId: number) => void;
};
/**
 * Enables the user to select/deselect seasons.
 *
 * @component
 * @param label - label of this season
 * @param seasonId - the id of the season
 * @param months - array containing the months with monthId and selected status.
 * @param handleSeasonClicked - function to handle if the whole season got selected / deselected
 * @param handleMonthClicked - function to handle if a month got selected / deselected
 * @param reportError - a function to report an error
 * @returns {JSX.Element} a jsx containing a checkbox-group with given months and label
 */
const SeasonCheckBoxGroup: FC<SeasonCheckBoxGroupProps> = ({
    label,
    seasonId,
    months,
    handleSeasonClicked,
    handleMonthClicked,
}) => {
    /**
     * Checks if every month in this season is checked.
     *
     * @returns {boolean} True if every month in this season is checked
     */
    const isEveryMonthChecked = () => {
        let all = true;
        for (let i = 0; i < months.length; i++) {
            if (!months[i].checked) {
                all = false;
                break;
            }
        }
        return all;
    };

    /**
     * Checks if the SeasonCheckbox should be displayed as indeterminate, i.e. neither none nor all months are selected.
     *
     * @returns {boolean} True if the SeasonCheckbox should be displayed as indeterminate
     */
    const isIndeterminate = () => {
        let count = 0;
        for (let i = 0; i < months.length; i++) {
            if (months[i].checked) {
                count++;
            }
        }
        return count > 0 && count < NUM_MONTHS_IN_SEASON;
    };

    return (
        <div data-test-id={`CheckboxSeason${seasonId}`}>
            <Grid container justifyContent="center">
                <Grid item>
                    <FormControlLabel
                        label={label}
                        control={
                            <Checkbox
                                inputProps={{
                                    // @ts-expect-error test-id is ok
                                    'data-testid': `CheckboxSeasonNum${seasonId}`,
                                }}
                                indeterminate={isIndeterminate()}
                                checked={isEveryMonthChecked()}
                                onChange={() => handleSeasonClicked(seasonId)}
                            />
                        }
                    />
                </Grid>
                <Grid item>
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                        {months.map(({ monthId, checked }) => {
                            return (
                                <React.Fragment key={monthId}>
                                    <FormControlLabel
                                        label={months[monthId - 1].description}
                                        control={
                                            <Checkbox
                                                inputProps={{
                                                    // @ts-expect-error test-id is ok
                                                    'data-testid': 'CheckboxMonth' + monthId,
                                                }}
                                                checked={checked}
                                                onChange={() => handleMonthClicked(monthId)}
                                            />
                                        }
                                    />
                                </React.Fragment>
                            );
                        })}
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default SeasonCheckBoxGroup;
