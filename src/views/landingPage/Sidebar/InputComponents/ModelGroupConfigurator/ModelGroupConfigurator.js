import React from "react";
import AddModelGroupModal from "./AddModelGroupModal/AddModelGroupModal";
import ModelGroupCard from "./ModelGroupCard/ModelGroupCard";
import { Button } from '@mui/material';
import { useSelector } from "react-redux"
import PropTypes from 'prop-types';
import { selectAllGroupIds } from "../../../../../store/modelsSlice/modelsSlice";

/**
 * enables the user to configure models that should be visible in the plot clustered as model groups
 * @component
 * @param {Object} props 
 * @param {function} props.reportError - function to report errors
 * @returns {JSX} a jsx containing a ModelGroupModal and a ModelGroupCard and EditModelGroupModal per model group
 */
function ModelGroupConfigurator(props) {

    const allGroupIds = useSelector(selectAllGroupIds);


    const [isAddModalVisible, setAddModalVisible] = React.useState(false);

    const closeAddModal = () => {
        setAddModalVisible(false);
    }

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
                Add Model Group
            </Button>
            <AddModelGroupModal 
                isOpen={isAddModalVisible} 
                onClose={closeAddModal} 
                reportError={props.reportError} 
                setOpen={(openAddModal)}
            />
        </>
    );
}

ModelGroupConfigurator.propTypes = {
    reportError: PropTypes.func
}

export default ModelGroupConfigurator;