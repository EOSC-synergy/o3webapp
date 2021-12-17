import React, { useState } from "react";

/**
 * opens a modal where the user can edit an existing model group
 * @param {*} props 
 *  props.close() -> function to call if modal should be closed
 *  props.open -> boolean whether the modal should be visible 
 * @returns a jsx containing a modal with a data grid with all models from the model group
 */
export default function EditModelGroupModal(props) {
    props.close();
    return (
        <>
        </>
    );
}