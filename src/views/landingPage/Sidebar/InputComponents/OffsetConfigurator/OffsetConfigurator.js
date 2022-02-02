import React from "react";
import PropTypes from 'prop-types';
import ReferenceYearSlider from "../ReferenceYearSlider/ReferenceYearSlider";


/**
 * enables the user to select a referenceYear, referenceModel and to toggle an offset according to those two inputs
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a jsx containing a referenceYearSlider, a referenceModelSelector and a button to toggle the offset
 */
function OffsetConfigurator(props) {

    // handle changes: dispatch actions accordingly

    return (
        <>  
            OffsetConfigurator
            <ReferenceYearSlider />
            <button />
        </>
    );
}

OffsetConfigurator.propTypes = {
    reportError: PropTypes.func
}

export default OffsetConfigurator;