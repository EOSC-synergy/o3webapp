import React from "react";
import { useDispatch } from "react-redux"
import { setLocation } from "../../../../../store/plotSlice";

const min = -90;
const max = +90;
const availableOptions = [
  {
      name: "global",
      min: 90,
      max: -90
  }
]

/**
 * Enables the user to choose minimum and maximum latitude
 * @param {*} props 
 *  props.defaultLocation -> default Location that should be selected
 *  props.error -> error handling
 * @returns a JSX containing a dropdown and if "individual latitude band" is selected a number input field
 */
export default function LocationSelector(props) {

    const dispatch = useDispatch()
    const [selectedLocations, setSelectedLocations] = React.useState(props.defaultLocation);
    props.error;

    // props.allowMultipleRegions;     // TODO: how to cope with multiple possible regions in return / recovery plot?

    const handleChangeLocation = (event) => {
        setLocation(event.target.value);
        dispatch(setLocation(event.target.value))
    };

    return (
        <>
        </>
    );
}