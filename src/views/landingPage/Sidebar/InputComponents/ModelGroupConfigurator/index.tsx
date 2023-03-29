import React, { type FC, useState } from 'react';
import AddModelGroupModal from './AddModelGroupModal';
import ModelGroupCard from './ModelGroupCard';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAllGroupIds } from 'store/modelsSlice';
import { type ErrorReporter } from 'utils/reportError';

type ModelGroupConfiguratorProps = {
    reportError: ErrorReporter;
};
/**
 * Enables the user to configure models that should be visible in the plot clustered as model
 * groups. Compromised of {@link EditModelGroupModal}, {@link ModelGroupCard} and
 * {@link AddModelGroupModal}.
 */
const ModelGroupConfigurator: FC<ModelGroupConfiguratorProps> = ({ reportError }) => {
    /**
     * Label that is displayed in the add model group button
     *
     * @constant {String}
     * @default 'Add Model Group'
     */
    const addModelGroupButtonLabel = 'Add Model Group';

    /**
     * Ids of all existing modelGroups
     *
     * @constant {Array}
     * @see {@link selectAllGroupIds}
     */
    const allGroupIds = useSelector(selectAllGroupIds);

    /**
     * State that tracks whether the addModelGroupModal is visible or not
     *
     * @constant {Array}
     */
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [refreshState, setRefreshState] = useState(true);

    /**
     * Function to close addModelGroupModal
     *
     * @function
     */
    const closeAddModal = () => {
        setAddModalVisible(false);
    };

    /**
     * Function to open addModelGroupModal
     *
     * @function
     */
    const openAddModal = (refresh: boolean) => {
        setAddModalVisible(true);
        setRefreshState(refresh);
    };

    return (
        <>
            {allGroupIds.map((id, idx) => {
                return <ModelGroupCard key={idx} modelGroupId={id} reportError={reportError} />;
            })}
            <Button
                sx={{ width: '100%' }}
                variant="contained"
                onClick={() => openAddModal(true)}
                data-testid="ModelGroupConfigurator-addModelGroup-button"
            >
                {addModelGroupButtonLabel}
            </Button>
            <AddModelGroupModal
                isOpen={isAddModalVisible}
                onClose={closeAddModal}
                setOpen={openAddModal}
                refresh={refreshState}
                reportError={reportError}
            />
        </>
    );
};

export default ModelGroupConfigurator;
