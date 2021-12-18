import React, { useState } from "react";

function getAllAvailableModels() {
    return null;
}

/**
 * opens a modal where the user can add a new model group
 * @param {*} props 
 *  props.onClose -> function to call if modal should be closed
 *  props.open -> boolean whether the modal should be visible
 *  props.error -> error handling
 *  props.addModaelGroup -> function to add a model group
 * @returns a jsx containing a modal with a transfer list with all available models
 */
export default function AddModelGroupModal(props) {

    props.onClose;
    props.error;
    props.addModelGroup;

    return (
        <>
            {props.open && <></>}
        </>
    );
}