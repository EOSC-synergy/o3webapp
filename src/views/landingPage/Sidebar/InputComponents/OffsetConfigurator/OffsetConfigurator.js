import React, { useState } from "react";
import ReferenceYearSlider from "../ReferenceYearSlider/ReferenceYearSlider";
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentPlotType } from "../../../../../store/plotSlice";
import { current } from "@reduxjs/toolkit";

/**
 * enables the user to select a referenceYear, referenceModel and to toggle an offset according to those two inputs
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a jsx containing a referenceYearSlider, a referenceModelSelector and a button to toggle the offset
 */
function OffsetConfigurator(props) {
    
    let i = props.reportError;

    // const currentPlotType = selectCurrentPlotType()
    // const referenceData = useSelector(state => state.reference[currentPlotType])

    // handle changes: dispatch actions accordingly

    return (
        <>
            <ReferenceYearSlider />
            <button />
        </>
    );
}

export default OffsetConfigurator;