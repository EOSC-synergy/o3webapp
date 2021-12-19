import React, { useState } from "react";
import { useGetPlotsQuery } from "../../../../../services/API/apiSlice";

/**
 * enables the user to select a different plot type
 * @param {*} props 
 *  props.default -> the default plot type
 * @returns a jsx containing a dropdown to select the plot type
 */
function PlotTypeSelector(props) {

    const getAllAvailablePlotTypes = () => {
        const {data, isSuccess, isLoading, isError, error} = useGetPlotsQuery()
        // re-render component based on isLoading <-> isSuccess
    }
    
    // TODO: -> Redux
    let i = props.plotType;
    i = props.changePlotType;

    i = props.error;

    return (
        <>
        </>
    );
}

export default PlotTypeSelector;