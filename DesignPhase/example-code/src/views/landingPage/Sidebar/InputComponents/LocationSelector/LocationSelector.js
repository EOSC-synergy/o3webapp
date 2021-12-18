import React from "react";

// const min = -90;
// const max = +90;
// const availableOptions = [
//   ...  
// ]

/**
 * Enables the user to choose minimum and maximum latitude
 * @param {*} props 
 *  props.defaultLocation -> default Location that should be selected
 *  props.error -> error handling
 * @returns a JSX containing a dropdown and if "individual latitude band" is selected a number input field
 */
export default function LocationSelector(props) {

    const [selectedLocations, setSelectedLocations] = React.useState(props.defaultLocation);
    props.error;

    const handleChangeLocation = (event) => {
        setLocation(event.target.value);
    };

    return (
        <>
        </>
    );
}