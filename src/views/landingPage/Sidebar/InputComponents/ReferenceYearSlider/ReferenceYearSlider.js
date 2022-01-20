import React, { useState } from "react";
import { Grid, Typography, Slider, MenuItem } from "@mui/material";
import models from "./models.json";
import { Select, InputLabel, OutlinedInput, FormControl } from "@mui/material";
import PropTypes from 'prop-types'; 

/**
 * enables the user to select a reference year
 * @todo add redux connection: should min and max also be in redux?
 * @param {Object} props
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX} a jsx containing a slider to select the reference year
 */
function ReferenceYearSlider(props) {
  let i = props.reportError;

  /** model: The currently selected reference model.
   * setModel: The function which adjusts the SelectionBar after selecting a model.
   */

  // /** Dispatcher to dispatch the plot name change action. */
  const dispatch = useDispatch();


  /** The current model which is selected. */
  const model = models[1];

  /** Default year value for the Slider.*/
  const defaultYear = 1980;

  /** Minimum chosable year value for the Slider.*/
  const minYear = 1950;

  /** Minimum chosable year value for the Slider.*/
  const maxYear = 2100;

  /** Handles the change of the reference model selection if it's is modified.*/
  const handleChangeForRefModel = (event) => {

    if (event.target.value !== null) {
          return
    } 

    const {
      target: { value },
    } = event;
    setModel(typeof value === "string" ? value.split(",") : value);

    dispatch(setRefModel({title: event.target.value}));
  };

  /** Handles the change of the reference year slider if it's is modified.*/
  const handleChangeForRefYear = (event) => {
    const {
      target: { value },
    } = event;

    // TODO
    //dispatch(setYear({title: event.target.value}));
  };

  return (
    <>
      <FormControl sx={{ m: 1, width: "100%" }}>
        <Select
          labelId="locationSelectLabel"
          id="locationSelect"
          label="Reference Model"
          onChange={handleChangeForRefModel}
          input={<OutlinedInput label="Reference Model" />}
          defaultValue={1}
          value={model}
        >
          {models.map((elem, idx) => {
            return (
              <MenuItem key={idx} value={elem}>
                {elem}
              </MenuItem>
            );
          })}
        </Select>
        <InputLabel id="locationSelectLabel">Reference Model</InputLabel>
      </FormControl>

      <Grid container>
        <Grid item xs={4}>
          <Typography>Reference year:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Slider
            defaultValue={defaultYear}
            step={1}
            min={minYear}
            max={maxYear}
            onChange={handleChangeForRefYear}
            valueLabelDisplay="on"
            size="small"
            track={false}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default ReferenceYearSlider;
