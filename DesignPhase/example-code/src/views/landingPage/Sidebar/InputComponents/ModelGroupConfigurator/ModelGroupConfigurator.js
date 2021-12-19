import React from "react";
import AddModelGroupModal from "./AddModelGroupModal/AddModelGroupModal";
import ModelGroupCard from "./ModelGroupCard/ModelGroupCard";
import { useDispatch } from "react-redux"
import { updatedModelGroup, addedModelGroup } from "../../../../../store/modelsSlice";

/**
 * enables the user to configure models that should be visible in the plot clustered as model groups
 * @param {Object} props 
 * @param {function} props.reportError - function to report errors
 * @returns {JSX} a jsx containing a ModelGroupModal and a ModelGroupCard and EditModelGroupModal per model group
 */
function ModelGroupConfigurator(props) {
    
    const dispatch = useDispatch()
    
    const [modelGroups, setModelGroups] = React.useState([]);

    const addModelGroup = (name, models) => {
        dispatch(addedModelGroup({name, models}))   
    }

    const editModelGroup = 
        (
            id,
            name,
            models,
            hidden,
            derivativeVisible,
            meanVisbile,
            medianVisible,
            percentileVisible
        ) => {
        // id = index of model group in array above
        dispatch(updatedModelGroup({
            id,
            name,
            models,
            hidden,
            derivativeVisible,
            meanVisbile,
            medianVisible,
            percentileVisible
        }))
    }


    const [addModalVisible, setAddModalVisible] = React.useState(false);
    const [editModalVisible, setEditModalVisible] = React.useState(false);

    const handleEditModalClose = () => {
        setEditModalVisible(false);
    }

    const handleEditModalOpen = () => {
        setEditModalVisible(true);
    }

    const handleAddModalClose = () => {
        setAddModalVisible(false);
    }

    const handleAddModalOpen = () => {
        setAddModalVisible(true);
    }

    let i = props.reportError;


    return (
        <>
            <AddModelGroupModal error={props.reportError} />
            <ModelGroupCard error={props.reportError} />
            {/* <ModelGroup /> */}
        </>
    );
}

export default ModelGroupConfigurator;