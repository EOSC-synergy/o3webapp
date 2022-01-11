import React from "react";
import EditModelGroupModal from "../EditModelGroupModal/EditModelGroupModal";
import { useDispatch, useSelector } from "react-redux"

/**
 * a card containing information about the a modal group
 * @param {OBject} props 
 * @param {String} props.reportError - error function
 * @param {int} props.modelGroupId -> id of the model group
 * @returns {JSX} a jsx containing a modal with a data grid with all models from the model group
 */
function ModelGroupCard(props) {
    
    // const modelGroupData = useSelector(state => state.models[props.name])

    let i;
    i = props.reportError;
    i = props.modelGroupId;

    return (
        <>
            <EditModelGroupModal id={props.modelGroupId} />
        </>
    );
}

export default ModelGroupCard;