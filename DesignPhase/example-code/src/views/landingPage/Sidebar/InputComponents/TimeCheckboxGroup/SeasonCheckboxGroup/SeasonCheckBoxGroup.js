import React, { useState } from "react";


/**
 * enables the user to select / deselect seasons
 * @param {Object} props 
 * @param {String} props.label - label of this season
 * @param {Array of String} props.months - array containing labels for this season
 * @param {Array of booelan} props.monthsChecked - array containing whether months of this season are clicked
 * @param {function} props.handleSeasonClicked - function to handle if the whole season got selected / deselected
 * @param {function} props.hanldeMonthClicked - function to handle if a month got selected / deselected
 * @param {function} props.reportError - 
 * @returns {JSX} a jsx containing a checkboxgroup with given months and label
 */
function SeasonCheckBoxGroup(props) {
    
    let i = props.label;
    i = props.id;
    i = props.months;
    i = props.monthsChecked;
    i = props.handleSeasonClicked;
    i = props.hanldeMonthClicked;
    i = props.reportError;

    return (
        <> 
        </>
    );
}

export default SeasonCheckBoxGroup;