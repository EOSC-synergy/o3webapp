import React from "react";
import AddModelGroupModal from "./AddModelGroupModal/AddModelGroupModal";
import ModelGroupCard from "./ModelGroupCard/ModelGroupCard";
import { Button } from '@mui/material';
import { useDispatch, useSelector } from "react-redux"
import { updatedModelGroup, addedModelGroup, selectAllGroupIds } from "../../../../../store/modelsSlice/modelsSlice";

/**
 * enables the user to configure models that should be visible in the plot clustered as model groups
 * @param {Object} props 
 * @param {function} props.reportError - function to report errors
 * @returns {JSX} a jsx containing a ModelGroupModal and a ModelGroupCard and EditModelGroupModal per model group
 */
function ModelGroupConfigurator(props) {
    
    // const dispatch = useDispatch()

    const addModelGroup = (name, models) => {
        // dispatch(addedModelGroup({name, models}))   
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
        // dispatch(updatedModelGroup({
        //     id,
        //     name,
        //     models,
        //     hidden,
        //     derivativeVisible,
        //     meanVisbile,
        //     medianVisible,
        //     percentileVisible
        // }))
    }

    const allGroupIds = useSelector(selectAllGroupIds);
    console.log(allGroupIds);


    const [isAddModalVisible, setAddModalVisible] = React.useState(false);

    const closeAddModal = () => {
        setAddModalVisible(false);
    }

    const openAddModal = () => {
        setAddModalVisible(true);
    }

    let i = props.reportError;


    return (
        <>
            {
                allGroupIds.map((id, idx) => {
                    return (<ModelGroupCard key={idx} modelGroupId={id} reportError={props.reportError} />);
                })
            }
            <Button varian="outlined" onClick={openAddModal}>Open Add Model Group Modal (Dev)</Button>
            <AddModelGroupModal isOpen={isAddModalVisible} onClose={closeAddModal} reportError={props.reportError} />
            {/* <ModelGroup /> */}
        </>
    );
}

export default ModelGroupConfigurator;