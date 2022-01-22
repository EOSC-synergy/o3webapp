import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { Modal, Card, Button, Grid, Checkbox } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import models from "./models"
import SearchBar from "../SearchBar/SearchBar";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';

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

function CustomCheckbox(props) {
    return (
        <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <Checkbox checked={props.isChecked} onClick={props.handleChecked}/>
        </div>
    );
}

const MemoizedCheckbox = React.memo(CustomCheckbox);

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

    const [filteredRows, setFilteredRows] = React.useState(rows);

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

    const [medianVisible, setMedianVisible] =           React.useState(Array(filteredRows.length).fill(false));
    const [meanVisible, setMeanVisible] =               React.useState(Array(filteredRows.length).fill(false));
    const [derivativeVisible, setDerivativeVisible] =   React.useState(Array(filteredRows.length).fill(false));
    const [percentileVisible, setPercentileVisible] =   React.useState(Array(filteredRows.length).fill(false));


    const handleMedianChecked = (id) => {
        let medianVisibleCopy = [...medianVisible]
        medianVisibleCopy[id] = !medianVisibleCopy[id]
        setMedianVisible(medianVisibleCopy);
    }

    const handleMeanChecked = (id) => {
        let meanVisibleCopy = [...meanVisible]
        meanVisibleCopy[id] = !meanVisibleCopy[id]
        setMeanVisible(meanVisibleCopy);
    }

    const handleDerivativeChecked = (id) => {
        let derivativeVisibleCopy = [...derivativeVisible]
        derivativeVisibleCopy[id] = !derivativeVisibleCopy[id]
        setDerivativeVisible(derivativeVisibleCopy);
    }

    const handlePercentileChecked = (id) => {
        let percentileVisibleCopy = [...percentileVisible]
        percentileVisibleCopy[id] = !percentileVisibleCopy[id]
        setPercentileVisible(percentileVisibleCopy);
    }

    const handleVisibleChecked = () => {

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
                    <MemoizedCheckbox isChecked={medianVisible[params.row.id]} handleChecked={() => handleMedianChecked(params.row.id)}/>
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
                    <MemoizedCheckbox isChecked={meanVisible[params.row.id]} handleChecked={() => handleMeanChecked(params.row.id)}/>
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
                    <MemoizedCheckbox isChecked={derivativeVisible[params.row.id]} handleChecked={() => handleDerivativeChecked(params.row.id)}/>
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
                    <MemoizedCheckbox isChecked={percentileVisible[params.row.id]} handleChecked={() => handlePercentileChecked(params.row.id)}/>
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
                        <Checkbox onClick={handleVisibleChecked} />
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
                            //disableSelectionOnClick
                            //disableColumnMenu
                            //disableColumnSelector
                            checkboxSelection
                    />
                    
                    <Grid container alignItems="center" justifyContent="center">
                        <Button variant="outlined" startIcon={<DeleteIcon />}>
                            Delete
                        </Button>
                    </Grid>
                </Card>

            </Modal>
        }
        </>
    );
}

export default EditModelGroupModal;