import React, { useState } from "react";
import { useGetPlotsQuery } from "../../../../../store/apiSlice";

/**
 * enables the user to select a different plot type
 * @param {*} props 
 *  props.default -> the default plot type
 * @returns a jsx containing a dropdown to select the plot type
 */
export default function PlotTypeSelector(props) {

    const getAllAvailablePlotTypes = () => {
        const {data, isSuccess, isLoading, isError, error} = useGetPlotsQuery()
        // re-render component based on isLoading <-> isSuccess
    }
    
    // TODO: -> Redux
    props.plotType;
    props.changePlotType;

    props.error;

    return (
        <>
        </>
    );
}