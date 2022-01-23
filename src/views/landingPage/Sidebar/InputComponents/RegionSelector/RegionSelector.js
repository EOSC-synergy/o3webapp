import React from "react";
import LatitudeBandSelector from "../LatitudeBandSelector/LatitudeBandSelector";
import {Box, Checkbox, FormControlLabel} from "@mui/material";
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
     * @param {number} regionIdx The index of the region that was clicked.
     */
    const handleRegionChecked = (regionIdx) => {
        let regionCpy = [...selectedRegions];
        if (regionCpy.includes(regionIdx)) {
            regionCpy = regionCpy.filter((m) => m !== regionIdx);
        } else {
            regionCpy.push(regionIdx);
        }
        // Dispatch region checked
        dispatch(setRegions({ regions: regionCpy.sort((a, b) => a - b)}));
    }

    /**
     * Gets default regions that are available in the return recovery plot.
     * @todo connect to api
     */
    const getDefaultRegions = () => {
        return ["test1", "test21231", "test3123123123"];
    }

    return (
        <>
            <LatitudeBandSelector />

            <Box sx={{paddingLeft: '8%', paddingRight: '8%', alignItems: "left", display: "flex", flexDirection: "column"}}>
                {
                    getDefaultRegions().map((r, idx) => (
                        <React.Fragment key={idx}>
                            <FormControlLabel
                                label={r}
                                control={
                                    <Checkbox
                                        checked={selectedRegions.includes(idx)}
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