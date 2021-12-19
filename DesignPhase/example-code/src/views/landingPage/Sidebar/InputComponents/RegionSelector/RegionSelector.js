import React, { useState } from "react";
import LatitudeBandSelector from "../LatitudeBandSelector/LatitudeBandSelector";
import LocationSelector from "../LatitudeBandSelector/LatitudeBandSelector";

/**
 * enables the user to select / deselect regions as well as entering a private region {@link LatitudeBandSelector}

 * @param {Object} props
 * @param {Array} props.selectedRegions - the currently selected regions
 * @param {Function} props.error - used to report error functions
 * @returns {JSX} 
 */
function RegionSelector(props) {

    let i = props.selectedRegions;
    i = props.error;

    i = props.customRegion;
    i = props.changeCustomRegion;

    // TODO -> API Call: ist das in der API verfügbar? sonst in einer config json "hardcoden"
    const getDefaultRegions = () => {

    }

    return (
        <>
            <LatitudeBandSelector />
        </>
    );
}

export default RegionSelector;