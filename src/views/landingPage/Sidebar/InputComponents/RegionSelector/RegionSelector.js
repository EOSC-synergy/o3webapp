import React from "react";
import LatitudeBandSelector from "../LatitudeBandSelector/LatitudeBandSelector";
import {Box, Checkbox, FormControlLabel, Grid} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {selectPlotRegions, setRegions} from "../../../../../store/plotSlice/plotSlice";

/**
 * enables the user to select / deselect regions as well as entering a private region {@link LatitudeBandSelector}
 * @todo add redux connection
 * @param {Object} props
 * @param {function} props.reportError - used to report error functions
 * @returns {JSX.Element}
 */
function RegionSelector(props) {
    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch()

    /**
     * An array containing the selected regions.
     *
     * Examples:
     * If the first region is selected the array would have the following form: [0]
     * If the second and fifth region are selected the array would have the following form: [1, 4]
     */
    const selectedRegions = useSelector(selectPlotRegions);

    /**
     * Handles the change if a region is clicked (selected/deselected).
     *
     * @param {*} regionId The id of the region that was clicked
     */
    const handleRegionChecked = (regionId) => {
        let regionCpy = [...selectedRegions];
        if (regionCpy.includes(regionId)) {
            regionCpy = regionCpy.filter((m) => m !== regionId);
        } else {
            regionCpy.push(regionId);
        }
        // Dispatch region checked
        dispatch(setRegions({ regions: regionCpy.sort((a, b) => a - b)}));
    }

    /**
     * Gets default regions that are available in the return recovery plot.
     */
    const getDefaultRegions = () => {
        return ["test1", "test2", "test3"];
    }

    return (
        <>
            <LatitudeBandSelector />

            <Box sx={{paddingLeft: '8%', paddingRight: '8%', alignItems: "center", display: "flex", flexDirection: "column"}}>
                {
                    getDefaultRegions().map((r, idx) => (
                        <React.Fragment key={idx}>
                            <FormControlLabel
                                label={r}
                                control={
                                    <Checkbox
                                        checked={selectedRegions.includes(getDefaultRegions()[idx])}
                                        onClick={() => handleRegionChecked(idx) }
                                    />
                                }
                            />
                        </React.Fragment>
                    ))
                }
            </Box>
        </>
    );
}

export default RegionSelector;