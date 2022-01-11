import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux"
// import { selectCurrentPlotType, setMonths } from "../../../../../store/plotSlice";
import SeasonCheckBoxGroup from "./SeasonCheckboxGroup/SeasonCheckBoxGroup";
import { seasons } from "../../../../../utils/constants";
import {Box, Checkbox, Divider, FormControlLabel, Grid} from "@mui/material";
import { Winter, Spring, Summer, Autumn } from "../../../../../utils/constants";
import Typography from "@mui/material/Typography";

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
    // const monthArray = useSelector(state => state.plot[currentPlotType].months)


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

    const Season = ({name, months, key}) => (
        <Grid item xs={6}>
            <SeasonCheckBoxGroup
                label = {name.description}
                months = {months}
                key={key}
            />
        </Grid>
    );

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