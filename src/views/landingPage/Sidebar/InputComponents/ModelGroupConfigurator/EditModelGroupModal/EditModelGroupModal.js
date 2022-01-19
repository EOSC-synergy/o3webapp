import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { updatedModelGroup } from "../../../../../../store/modelsSlice/modelsSlice"

/**
 * opens a modal where the user can edit an existing model group
 * @param {Object} props 
 * @param {function} props.onClose -> function to call if modal should be closed
 * @param {boolean} props.isOpen -> boolean whether the modal should be visible 
 * @param {function} props.reportError -> error function
 * @param {int} props.modelGroupId -> id of the model group
 * @returns a jsx containing a modal with a data grid with all models from the model group
 */
function EditModelGroupModal(props) {

    // const dispatch = useDispatch()

    let i = props.onClose;
    i = props.isOpen;
    i = props.reportError;
    i = props.modelGroupId;

    // dispatch(updatedModelGroup(someData))

    return (
        <>
        EditModelGroupModal
        </>
    );
}

export default EditModelGroupModal;