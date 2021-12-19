import React from "react";
import AddModelGroupModal from "./AddModelGroupModal/AddModelGroupModal";
import ModelGroupCard from "./ModelGroupCard/ModelGroupCard";
import { useDispatch } from "react-redux"
import { updatedModelGroup, addedModelGroup } from "../../../../../store/modelsSlice";

/**
 * enables the user to configure models that should be visible in the plot clustered as model groups
 * @param {*} props 
 * @returns a jsx containing a ModelGroupModal and a ModelGroupCard and EditModelGroupModal per model group
 */
export default function ModelGroupConfigurator(props) {
    
    const dispatch = useDispatch()
    
    const [modelGroups, setModelGroups] = React.useState([]);
    // modelGroups = [
    //     {
    //         name: "Somehting",
    //         models: [
    //             {
    //                 name: "Something 2",
    //                 institute: "Something elese"
    //                 dataset: "more something"
    //                 mean: true,
    //                 derivative: true,
    //                 median: true,
    //                 percentile: true,
    //                 color: "XXX",
    //                 plotStyle: "XXX",

    //             }
    //         ],
    //         hidden: false,
    //         derivativeVisible: false,
    //         meanVisible: false,
    //         medianVisible: false,
    //         percentileVisible: false
    //     }
    // ]

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

    props.error;


    return (
        <>
            <AddModelGroupModal error={error} />
            <ModelGroupCard error={error} />
            {/* <ModelGroup /> */}
        </>
    );
}