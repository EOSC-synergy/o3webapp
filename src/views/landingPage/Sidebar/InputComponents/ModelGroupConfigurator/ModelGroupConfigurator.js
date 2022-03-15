import React from "react";
import AddModelGroupModal from "./AddModelGroupModal/AddModelGroupModal";
import ModelGroupCard from "./ModelGroupCard/ModelGroupCard";
import { Button } from '@mui/material';
import { useSelector } from "react-redux"
import PropTypes from 'prop-types';
import { selectAllGroupIds } from "../../../../../store/modelsSlice/modelsSlice";

/**
 * Enables the user to configure models that should be visible in the plot clustered as model groups.
 * Compromised of {@link EditModelGroupModal}, {@link ModelGroupCard} and {@link AddModelGroupModal}.
 * @component
 * @param {Object} props Specified in propTypes
 * @returns {JSX} a jsx containing a ModelGroupModal and a ModelGroupCard and EditModelGroupModal per model group
 */
function ModelGroupConfigurator(props) {

    /**
     * Label that is displayed in the add model group button
     * @constant {String}
     * @default "Add Model Group"
     */
    const addModelGroupButtonLabel = "Add Model Group";

    /**
     * Ids of all existing modelGroups
     * @constant {Array}
     * @see {@link selectAllGroupIds}
     */
    const allGroupIds = useSelector(selectAllGroupIds);


    /**
     * State that tracks whether the addModelGroupModal is visible or not
     * @constant {Array}
     */
    const [isAddModalVisible, setAddModalVisible] = React.useState(false);

    /**
     * Function to close addModelGroupModal
     * @function
     */
    const closeAddModal = () => {
        setAddModalVisible(false);
    }

    /**
     * Function to open addModelGroupModal
     * @function
     */
    const openAddModal = () => {
        setAddModalVisible(true);
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
                onClick={openAddModal}
                data-testid="ModelGroupConfigurator-addModelGroup-button"
            >
                {addModelGroupButtonLabel}
            </Button>
            <AddModelGroupModal isOpen={isAddModalVisible} onClose={closeAddModal} reportError={props.reportError} />
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