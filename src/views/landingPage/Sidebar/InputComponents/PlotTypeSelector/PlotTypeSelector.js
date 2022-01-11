import React, { useState } from "react";
import { useGetPlotsQuery } from "../../../../../services/API/apiSlice";

/**
 * enables the user to select a different plot type
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a jsx containing a dropdown to select the plot type
 */
function PlotTypeSelector(props) {

    /**
     * gets all available plot types
     */
    const getAllAvailablePlotTypes = () => {
        // const {data, isSuccess, isLoading, isError, error} = useGetPlotsQuery()
        // re-render component based on isLoading <-> isSuccess
    }

    let i = props.reportError;

    return (
        <>
            PlotTypeSelector
        </>
    );
}

export default PlotTypeSelector;