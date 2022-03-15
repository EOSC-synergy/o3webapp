import React from "react";
import {Box, Checkbox, FormControlLabel, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectPlotXRange, setDisplayXRange} from "../../../../../store/plotSlice/plotSlice";
import {ALL_REGIONS_ORDERED} from "../../../../../utils/constants";
import {Grid} from "@mui/material";
<<<<<<< HEAD
import PropTypes from 'prop-types';

/**
 * enables the user to select / deselect regions as well as entering a private region
 * 
 * {@link LatitudeBandSelector}
 * 
=======
import CustomLatitudeSelector from "../LatitudeBandSelector/CustomLatitudeSelector/CustomLatitudeSelector";

/**
 * enables the user to select / deselect regions as well as entering a private region {@link LatitudeBandSelector}
 *
>>>>>>> develop
 * @component
 * @param {Object} props specified in PropTypes
 * @returns {JSX.Element}
 */
function RegionSelector() {
    /**
     * A dispatch function to dispatch actions to the redux store.
     * @constant {function}
     */
    const dispatch = useDispatch()

    /**
     * An array containing the selected regions.
     *
     * Examples:
     * If the first region is selected the array would have the following form: [0]
     * If the second and fifth region are selected the array would have the following form: [1, 4]
     * @constant {array}
     */
    const xRangeRegions = useSelector(selectPlotXRange);
    /**
     * Handles the change if a region is clicked (selected/deselected).
     *
     * @param {number} regionIdx The index of the region that was clicked.
     * @constant {function}
     */
    const handleRegionChecked = (regionIdx) => {
        let regionCpy = [...xRangeRegions.regions];
        if (regionCpy.includes(regionIdx)) {
            regionCpy = regionCpy.filter((m) => m !== regionIdx);
        } else {
            regionCpy.push(regionIdx);
        }
        // Dispatch region checked
        regionCpy.sort();
        dispatch(setDisplayXRange({regions: regionCpy})); // TODO
    }

    /**
     * Gets default regions that are available in the return recovery plot.
     * @todo connect to api
     * @constant {function}
     */
    const getDefaultRegions = () => {
        return ALL_REGIONS_ORDERED;
    }

    return (
        <Grid container sx={{width: "90%", marginLeft: "auto", marginRight: "auto"}}>
            <Typography>X-Axis:</Typography>
            <Box sx={{
                paddingLeft: '8%',
                paddingRight: '8%',
                alignItems: "left",
                display: "flex",
                flexDirection: "column"
            }}>
                {
                    getDefaultRegions().map((region, idx) => (
                        <React.Fragment key={idx}>
                            <FormControlLabel
                                label={
                                    idx !== getDefaultRegions().length - 1 ?
                                        region :
                                        <CustomLatitudeSelector/>
                                }
                                control={
                                    <Checkbox
                                        checked={xRangeRegions.regions.includes(idx)}
                                        onClick={() => handleRegionChecked(idx)}
                                        data-testid={`RegionSelector-${idx}`}
                                    />
                                }
                            />
                        </React.Fragment>
                    ))
                }
            </Box>
        </Grid>
    );
}

RegionSelector.propTypes = {
    /**
     * function for error handling
     */
    reportError: PropTypes.func
}

export default RegionSelector;