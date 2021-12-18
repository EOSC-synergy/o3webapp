import React, { useState } from "react";

/**
 * enables the user to select a reference year
 * @param {*} props 
 *  props.defaultReferenceYear -> a int containing the default reference year
 *  props.min -> minimum value for reference year
 *  props.max -> maximum value for reference year
 * @returns a jsx containing a slider to select the reference year
 */
function ReferenceYearSlider(props) {

    let i = props.min;
    i = props.max;
    i = props.error;

    // TODO -> redux
    i = props.currReferenceYear;
    i = props.changeReferenceYear;

    return (
        <>
        </>
    );
}

export default ReferenceYearSlider;