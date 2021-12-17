import React, { useState } from "react";
import SeasonCheckBoxGroup from "./SeasonCheckboxGroup/SeasonCheckBoxGroup";

/**
 * handles if a users wants to select / deselect a season
 * @param {*} event the event that triggered a function call
 * @param {*} season the season that has been clicked
 */
const handleChangeSeason = (event, season) => {
}

/**
 * selects / deselects all year
 */
const handleChangeAllYear = () => {

}

/**
 * enables the user to select a month, season or the whole year
 * @param {*} props 
 *  props.defaultTimeSelection -> the default months that should be selected
 * @returns a jsx containing a checkboxgroup per season and a "all year" checkbox
 */
export default function TimeCheckBoxGroup(props) {
    
    props.defaultTimeSelection;
    const [time, setTime] = React.useState(new Array(12).fill(false));

    return (
        <> 
            <SeasonCheckBoxGroup />
        </>
    );
}