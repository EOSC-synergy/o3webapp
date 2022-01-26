import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Modal, Card, Button, Grid, Checkbox, createSvgIcon, Divider } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import SearchBar from "../SearchBar/SearchBar";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { selectActivePlotData } from "../../../../../../services/API/apiSlice";
import models from "./models.json";

import { Typography } from "@mui/material";

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    height: "65%",
    marginTop: "3%",
}));

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

function CustomCheckbox(props) {
    return (
        <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <Checkbox checked={props.isChecked} onClick={props.handleChecked}/>
        </div>
    );
}

function createRows(modelList) {
    const rows = [];
    const regex= /([a-z]|[A-Z]|[0-9]|-)*/g;

    for(let i = 0; i < modelList.length; i++) {
        const model = modelList[i];
        const info = model.match(regex);
        rows.push({
            'model': info[0],
            'institute': info[2],
            'dataset + model': info[4],
            'id': i,
            'Median': false,
            'Mean': false,
            'Percentile': false,
            'Derivative': false,
            'visible': false
        })
    }
    return rows;
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
    //const models = ["AAA", "BBB","CCC", "DDD"]//useSelector(selectActivePlotData);
    const rows = createRows(models);
    const typeList = ["Median", "Mean", "Derivative", "Percentile"];

    const [filteredRows, setFilteredRows] = React.useState(rows);

    const [medianVisible, setMedianVisible] =           React.useState(Array(filteredRows.length).fill(false));
    const [meanVisible, setMeanVisible] =               React.useState(Array(filteredRows.length).fill(false));
    const [derivativeVisible, setDerivativeVisible] =   React.useState(Array(filteredRows.length).fill(false));
    const [percentileVisible, setPercentileVisible] =   React.useState(Array(filteredRows.length).fill(false));
    //const [currentSelectedIds, setCurrentSelectedIds] = React.useState([]);




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
    const getSVList = (type) => {
        switch(type) {
            case "Median": return medianVisible;
            case "Mean": return  meanVisible;
            case "Derivative": return  derivativeVisible;
            case "Percentile": return  percentileVisible;
        }

    }

    const getSVSetter = (type) => {
        switch(type) {
            case "Median": return setMedianVisible;
            case "Mean": return  setMeanVisible;
            case "Derivative": return  setDerivativeVisible;
            case "Percentile": return  setPercentileVisible;
        }

    }

    const areAllCheckboxesSelected = (type) => {
        if (filteredRows.length == 0) return false;
        const sv = getSVList(type);
        
        let selected = true;
        filteredRows.forEach( prop => {
            if(!sv[prop["id"]]) {
                selected = false;
            }
            
        });
        return selected;
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
            field: 'Median',
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
            field: 'Mean',
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
            field: 'Derivative',
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
            field: 'Percentile',
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

    const createSVButton = (type) => {
        return <><Button variant="outlined" 
        startIcon={areAllCheckboxesSelected(type) ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />} 
        onClick={() => {
            const visibleCopy = [...getSVList(type)];
            const checkboxesSelected = areAllCheckboxesSelected(type);
            filteredRows.forEach(
                prop => {visibleCopy[prop["id"]] = (checkboxesSelected ? false : true)}
            )
            const setter = getSVSetter(type);
            setter(visibleCopy);
        }}
        style={{marginRight: "1%", marginTop: "1%"}}> 
        {type} 
        </Button></>
    }

    const columnHeaderClick = (params) => {
        console.log(params)
        const type = params.colDef.headerName;
        const visibleCopy = [...getSVList(type)];
        const checkboxesSelected = areAllCheckboxesSelected(type);
        filteredRows.forEach(
            prop => {visibleCopy[prop["id"]] = (checkboxesSelected ? false : true)}
        )
        const setter = getSVSetter(type);
        setter(visibleCopy);
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
                    <Grid container direction="row"  justifyContent="center" style={{marginTop: "1%"}}> 
                        <Typography>Modify Selected Rows:</Typography>
                        <Grid container direction="row"  justifyContent="center">
                            {typeList.map(type => createSVButton(type))}
                        </Grid>
                    </Grid>
                    <StyledDataGrid 
                            rows={filteredRows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5]}
                            onColumnHeaderClick={columnHeaderClick}
                            // hideFooter
                            // autoHeight
                            //disableSelectionOnClick
                            //disableColumnMenu
                            //disableColumnSelector
                            //checkboxSelection
                            //onSelectionModelChange={(ids) => {
                            //    const selectedIDs = new Set(ids);
                                /*
                                const selectedRowData = rows.filter((row) =>
                                  selectedIDs.has(row.id.toString())
                                );
                                */
                            //    setCurrentSelectedIds([...selectedIDs]);
                            //  }}
                    />
                    
                    
                </Card>

            </Modal>
        }
        </>
    );
}

export default EditModelGroupModal;