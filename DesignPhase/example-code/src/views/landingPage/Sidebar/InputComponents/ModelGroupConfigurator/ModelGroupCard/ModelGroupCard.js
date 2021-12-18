import React from "react";
import EditModelGroupModal from "../EditModelGroupModal/EditModelGroupModal";


/**
 * a card containing information about the a modal group
 * @param {*} props 
 *  props.name -> name of the modal group
 *  props.models -> all models in this group
 *  meanVisbile -> whether the mean of this group is currently visible
 *  derivativeVisible -> whether the derivative of this group is currently visible
 *  percentileVisible -> whether the percentile of this group is currently visible
 *  medianVisible -> whether the median of this group is currently visible
 *  hidden -> whether the group is visible at all
 *  props.id -> id of the model group
 * @returns a jsx containing a modal with a data grid with all models from the model group
 */
function ModelGroupCard(props) {
    
    // TODO: Redux
    let i = props.name;
    i = props.models;
    i = props.meanVisible;
    i = props.derivativeVisible;
    i = props.percentileVisible;
    i = props.medianVisible;
    i = props.hidden;
    i = props.error;
    i = props.id;

    i = props.editModelGroup;

    return (
        <>
            <EditModelGroupModal name={props.name} id={props.id} models={props.models} />
        </>
    );
}

export default ModelGroupCard;