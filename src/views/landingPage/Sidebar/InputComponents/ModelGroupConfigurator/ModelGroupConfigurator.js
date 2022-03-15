import React from "react";
import AddModelGroupModal from "./AddModelGroupModal/AddModelGroupModal";
import ModelGroupCard from "./ModelGroupCard/ModelGroupCard";
import { Button } from '@mui/material';
import { useSelector } from "react-redux"
import PropTypes from 'prop-types';
import { selectAllGroupIds } from "../../../../../store/modelsSlice/modelsSlice";

/**
 * enables the user to configure models that should be visible in the plot clustered as model groups
 * compromised of {@link EditModelGroupModal} {@link ModelGroupCard} and {@link AddModelGroupModal}.
 * @component
 * @param {Object} props Specified in propTypes
 * @returns {JSX} a jsx containing a ModelGroupModal and a ModelGroupCard and EditModelGroupModal per model group
 */
function ModelGroupConfigurator(props) {

    /**
     * Label that is displayed in the add model group button
     * @constant {string}
     */
    const addModelGroupButtonLabel = "Add Model Group";

    /**
     * Ids of all existing modelGroups
     * @constant {array}
     */
    const allGroupIds = useSelector(selectAllGroupIds);


    /**
     * State that tracks whether the addModelGroupModal is visible or not
     * @constant {array}
     */
    const [isAddModalVisible, setAddModalVisible] = React.useState(false);
    const [refreshState, setRefreshState] = React.useState(true);

    /**
     * Function to close addModelGroupModal
     * @constant {function}
     */
    const closeAddModal = () => {
        setAddModalVisible(false);
    }

    /**
     * Function to open addModelGroupModal
     * @constant {function}
     */
    const openAddModal = (refresh) => {
        setAddModalVisible(true);
        setRefreshState(refresh);
    }

    return (
        <>
            {
                allGroupIds.map((id, idx) => {
                    return (<ModelGroupCard key={idx} modelGroupId={id} reportError={props.reportError} />);
                })
            }
            <Button
                sx={{width: "100%"}}
                variant="contained"
                onClick={() => openAddModal(true)}
                data-testid="ModelGroupConfigurator-addModelGroup-button"
            >
                {addModelGroupButtonLabel}
            </Button>
            <AddModelGroupModal 
                isOpen={isAddModalVisible} 
                onClose={closeAddModal} 
                reportError={props.reportError} 
                setOpen={openAddModal}
                refresh={refreshState}
            />
        </>
    );
}

ModelGroupConfigurator.propTypes = {
    /**
     * function to report errors
     */
    reportError: PropTypes.func
}

export default ModelGroupConfigurator;