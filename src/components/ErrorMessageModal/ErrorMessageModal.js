import React, { useState } from "react";

/**
 * displays an error message
 * @param {Object} props 
 * @param {booelan} props.isOpen -> whether the error message modal should be displayed
 * @param {function} props.onClose -> handles closing of the modal
 * @param {String} props.message -> error message
 * @returns {JSX} a jsx file containing a modal with the given error message
 */
function ErrorMessageModal(props) {
    
    let i = props.isOpen;
    i = props.onClose;
    i = props.message;
    

    return <div>
    </div>;
}

export default ErrorMessageModal;