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
 * @param {Object} props specified in propTypes
 * @returns {JSX.Element} containing a Dialog that asks the user whether to save or discard changes
 * can only be closed via clicking save or discard changes button
 */
function DiscardChangesModal(props) {

    /**
     * function to discard changes and close the modal
     * @constant {function}
     */
   const discardChangesAndCloseDialog = () => {
       props.discardChanges();
       props.onClose();
   }

    /**
     * function to save changes and close the modal
     * @constant {function}
     */
   const saveChangesAndCloseDialog = () => {
       props.saveChanges();
       props.onClose();
   }

   /**
    * title of the dialog
    * @constant {string}
    */
   const heading = "Discard Changes";

   /**
    * question that is asked to the user
    * @constant {string}
    */
   const dialog = "Are you sure you want to discard all changes?";

    /**
    * Label for the discard changes button
    * @constant {string}
    */
   const discardButtonLabel = "Discard Changes";

    /**
    * Label for the save changes button
    * @constant {string}
    */
   const saveButtonLabel = "Save Changes";

  return (
    <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        data-testid="discardChanges-dialog"
    >
    <DialogContent>
        <Alert severity="warning" variant="standard" id="alert-dialog-description">
            <AlertTitle id="alert-dialog-title">{heading}</AlertTitle>
            {dialog}
        </Alert>
    </DialogContent>
    <DialogActions>
        <Button onClick={discardChangesAndCloseDialog} data-testid="discardChanges-discardButton">
            {discardButtonLabel}
        </Button>
        <Button onClick={saveChangesAndCloseDialog} data-testid="discardChanges-saveButton" autoFocus>
            
        </Button>
    </DialogActions>
    </Dialog>
  );
}

DiscardChangesModal.propTypes = {
    /**
     * whether the dialog modal should be opened or not
     */
    isOpen: PropTypes.bool.isRequired,
    /**
     * function to save changes
     */
    saveChanges: PropTypes.func.isRequired,
    /**
     * function to discard changes
     */
    discardChanges: PropTypes.func.isRequired,
    /**
     * function to close the dialog, called after saveChanges or discardChanges
     */
    onClose: PropTypes.func.isRequired
}

export default DiscardChangesModal;