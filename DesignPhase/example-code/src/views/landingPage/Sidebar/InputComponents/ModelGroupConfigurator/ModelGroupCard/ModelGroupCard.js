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
export default function ModelGroupCard(props) {
    
    // TODO: Redux
    props.name;
    props.models;
    props.meanVisible;
    props.derivativeVisible;
    props.percentileVisible;
    props.medianVisible;
    props.hidden;
    props.error;
    props.id;

    return (
        <>
            <EditModelGroupModal name={props.name} id={props.id} models={props.models} />
        </>
    );
}