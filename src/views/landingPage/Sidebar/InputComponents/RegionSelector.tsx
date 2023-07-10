import React, { FC, Fragment } from 'react';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    type RegionBasedXRange,
    selectPlotId,
    selectPlotXRange,
    setDisplayXRangeForPlot,
} from 'store/plotSlice';
import { ALL_REGIONS_ORDERED } from 'utils/constants';
import CustomLatitudeSelector from './LatitudeBandSelector/CustomLatitudeSelector';
import invariant from 'tiny-invariant';

/**
 * Enables the user to select / deselect regions as well as entering a custom region.
 *
 * @returns {JSX.Element}
 * @component
 * @see {@link LatitudeBandSelector}
 */
const RegionSelector: FC = () => {
    /** A dispatch function to dispatch actions to the redux store. */
    const dispatch = useDispatch();

    const activePlot = useSelector(selectPlotId);
    invariant(
        activePlot === 'tco3_return',
        'RegionSelector is only available for tco3_return plot'
    );

    const xRangeRegions = useSelector(selectPlotXRange(activePlot));

    const handleRegionChecked = (regionIdx: number) => {
        let regionCpy = [...xRangeRegions.regions];
        if (regionCpy.includes(regionIdx)) {
            regionCpy = regionCpy.filter((m) => m !== regionIdx);
        } else {
            regionCpy.push(regionIdx);
        }
        // Dispatch region checked
        regionCpy.sort();
        dispatch(
            setDisplayXRangeForPlot({
                plotId: activePlot,
                displayXRange: { regions: regionCpy },
            })
        );
    };

    return (
        <Grid container sx={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
            <Typography>X-Axis:</Typography>
            <Box
                sx={{
                    paddingLeft: '8%',
                    paddingRight: '8%',
                    alignItems: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {ALL_REGIONS_ORDERED.map((region, idx) => (
                    <Fragment key={idx}>
                        <FormControlLabel
                            label={
                                idx !== ALL_REGIONS_ORDERED.length - 1 ? (
                                    region
                                ) : (
                                    <CustomLatitudeSelector />
                                )
                            }
                            control={
                                <Checkbox
                                    checked={(xRangeRegions as RegionBasedXRange).regions.includes(
                                        idx
                                    )}
                                    onClick={() => handleRegionChecked(idx)}
                                    data-testid={`RegionSelector-${idx}`}
                                />
                            }
                        />
                    </Fragment>
                ))}
            </Box>
        </Grid>
    );
};

export default RegionSelector;
