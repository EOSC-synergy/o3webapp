import React, { useState } from "react";

/**
 * opens a modal where the user can edit an existing model group
 * @param {*} props 
 *  props.onClose -> function to call if modal should be closed
 *  props.open -> boolean whether the modal should be visible 
 *  props.error -> error function
 *  props.models -> models in this model group (also whether they are incoorperated into the mean/median/derivative calculation)
 *  props.name -> name of the model group
 *  props.id -> id of the model group
 * @returns a jsx containing a modal with a data grid with all models from the model group
 */
export default function EditModelGroupModal(props) {

    props.onClose;
    props.open;
    props.error;
    props.models;
    props.name;
    props.id;

    return (
        <>
        </>
    );
}