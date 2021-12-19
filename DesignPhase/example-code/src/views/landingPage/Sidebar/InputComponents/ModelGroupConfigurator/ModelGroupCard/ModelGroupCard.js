import React from "react";
import EditModelGroupModal from "../EditModelGroupModal/EditModelGroupModal";
import { useDispatch, useSelector } from "react-redux"

/**
 * a card containing information about the a modal group
 * @param {OBject} props 
 * @param {String} props.error - error function
 * @param {int} props.id -> id of the model group
 * @returns {JSX} a jsx containing a modal with a data grid with all models from the model group
 */
function ModelGroupCard(props) {
    
    const modelGroupData = useSelector(state => state.models[props.name])

    let i;
    i = props.error;
    i = props.id;

    return (
        <>
            <EditModelGroupModal name={props.name} id={props.id} models={props.models} />
        </>
    );
}

export default ModelGroupCard;