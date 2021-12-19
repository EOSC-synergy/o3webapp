import React, { useState } from "react";


/**
 * enables the user to select / deselect seasons
 * @param {*} props 
 *  props.label -> label of this season
 *  props.months -> array containing labels for this season
 *  props.monthsChecked -> array containing whether months of this season are clicked
 *  props.handleSeasonClicked -> function to handle if the whole season got selected / deselected
 *  props.hanldeMonthClicked -> function to handle if a month got selected / deselected
 * @returns {JSX} a jsx containing a checkboxgroup with given months and label
 */
function SeasonCheckBoxGroup(props) {
    
    let i = props.label;
    i = props.id;
    i = props.months;

    // TODO: -> Redux
    i = props.monthsChecked;
    i = props.handleSeasonClicked;
    i = props.hanldeMonthClicked;

    return (
        <> 
        </>
    );
}

export default SeasonCheckBoxGroup;