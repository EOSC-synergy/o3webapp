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
    const [addModalVisible, setAddModalVisible] = React.useState(false);
    const [editModalVisible, setEditModalVisible] = React.useState(false);

    function handleEditModalClose() {
        setEditModalVisible(false);
    }

    function handleEditModalOpen() {
        setEditModalVisible(true);
    }

    function handleAddModalClose() {
        setAddModalVisible(false);
    }

    function handleAddModalOpen() {
        setAddModalVisible(true);
    }

    return (
        <>
            <AddModalGroupModal />
            <ModelGroupCard />
            {/* <ModelGroup /> */}
        </>
    );
}