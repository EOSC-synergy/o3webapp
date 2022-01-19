import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux"
// import { selectCurrentPlotType, setMonths } from "../../../../../store/plotSlice";
import SeasonCheckBoxGroup from "./SeasonCheckboxGroup/SeasonCheckBoxGroup";
import { seasons } from "../../../../../utils/constants";
import {Box, Checkbox, Divider, FormControlLabel, Grid} from "@mui/material";
import { Winter, Spring, Summer, Autumn, NUM_MONTHS_IN_SEASON, NUM_MONTHS } from "../../../../../utils/constants";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { selectPlotMonths, setMonths } from "../../../../../store/plotSlice/plotSlice";

/**
 * enables the user to select a month, season or the whole year
 * @param {Object} props
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a jsx containing a checkboxgroup per season and a "all year" checkbox
 */
function TimeCheckBoxGroup(props) {
    
    const dispatch = useDispatch()

    /** Array of Months */
    const monthArray = useSelector(selectPlotMonths);

    const isEveryMonthChecked = () => {
        let isChecked = true;
        for (let i = 0; i < NUM_MONTHS; i++) {
            if(!monthArray.includes(i + 1)) {
                isChecked = false;
            }
        }
        return isChecked;
    }

    const isIndeterminate = () => {
        let indetCount = 0;
        for (let i = 0; i < NUM_MONTHS; i++) {
            if(!monthArray.includes(i + 1)) {
                indetCount++;
            }
        }
        return 0 < indetCount && indetCount < NUM_MONTHS;
    }

    /**
     * selects / deselects all year
     */
    const handleYearChecked = () => {
        let shouldBeSelected = true;
        for (let i = 0; i < NUM_MONTHS; i++) {
            if (!monthArray.includes(i + 1)) shouldBeSelected = false;
        }
        const monthCpy = [];
        if (!shouldBeSelected) {
            for (let i = 0; i < NUM_MONTHS; i++) {
                monthCpy.push(i + 1);
            }
        }

        
        dispatch(setMonths({ months: monthCpy.sort((a, b) => a - b)}));
    }

    const handleSeasonChecked = (seasonId) => {
        // Dispatch season checked;
        let monthCpy = [...monthArray];
        const monthsInSeason = [];
        let shouldBeSelected = false;

        for(let i = 0; i < NUM_MONTHS_IN_SEASON; i++) {
            const currMonthInSeason = (seasonId * NUM_MONTHS_IN_SEASON + 1) + i
            monthsInSeason.push(currMonthInSeason);

            if(shouldBeSelected) continue;
            shouldBeSelected = !monthCpy.includes(currMonthInSeason)
        }

        if(shouldBeSelected) {
            for (let i = 0; i < NUM_MONTHS_IN_SEASON; i++) {
                if (!monthCpy.includes(monthsInSeason[i])) {
                    monthCpy.push(monthsInSeason[i]);
                }
            }
        } else {
            
            monthCpy = monthCpy.filter((m) => !monthsInSeason.includes(m));
            
        }

        dispatch(setMonths({ months: monthCpy.sort((a, b) => a - b)}));
    }

    const handleMonthChecked = (monthId) => {
        let monthCpy = [...monthArray]
        if (monthCpy.includes(monthId)) {
            monthCpy = monthCpy.filter((m) => m !== monthId);
        } else {
            monthCpy.push(monthId);
        }
        // Dispatch month checked
        dispatch(setMonths({ months: monthCpy.sort((a, b) => a - b)}));
    }

    const isAllChecked = (prev, curr) => {
        return prev + curr;
    }

    const Season = ({name, months, seasonId}) => {
        const a = []
        for (let i = 0; i < months.length; i++) {
            a.push({monthId: months[i], checked: monthArray.includes(months[i])})
        }
        

        return (<Grid item xs={6}>
            <SeasonCheckBoxGroup
                label = {name.description}
                months = {a}
                seasonId= {seasonId}
                handleSeasonClicked = {handleSeasonChecked}
                handleMonthClicked = {handleMonthChecked}
            />
        </Grid>);
    }

    return (
        <>
            <Typography>
                <Divider>TIME</Divider>
                <Box sx={{paddingLeft: '8%', paddingRight: '8%', alignItems: "center", display: "flex", flexDirection: "column"}}>
                    <FormControlLabel
                        label="All year"
                        control={<Checkbox onClick={handleYearChecked} checked={isEveryMonthChecked()} indeterminate={isIndeterminate()}/>}
                    />
                    <Grid container>
                        <Grid item container>
                            {Season(Winter)}
                            {Season(Spring)}
                        </Grid>
                        <Grid item container>
                            {Season(Summer)}
                            {Season(Autumn)}
                        </Grid>
                    </Grid>
                </Box>
            </Typography>
        </>
    );
}

export default TimeCheckBoxGroup;