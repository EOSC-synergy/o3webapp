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
import { selectModelsOfGroup, selectModelDataOfGroup, updatePropertiesOfModelGroup } from "../../../../../../store/modelsSlice/modelsSlice";

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    height: "80%",
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
            'fullModelId': model,
            'model': info[0],
            'institute': info[2],
            'dataset + model': info[4],
            'id': i,
            'Median': false,
            'Mean': false,
            'Percentile': false,
            'Derivative': false,
            'Visible': false
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

    const dispatch = useDispatch();

    const modelList = useSelector(state => selectModelsOfGroup(state, props.modelGroupId));
    const modelData = useSelector(state => selectModelDataOfGroup(state, props.modelGroupId));

    const rows = createRows(modelList);
    const typeList = ["Median", "Mean", "Derivative", "Percentile"];
    const [filteredRows, setFilteredRows] = React.useState(rows);

    const [medianVisible, setMedianVisible] =           React.useState(Array(rows.length).fill(false));
    const [meanVisible, setMeanVisible] =               React.useState(Array(rows.length).fill(false));
    const [derivativeVisible, setDerivativeVisible] =   React.useState(Array(rows.length).fill(false));
    const [percentileVisible, setPercentileVisible] =   React.useState(Array(rows.length).fill(false));
    const [isVisible, setIsVisible] =                   React.useState(Array(rows.length).fill(false));




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

    const handleVisibleChecked = (id) => {
        let isVisibleCopy = [...isVisible];
        isVisibleCopy[id] = !isVisibleCopy[id];
        setIsVisible(isVisibleCopy);
    }

    const getCheckedListByType = (type) => {
        switch(type) {
            case "Median": return medianVisible;
            case "Mean": return  meanVisible;
            case "Derivative": return  derivativeVisible;
            case "Percentile": return  percentileVisible;
            case "Visible": return isVisible;
        }

    }

    const getCheckedSetterByType = (type) => {
        switch(type) {
            case "Median": return setMedianVisible;
            case "Mean": return  setMeanVisible;
            case "Derivative": return  setDerivativeVisible;
            case "Percentile": return  setPercentileVisible;
            case "Visible": return setIsVisible;
        }

    }

    const areAllCheckboxesSelected = (type) => {
        if (filteredRows.length == 0) return false;
        const sv = getCheckedListByType(type);
        
        let selected = true;
        filteredRows.forEach( prop => {
            if(!sv[prop["id"]]) {
                selected = false;
            }
            
        });
        return selected;
    }

    const generateHeaderName = (name) => {
        return areAllCheckboxesSelected(name) ? 
        <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
        }}><CheckBoxIcon fontSize="small" style={{marginRight: "5px"}}/><span>{name}</span></div>
            :
        
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}><CheckBoxOutlineBlankIcon  fontSize="small" style={{marginRight: "5px"}}/>{name}</div>
    }
    
    //const makeRepeated = (arr, repeats) => Array.from({ length: repeats }, () => arr).flat();

    //rows = makeRepeated(rows, 10);

    const columns = [
        { field: 'model', headerName: 'Model', width: 120 },
        {
          field: 'institute',
          headerName: 'Institute',
          width: 150,
          editable: false,
        },
        {
          field: 'dataset + model',
          headerName: 'Dataset and Model',
          width: 225,
          editable: false,
        },
        {
            field: 'Median',
            headerName: generateHeaderName('Median'),
            sortable: false,
            width: 140,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <MemoizedCheckbox isChecked={medianVisible[params.row.id]} handleChecked={() => handleMedianChecked(params.row.id)}/>
                );
             }
          },
          {
            field: 'Mean',
            headerName: generateHeaderName('Mean'),
            sortable: false,
            width: 140,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <MemoizedCheckbox isChecked={meanVisible[params.row.id]} handleChecked={() => handleMeanChecked(params.row.id)}/>
                );
             }
          },
          {
            field: 'Derivative',
            headerName: generateHeaderName('Derivative'),
            sortable: false,
            width: 140,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <MemoizedCheckbox isChecked={derivativeVisible[params.row.id]} handleChecked={() => handleDerivativeChecked(params.row.id)}/>
                );
             }
          },
          {
            field: 'Percentile',
            headerName: generateHeaderName("Percentile"),
            width: 140,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
                return (
                    <MemoizedCheckbox isChecked={percentileVisible[params.row.id]} handleChecked={() => handlePercentileChecked(params.row.id)}/>
                );
             }
          },
          {
            field: 'Visible',
            headerName: 'Visible',
            sortable: false,
            width: 140,
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
    
    const columnHeaderClick = (params) => {
        if (!typeList.includes(params.colDef.field)) return
        const type = params.colDef.field;
        const visibleCopy = [...getCheckedListByType(type)];
        const checkboxesSelected = areAllCheckboxesSelected(type);
        filteredRows.forEach(
            prop => {visibleCopy[prop["id"]] = (checkboxesSelected ? false : true)}
        )
        const setter = getCheckedSetterByType(type);
        setter(visibleCopy);
    }

    const applyChanges = () => {
        const dataCpy = JSON.parse(JSON.stringify(modelData));
        
        for(let i = 0; i < modelList.length; i++) {
            const model = modelList[i];
            dataCpy[model].mean = meanVisible[i];
            dataCpy[model].median = medianVisible[i];
            dataCpy[model].derivative = derivativeVisible[i];
            dataCpy[model].percentile = percentileVisible[i];
            dataCpy[model].visible = isVisible[i];
        }

        dispatch(updatePropertiesOfModelGroup({groupId: props.modelGroupId, data: dataCpy}))
        props.onClose();
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
                    <div style={{width: "95%"}}>
                        <SearchBar 
                            inputArray={rows}
                            foundIndicesCallback={foundIndices}
                        />
                    </div>
                    <StyledDataGrid 
                            rows={filteredRows}
                            columns={columns}
                            pageSize={20}
                            rowsPerPageOptions={[5]}
                            onColumnHeaderClick={columnHeaderClick}
                            disableColumnMenu

                    />
                    
                    <Grid container alignItems="flex-end" justifyContent="center" style={{}}>
                        
                        <Button aria-label="delete" color={"success"} size="large" onClick={applyChanges}>
                            <DoneIcon fontSize="large"/> Apply Changes
                        </Button>
                        <Button onClick={props.onClose} aria-label="delete" color={"error"} size="large" onClick={props.onClose}>
                            <ClearIcon fontSize="large"/> Discard Changes
                        </Button>
                    </Grid>
                </Card>

            </Modal>
        }
        </>
    );
}

export default EditModelGroupModal;