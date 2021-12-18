import React from "react";
import AddModelGroupModal from "./AddModelGroupModal/AddModelGroupModal";
import ModelGroupCard from "./ModelGroupCard/ModelGroupCard";

/**
 * enables the user to configure models that should be visible in the plot clustered as model groups
 * @param {Object} props 
 * @returns a jsx containing a ModelGroupModal and a ModelGroupCard and EditModelGroupModal per model group
 */
function ModelGroupConfigurator(props) {
    
    // TODO: redux
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

    // TODO: Redux
    const addModelGroup = (name, models) => {

    }

    // TODO: Redux
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

    let i = props.error;


    return (
        <>
            <AddModelGroupModal error={props.error} />
            <ModelGroupCard error={props.error} />
            {/* <ModelGroup /> */}
        </>
    );
}

export default ModelGroupConfigurator;