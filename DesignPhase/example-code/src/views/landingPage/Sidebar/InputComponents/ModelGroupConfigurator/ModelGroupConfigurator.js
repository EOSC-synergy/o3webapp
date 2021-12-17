import React from "react";
import AddModalGroupModal from "./AddModelGroupModal/AddModelGroupModal";
import EditModelGroupModal from "./EditModelGroupModal/EditModelGroupModal";

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
            <EditModelGroupModal />
            <ModelGroup />
        </>
    );
}