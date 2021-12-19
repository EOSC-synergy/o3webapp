import React, { useState } from "react";
import LocationSelector from "../LatitudeBandSelector/LatitudeBandSelector";

export default function RegionSelector(props) {

    props.selectedRegions;
    props.error;

    // TODO -> redux: wird in parent comp gehandlet
    props.customRegion;
    props.changeCustomRegion;

    // TODO -> API Call: ist das in der API verfügbar? sonst in einer config json "hardcoden"
    const getDefaultRegions = () => {

    }

    return (
        <>
            <LocationSelector />
        </>
    );
}