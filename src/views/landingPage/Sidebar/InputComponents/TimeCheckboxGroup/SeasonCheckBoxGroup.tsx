import React, { type FC } from 'react';
import { Box, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { months as MONTHS, NUM_MONTHS_IN_SEASON } from 'utils/constants';

type SeasonCheckBoxGroupProps = {
    label: string;
    seasonId: number;
    months: { monthId: number; checked: boolean }[];
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
     * @returns True if every month in this season is checked
     */
    const isEveryMonthChecked = () => {
        return months.every((month) => month.checked);
    };

    /**
     * Checks if the SeasonCheckbox should be displayed as indeterminate, i.e. neither none nor all months are selected.
     *
     * @returns True if the SeasonCheckbox should be displayed as indeterminate
     */
    const isIndeterminate = () => {
        const count = months.reduce((acc, month) => (month.checked ? acc + 1 : acc), 0);
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
                                        label={MONTHS[monthId - 1].description}
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
