import React from "react";
import { useDispatch } from "react-redux"
import { setLocation } from "../../../../../store/plotSlice/plotSlice";

/**
 * Enables the user to choose minimum and maximum latitude
 * @param {Object} props
 * @param {function} props.reportError - error handling
 * @returns {JSX} a JSX containing a dropdown and if "individual latitude band" is selected a number input field
 */
function LatitudeBandSelector(props) {

    const min = -90;
    const max = +90;
    const predefinedOptions = [
        {
            name: "global",
            min: 90,
            max: -90
        }
    ]

    // const dispatch = useDispatch()
    const [selectedLatitudeBandOption, setselectedLatitudeBandOption] = React.useState();
    let i = props.reportError;

    return (
        <>
        LatitudeBandSelector
        </>
    );
}

export default LatitudeBandSelector;