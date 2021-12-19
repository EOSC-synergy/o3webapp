import React, { useState } from "react";


/**
 * enables the user to select / deselect seasons
 * @param {Object} props 
 * @param {String} props.label - label of this season
 * @param {Array of Object: {String, boolean}} props.months - array containing labels for this season
 * @param {function} props.handleSeasonClicked - function to handle if the whole season got selected / deselected
 * @param {function} props.handleMonthClicked - function to handle if a month got selected / deselected
 * @param {function} props.reportError -
 * @returns {JSX} a jsx containing a checkboxgroup with given months and label
 */
function SeasonCheckBoxGroup(props) {
    
    let i = props.label;
    i = props.seasonId;
    i = props.months;
    i = props.handleSeasonClicked;
    i = props.handleMonthClicked;
    i = props.reportError;

    return (
        <> 
        </>
    );
}

export default SeasonCheckBoxGroup;