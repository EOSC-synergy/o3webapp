import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux"
// import { selectCurrentPlotType, setMonths } from "../../../../../store/plotSlice";
import SeasonCheckBoxGroup from "./SeasonCheckboxGroup/SeasonCheckBoxGroup";
import { seasons } from "../../../../../utils/constants";
import {Box, Checkbox, Divider, FormControlLabel, Grid} from "@mui/material";
import { Winter, Spring, Summer, Autumn } from "../../../../../utils/constants";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

/**
 * enables the user to select a month, season or the whole year
 * @param {Object} props
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a jsx containing a checkboxgroup per season and a "all year" checkbox
 */
function TimeCheckBoxGroup(props) {
    
    let i = props.reportError;
    // const dispatch = useDispatch()

    // const currentPlotType = selectCurrentPlotType()
    const monthArray = []; //useSelector(state => state.settings["OCTS"].months);


    /**
     * handles update the time selection by pushing the new value to the redux store
     */
    const handleUpdatedSelection = () => {
        // do stuff
        // dispatch(setMonths(months))
    }

    /**
     * selects / deselects all year
     */
    const handleChangeYear = () => {
        // do stuff
        handleUpdatedSelection();
    }

    const handleSeasonChecked = (seasonId) => {
        // Dispatch season checked;
    }

    const handleMonthChecked = (monthId) => {
        if (monthArray.includes(monthId)) {
            monthArray.filter((m) => m !== monthId);
        } else {
            monthArray.push(monthId);
        }
        // Dispatch month checked
    }

    const Season = ({name, months, seasonId}) => {

        let a = []
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
                        control={<Checkbox />}
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