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
     * A function to discard changes and close the modal.
     * @function
     */
   const discardChangesAndCloseDialog = () => {
       props.discardChanges();
       props.onClose();
   }

    /**
     * A function to save changes and close the modal.
     * @function
     */
   const saveChangesAndCloseDialog = () => {
       props.saveChanges();
       props.onClose();
   }

   /**
    * Title of the dialog
    * @constant {string}
    */
   const heading = "Discard Changes";

   /**
    * Question string that is displayed to the user, if the Modal is shown.
    * @constant {string}
    */
   const dialog = "Are you sure you want to discard all changes?";

    /**
    * Label for the discard changes button.
    * @constant {string}
    */
   const discardButtonLabel = "Discard Changes";

    /**
    * Label for the save changes button.
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
     * Tracks whether the dialog modal should be opened or not
     */
    isOpen: PropTypes.bool.isRequired,
    /**
     * A function to save changes
     */
    saveChanges: PropTypes.func.isRequired,
    /**
     * A function to discard changes
     */
    discardChanges: PropTypes.func.isRequired,
    /**
     * A function to close the dialog, called after saveChanges or discardChanges
     */
    onClose: PropTypes.func.isRequired
}

export default DiscardChangesModal;