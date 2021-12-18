import React, { useState } from "react";
import LocationSelector from "../LatitudeBandSelector/LatitudeBandSelector";

export default function RegionSelector(props) {

    props.selectedRegions;
    props.error;

    // TODO -> redux
    props.customRegion;
    props.changeCustomRegion;

    // TODO -> API Call
    const getDefaultRegions = () => {

    }

    return (
        <>
            <LocationSelector />
        </>
    );
}