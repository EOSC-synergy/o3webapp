import React from "react";
import PropTypes from 'prop-types';

/**
 * enables the user to select a reference model
 * @param {Object} props 
 * @param {function} props.reportError - function to handle errors
 * @returns {JSX} a jsx containing a dropdown to select the reference model from all currently visible models
 */
function ReferenceModelSelector(props) {

    return (
        <>
        ReferenceModelSelector
        </>
    );
}

ReferenceModelSelector.propTypes = {
    reportError: PropTypes.func
}

export default ReferenceModelSelector;