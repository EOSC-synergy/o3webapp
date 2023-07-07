import React, { FC } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import { Card, IconButton } from '@mui/material';
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
const DiscardChangesModal: FC<DiscardChangesModalProps> = ({
    isOpen,
    saveChanges,
    discardChanges,
    onClose,
    closeDialog,
}) => {
    const discardChangesAndCloseDialog = () => {
        discardChanges();
        closeDialog();
    };

    const saveChangesAndCloseDialog = () => {
        closeDialog();
        saveChanges();
    };

    const dialogTitle = 'Discard Changes';
    const dialogContent = 'Are you sure you want to discard all changes?';
    const discardButtonLabel = 'Discard Changes';
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
                    title={dialogTitle}
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
                        {dialogContent}
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

export default DiscardChangesModal;
