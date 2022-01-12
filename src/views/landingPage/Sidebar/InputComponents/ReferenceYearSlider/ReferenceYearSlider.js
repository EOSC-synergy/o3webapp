import React, { useState } from "react";
import { Grid, Typography, Slider, MenuItem } from '@mui/material';
import models from './models.json';
import { Select, InputLabel,OutlinedInput, FormControl } from '@mui/material';

/**
 * enables the user to select a reference year
 * @todo add redux connection: should min and max also be in redux?
 * @param {Object} props 
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX} a jsx containing a slider to select the reference year
 */
function ReferenceYearSlider(props) {

    let i = props.reportError;

        const [model, setModel] = React.useState([]);
      
        const handleChange = (event) => {
          const {
            target: { value },
          } = event;
          setModel(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
        };
    
    return (
        <>
         <FormControl sx={{ m: 1, width: '100%' }}>
                <Select
                    labelId="locationSelectLabel"
                    id="locationSelect"
                    label="Reference Model"
                    onChange={handleChange}
                    input={<OutlinedInput label="Reference Model" />}
                    defaultValue={1}
                    value={model}
                >
                    {models.map((elem, idx) => {
                        return (
                            <MenuItem key={idx} value={elem}>
                                {elem}
                            </MenuItem>
                        )
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
                        defaultValue={1980}
                        step={1}
                        min={1950}
                        max={2100}
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