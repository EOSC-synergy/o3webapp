import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';
import PropTypes from "prop-types";

/**
 * Opens a non-closable discard changes modal to ask whether the users want to discard their changes
 * @component
 * @param {Object} props 
 * @param {Boolean} props.isOpen whether the dialog modal should be opened or not
 * @param {Function} props.saveChanges function to save changes
 * @param {Function} props.discardChanges function to discard changes
 * @param {Function} props.onClose function to close the dialog, called after saveChanges or discardChanges
 * @returns {JSX.Element} containing a Dialog that asks the user whether to save or discard changes
 * can only be closed via clicking save or discard changes button
 */
function DiscardChangesModal(props) {

   const discardChangesAndCloseDialog = () => {
       props.discardChanges();
       props.onClose();
   }

   const saveChangesAndCloseDialog = () => {
       props.saveChanges();
       props.onClose();
   }

  return (
    <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-testid="discardChanges-dialog"
    >
    <DialogContent>
        <Alert severity="warning" variant="standard" id="alert-dialog-description">
            <AlertTitle id="alert-dialog-title">Discard Changes</AlertTitle>
            Are you sure you want to discard all changes?
        </Alert>
    </DialogContent>
    <DialogActions>
        <Button onClick={discardChangesAndCloseDialog} data-testid="discardChanges-discardButton">Discard Changes</Button>
        <Button onClick={saveChangesAndCloseDialog} data-testid="discardChanges-saveButton" autoFocus>
            Save Changes
        </Button>
    </DialogActions>
    </Dialog>
  );
}

DiscardChangesModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    saveChanges: PropTypes.func.isRequired,
    discardChanges: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
}

export default DiscardChangesModal;