import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { selectCurrentPlotType, setMonths } from "../../../../../store/plotSlice";
import SeasonCheckBoxGroup from "./SeasonCheckboxGroup/SeasonCheckBoxGroup";

/**
 * enables the user to select a month, season or the whole year
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a jsx containing a checkboxgroup per season and a "all year" checkbox
 */
function TimeCheckBoxGroup(props) {
    
    let i = props.reportError;
    const dispatch = useDispatch()

    const sesaons = [
        {
            name: 'Spring',
            months: [3, 4, 5]
        },
        {
            name: 'Summer',
            months: [6, 7, 8]
        },
        {
            name: 'Fall',
            months: [9, 10, 11]
        },
        {
            name: 'Winter',
            months: [12, 1, 2]
        }
    ]

    const currentPlotType = selectCurrentPlotType()
    const monthArray = useSelector(state => state.plot[currentPlotType].months)
    const [time, setTime] = React.useState(monthArray); //new Array(12).fill(true)

    /**
     * handles if a users wants to select / deselect a season
     * @param {event} event the event that triggered a function call
     * @param {int} seasonId the index of the season that has been clicked
     */
    const handleChangeSeason = (event, seasonId) => {
        // do stuff
        handleUpdatedSelection();
    }

    /**
     * selects / deselects all year
     */
    const handleChangeYear = () => {
        // do stuff
        handleUpdatedSelection();
    }

    /**
     * selects / deselects a single month
     * @param {event} event the event that triggered the function call
     * @param {int} month the number representing the month
     */
    const handleChangeMonth = (event, month) => {
        // do stuff
        handleUpdatedSelection();
    }

    /**
     * handles update the time selection by pushing the new value to the redux store
     */
    const handleUpdatedSelection = () => {
        // do stuff
        dispatch(setMonths(time))
    }

    return (
        <> 
            {sesaons.forEach((elem, idx) => {
                <SeasonCheckBoxGroup
                    name={elem.name}
                    months={elem.months}
                    monthsSelected = {
                        time.map((x, idx) => idx in elem.months ? x : null)
                    }
                    key={idx}
                />
            })}
        </>
    );
}

export default TimeCheckBoxGroup;