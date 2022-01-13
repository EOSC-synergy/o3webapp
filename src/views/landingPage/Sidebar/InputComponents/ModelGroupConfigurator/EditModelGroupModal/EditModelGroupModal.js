import { CardContent } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { updatedModelGroup } from "../../../../../../store/modelsSlice"
import { Modal, Card, Button, Grid } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
/**
 * opens a modal where the user can edit an existing model group
 * @param {Object} props 
 * @param {function} props.onClose -> function to call if modal should be closed
 * @param {boolean} props.isOpen -> boolean whether the modal should be visible 
 * @param {function} props.reportError -> error function
 * @param {int} props.modelGroupId -> id of the model group
 * @returns a jsx containing a modal with a data grid with all models from the model group
 */
function EditModelGroupModal(props) {

    // const dispatch = useDispatch()

    let i = props.onClose;
    i = props.isOpen;
    i = props.reportError;
    i = props.modelGroupId;

    // dispatch(updatedModelGroup(someData))

    const cardStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '75%',
        bgcolor: "#808080",
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
        {props.isOpen && 

            <Modal 
                open={props.isOpen}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card sx={cardStyle}>
                    <DataGrid />
                    <Grid container alignItems="flex-end" justifyContent="flex-end">
                        {/*<Button onClick={props.onClose} size="small" style={{marginRight: "2em"}}>Close Modal</Button>*/}
                    </Grid>
                </Card>

            </Modal>
        }
        </>
    );
}

export default EditModelGroupModal;