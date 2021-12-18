import React from "react";
import AddModalGroupModal from "./AddModelGroupModal/AddModelGroupModal";
import ModelGroupCard from "./ModelGroupCard/ModelGroupCard";

/**
 * enables the user to configure models that should be visible in the plot clustered as model groups
 * @param {*} props 
 * @returns a jsx containing a ModelGroupModal and a ModelGroupCard and EditModelGroupModal per model group
 */
export default function ModelGroupConfigurator(props) {
    
    const [modelGroups, setModelGroups] = React.useState([]);
    // modelGroups = [
    //     {
    //         name: "Somehting",
    //         models: [
    //             {
    //                 name: "Something 2",
    //                 mean: true,
    //                 derivative: true,
    //                 median: true,
    //                 percentile: true,
    //                 color: "XXX",
    //                 plotStyle: "XXX",

    //             }
    //         ],
    //         hidde: false,
    //         derivativeVisible: false,
    //         meanVisible: false,
    //         medianVisible: false,
    //         percentileVisible: false
    //     }
    // ]
    const [addModalVisible, setAddModalVisible] = React.useState(false);
    const [editModalVisible, setEditModalVisible] = React.useState(false);
    props.error;

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

    const addModelGroup = (name, models) => {

    }

    const editModelGroup = (id, name, models) => {
        // id = index of model group in array above
    }


    return (
        <>
            <AddModalGroupModal error={error} />
            <ModelGroupCard error={error} />
            {/* <ModelGroup /> */}
        </>
    );
}