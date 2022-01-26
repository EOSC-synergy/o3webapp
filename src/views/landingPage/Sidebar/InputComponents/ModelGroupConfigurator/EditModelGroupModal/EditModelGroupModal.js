import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { Modal, Card, Button, Grid, Checkbox } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import SearchBar from "../SearchBar/SearchBar";
import { styled } from '@mui/material/styles';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IntermediateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { selectModelsOfGroup, selectModelDataOfGroup, updatePropertiesOfModelGroup, STATISTICAL_VALUES } from "../../../../../../store/modelsSlice/modelsSlice";

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
            'datasetAndModel': info[4],
            'id': i,
            'median': false,
            'mean': false,
            'percentile': false,
            'derivative': false,
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

    const dispatch = useDispatch();

    const modelList = useSelector(state => selectModelsOfGroup(state, props.modelGroupId));
    const modelData = useSelector(state => selectModelDataOfGroup(state, props.modelGroupId));

    const rows = createRows(modelList);
    const typeList = Object.values(STATISTICAL_VALUES);
    typeList.push("visible")

    const [filteredRows, setFilteredRows] = React.useState(rows);

    const [medianVisible, setMedianVisible] =           React.useState(modelList.map(model => modelData[model].median));
    const [meanVisible, setMeanVisible] =               React.useState(modelList.map(model => modelData[model].mean));
    const [derivativeVisible, setDerivativeVisible] =   React.useState(modelList.map(model => modelData[model].derivative));
    const [percentileVisible, setPercentileVisible] =   React.useState(modelList.map(model => modelData[model].percentile));
    const [isVisible, setIsVisible] =                   React.useState(modelList.map(model => modelData[model].isVisible));

    const getCheckedListByType = (type) => {
        switch(type.toLowerCase()) {
            case "median": return medianVisible;
            case "mean": return  meanVisible;
            case "derivative": return  derivativeVisible;
            case "percentile": return  percentileVisible;
            case "visible": return isVisible;
            default: return medianVisible;
        }

    }

    const getCheckedSetterByType = (type) => {
        switch(type.toLowerCase()) {
            case "pedian": return setMedianVisible;
            case "mean": return  setMeanVisible;
            case "derivative": return  setDerivativeVisible;
            case "percentile": return  setPercentileVisible;
            case "visible": return setIsVisible;
            default: return setMedianVisible;
        }

    }

    const foundIndices = (indexArray) => {
        setFilteredRows(indexArray.map(idx => rows[idx])); // translates indices into selected rows
    }

    const handleChecked = (checkedList, setter) => (id) => {
        let checkedListCopy = [...checkedList];
        checkedListCopy[id] = !checkedListCopy[id];
        setter(checkedListCopy);
    }

    const areAllCheckboxesSelected = (type) => {
        if (filteredRows.length == 0) return false;
        const checkedList = getCheckedListByType(type);
        
        let allRowsSelected = true;
        filteredRows.forEach( row => {
            if(!checkedList[row["id"]]) {
                allRowsSelected = false;
            }
            
        });
        return allRowsSelected;
    }

    const areNoCheckboxesSelected = (type) => {
        if (filteredRows.length == 0) return true;
        const checkedList = getCheckedListByType(type);
        
        let noSelectedRows = true;
        filteredRows.forEach( row => {
            if(checkedList[row["id"]]) {
                noSelectedRows = false;
            }
            
        });
        return noSelectedRows;
    }

    const generateHeaderName = (type) => {
        if (areAllCheckboxesSelected(type)) {
            return (
            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                <CheckBoxIcon fontSize="small" style={{marginRight: "5px"}}/>
                {type}
            </div>)
        } else {
            if (areNoCheckboxesSelected(type)) {
                return (
                <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                    <CheckBoxOutlineBlankIcon  fontSize="small" style={{marginRight: "5px"}}/>
                    {type}
                </div>)
            } else {
                return (
                <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                    <IntermediateCheckBoxIcon  fontSize="small" style={{marginRight: "5px"}}/>
                    {type}
                </div>)
            }
        }
    }

    const createCellCheckBox = (params, type) => {
        const checkedList =  getCheckedListByType(type);
        const setter =  getCheckedSetterByType(type);
        return (
            <CustomCheckbox 
                isChecked={checkedList[params.row.id]} 
                handleChecked={() => {
                    const checkedHandler = handleChecked(checkedList, setter);
                    checkedHandler(params.row.id)
                }}
            />
        );
    }

    const columnHeaderClick = (params) => {
        if (!typeList.includes(params.colDef.field)) return
        const type = params.colDef.headerName;
        const visibleCopy = [...getCheckedListByType(type)];
        const allCheckboxesSelected = areAllCheckboxesSelected(type);
        filteredRows.forEach(
            prop => {visibleCopy[prop["id"]] = (allCheckboxesSelected ? false : true)}
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

    const discardChanges = () => {
        const meanData = [], medianData = [], derivativeData = [], percentileData = [], visibleData = [];

        for(const model of modelList) {
            meanData.push(modelData[model].mean);
            medianData.push(modelData[model].median);
            derivativeData.push(modelData[model].derivative);
            percentileData.push(modelData[model].percentile);
            visibleData.push(modelData[model].isVisible);
        }
  
        setMeanVisible(meanData);
        setMedianVisible(medianData);
        setDerivativeVisible(derivativeData);
        setPercentileVisible(percentileData);
        setIsVisible(visibleData);

        props.onClose();
    }

    const columns = [
        { field: 'model', headerName: 'Model', width: 120 },
        { field: 'institute', headerName: 'Institute', width: 150, editable: false },
        { field: 'datasetAndModel', headerName: 'Dataset and Model', width: 225, editable: false },
        { field: 'median', headerName: 'Median', sortable: false, width: 140, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Median"),
            renderCell: (params) => {return createCellCheckBox(params, "Median")}
        },
        { field: 'mean', headerName: 'Mean', sortable: false, width: 140, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Mean"),
            renderCell: (params) => {return createCellCheckBox(params, "Mean")}
        },
        { field: 'derivative', headerName: 'Derivative', sortable: false, width: 140, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Derivative"),
            renderCell: (params) => {return createCellCheckBox(params, "Derivative")}
        },
        { field: 'percentile', headerName: "Percentile", width: 140, sortable: false, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Percentile"),
            renderCell: (params) => {return createCellCheckBox(params, "Percentile")}
        },
        { field: 'visible', headerName: 'Visible', sortable: false, width: 140, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Visible"),
            renderCell: (params) => {return createCellCheckBox(params, "Visible")}
        },

    ];

    return (
        <>
        {props.isOpen && 

            <Modal 
                open={props.isOpen}
                onClose={discardChanges}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card sx={cardStyle}>
                    <div style={{width: "95%"}}>
                        <SearchBar inputArray={rows} foundIndicesCallback={foundIndices} />
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
                        <Button onClick={discardChanges} aria-label="delete" color={"error"} size="large">
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