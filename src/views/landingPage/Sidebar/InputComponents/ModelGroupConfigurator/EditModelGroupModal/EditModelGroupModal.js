import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { updatedModelGroup } from "../../../../../../store/modelsSlice"
import { Modal, Card, Button, Grid, Checkbox } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import models from "./models"
import SearchBar from "../SearchBar/SearchBar";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import ClearIcon from '@mui/icons-material/Clear';

import { Typography } from "@mui/material";

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    height: "65%",
    marginTop: "3%",
}));

const rows = [];
const regex= /([a-z]|[A-Z]|[0-9]|-)*/g;

for(let i = 0; i < models.length; i++) {
    const model = models[i];
    const info = model.match(regex);
    rows.push({
        'model': info[0],
        'institute': info[2],
        'dataset + model': info[4],
        'id': i,
        'include in median': false,
        'include in mean': false,
        'include in percentile': false,
        'include in derivative': false,
        'visible': false
    })
}

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

    const [filteredRows, setFilteredRows] = React.useState(rows);

    // dispatch(updatedModelGroup(someData))

    const cardStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '65%',
        height: '75%',
        bgcolor: "#FFFFFF",
        boxShadow: 24,
        p: 4,
    };

    const handleMedianChecked = () => {

    }

    const handleMeanChecked = () => {

    }

    const handleDerivativeChecked = () => {

    }

    const handlePercentileChecked = () => {

    }

    const handleVilibleChecked = () => {

    }

    
    //const makeRepeated = (arr, repeats) => Array.from({ length: repeats }, () => arr).flat();

    //rows = makeRepeated(rows, 10);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        { field: 'model', headerName: 'Model', width: 120 },
        {
          field: 'institute',
          headerName: 'Institute',
          width: 150,
          editable: true,
        },
        {
          field: 'dataset + model',
          headerName: 'Dataset and Model',
          width: 225,
          editable: true,
        },
        {
            field: 'include in median',
            headerName: 'Median',
            sortable: false,
            width: 120,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
                        <Checkbox onClick={handleMedianChecked}/>
                    </div>
                );
             }
          },
          {
            field: 'include in mean',
            headerName: 'Mean',
            sortable: false,
            width: 120,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
                        <Checkbox onClick={handleMeanChecked}/>
                    </div>
                );
             }
          },
          {
            field: 'include in derivative',
            headerName: 'Derivative',
            sortable: false,
            width: 120,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
                        <Checkbox onClick={handleDerivativeChecked}/>
                    </div>
                );
             }
          },
          {
            field: 'include in percentile',
            headerName: 'Percentile',
            width: 120,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
                        <Checkbox onClick={handlePercentileChecked}/>
                    </div>
                );
             }
          },
          {
            field: 'visible',
            headerName: 'Visible',
            sortable: false,
            width: 120,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
                        <Checkbox onClick={handleVilibleChecked} />
                    </div>
                );
             }
          },
          {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            width: 120,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
                        <IconButton aria-label="delete" color={"error"}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                );
             }
          },

    ];

    const foundIndices = (indexArray) => {
        setFilteredRows(indexArray.map(idx => rows[idx])); // translates indices into selected rows
    }

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
                    <Grid container alignItems="flex-end" justifyContent="right" style={{marginBottom: "1%"}}>
                        
                        <IconButton aria-label="delete" color={"success"} size="large">
                            <DoneIcon fontSize="large"/>
                        </IconButton>
                        <IconButton onClick={props.onClose} aria-label="delete" color={"error"} size="large">
                            <ClearIcon fontSize="large"/>
                        </IconButton>
                    </Grid>
                    <div style={{width: "95%"}}>
                        <SearchBar 
                            inputArray={rows}
                            foundIndicesCallback={foundIndices}
                        />
                    </div>
                    <StyledDataGrid 
                            rows={filteredRows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5]}
                            // hideFooter
                            // autoHeight
                            disableSelectionOnClick
                            disableColumnMenu
                            disableColumnSelector
                    />
                    
                    <Grid container alignItems="center" justifyContent="center">
                        <IconButton aria-label="delete" color={"success"} size="large">
                            <AddIcon fontSize="large"/>
                        </IconButton>
                    </Grid>
                </Card>

            </Modal>
        }
        </>
    );
}

export default EditModelGroupModal;