import React from "react";
import { Grid, Typography, Slider, MenuItem, TextField } from "@mui/material";
import models from "./models.json";
import { Select, InputLabel, OutlinedInput, FormControl } from "@mui/material";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setModel } from "../../../../../store/referenceSlice/referenceSlice";
import PropTypes from 'prop-types';

/**
 * enables the user to select a reference model
 * @param {Object} props 
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX} a jsx containing a dropdown to select the reference model from all currently visible models
 */
function ReferenceModelSelector(props) {

    const dispatch = useDispatch()

    const selectedModel = useSelector(state => state.reference.settings.model);

    /** Handles the change of the reference model selection if it's is modified.*/
    const handleChangeForRefModel = (event) => {
        dispatch(setModel({model: event.target.value}));
    };

    return (
        <div>
        <FormControl sx={{ m: 1, width: "100%" , size: "small"}}>
        <Select
            labelId="locationSelectLabel"
            id="locationSelect"
            label="Reference Model"
            onChange={handleChangeForRefModel}
            value={selectedModel}
        >
          {models.map((elem) => {return <MenuItem key={elem} value={elem}> {elem} </MenuItem>})}
        </Select>
        <InputLabel id="locationSelectLabel"><Typography>Reference Model</Typography></InputLabel>
        </FormControl>
        </div>
    );
}

ReferenceModelSelector.propTypes = {
    reportError: PropTypes.func
}

export default ReferenceModelSelector;