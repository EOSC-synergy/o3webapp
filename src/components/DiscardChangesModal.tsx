import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import { Card, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import CardHeader from '@mui/material/CardHeader';
import CloseIcon from '@mui/icons-material/Close';

type DiscardChangesModalProps = {
    isOpen: boolean;
    saveChanges: () => void;
    discardChanges: () => void;
    onClose: () => void;
    closeDialog: () => void;
};
/**
 * Opens a non-closable discard changes modal to ask whether the users want to discard their changes
 *
 * @param isOpen Whether the dialog modal should be opened or not
 * @param saveChanges Function to save changes
 * @param discardChanges Function to discard changes
 * @param onClose Function to close the dialog, called after saveChanges or discardChanges
 * @param closeDialog
 * @returns Containing a Dialog that asks the user whether to save or discard changes can only be
 *   closed via clicking save or discard changes button
 * @component
 */
const DiscardChangesModal: React.FC<DiscardChangesModalProps> = ({
    isOpen,
    saveChanges,
    discardChanges,
    onClose,
    closeDialog,
}) => {
    /**
     * A function to discard changes and close the modal.
     *
     * @function
     */
    const discardChangesAndCloseDialog = () => {
        discardChanges();
        closeDialog();
    };

    /**
     * A function to save changes and close the modal.
     *
     * @function
     */
    const saveChangesAndCloseDialog = () => {
        closeDialog();
        saveChanges();
    };

    /**
     * Title of the dialog
     *
     * @constant {string}
     */
    const heading = 'Discard Changes';

    /**
     * Question string that is displayed to the user, if the Modal is shown.
     *
     * @constant {string}
     */
    const dialog = 'Are you sure you want to discard all changes?';

    /**
     * Label for the discard changes button.
     *
     * @constant {string}
     */
    const discardButtonLabel = 'Discard Changes';

    /**
     * Label for the save changes button.
     *
     * @constant {string}
     */
    const saveButtonLabel = 'Save Changes';

    return (
        <Dialog
            open={isOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            data-testid="discardChanges-dialog"
        >
            <Card sx={{ backgroundColor: 'theme.palette.background.default' }}>
                <CardHeader
                    title={heading}
                    action={
                        <IconButton
                            onClick={onClose}
                            aria-label="close"
                            data-testid="DiscardChangedModal-close-modal"
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                />
                <DialogContent>
                    <Alert severity="warning" variant="standard" id="alert-dialog-description">
                        {dialog}
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={discardChangesAndCloseDialog}
                        data-testid="discardChanges-discardButton"
                    >
                        {discardButtonLabel}
                    </Button>
                    <Button
                        onClick={saveChangesAndCloseDialog}
                        data-testid="discardChanges-saveButton"
                        autoFocus
                    >
                        {saveButtonLabel}
                    </Button>
                </DialogActions>
            </Card>
        </Dialog>
    );
};

DiscardChangesModal.propTypes = {
    /** Tracks whether the dialog modal should be opened or not */
    isOpen: PropTypes.bool.isRequired,
    /** A function to save changes */
    saveChanges: PropTypes.func.isRequired,
    discardChanges: PropTypes.func.isRequired,
    /** A function to discard changes */
    onClose: PropTypes.func.isRequired,
    /** A function to close the dialog, called after saveChanges or discardChanges */
    closeDialog: PropTypes.func.isRequired,
};

export default DiscardChangesModal;
