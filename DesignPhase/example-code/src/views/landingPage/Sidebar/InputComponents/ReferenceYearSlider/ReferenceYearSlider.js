import React, { useState } from "react";

/**
 * enables the user to select a reference year
 * @todo add redux connection: should min and max also be in redux?
 * @param {Object} props 
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX} a jsx containing a slider to select the reference year
 */
function ReferenceYearSlider(props) {

    let i = props.reportError;

    /**
     * gets the smallest and biggest possible number for the reference year
     */
    const getReferenceRange = () => {

    }

    return (
        <>
        </>
    );
}

export default ReferenceYearSlider;