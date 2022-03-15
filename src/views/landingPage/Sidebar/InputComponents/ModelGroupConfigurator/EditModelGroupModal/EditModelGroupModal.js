import React, { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux"
import {Modal, Card, Button, Checkbox, IconButton, CardActions, Box} from "@mui/material";
import {DataGrid} from '@mui/x-data-grid';
import SearchBar from "../../../../../../components/Searchbar/Searchbar";
import {styled} from '@mui/material/styles';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IntermediateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { selectModelsOfGroup, selectModelDataOfGroup, updatePropertiesOfModelGroup } from "../../../../../../store/modelsSlice/modelsSlice";
import { STATISTICAL_VALUES, mean, std, median, percentile } from "../../../../../../utils/constants";
import PropTypes from "prop-types";
import CardHeader from '@mui/material/CardHeader';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { convertModelName } from "../../../../../../utils/ModelNameConverter";
import { alpha } from '@mui/system';
import DiscardChangesModal from "../../../../../../components/DiscardChangesModal/DiscardChangesModal";
import store from "../../../../../../store/store";
import { arraysEqual } from "../../../../../../utils/arrayOperations";



/**
 * A DataGrid with applied CSS styling.
 * @memberof EditModelGroupModal
 * @constant {function}
 * @returns {object}
 */
const StyledDataGrid = styled(DataGrid)(() => ({
    height: "70%",
    marginTop: "3%",
}));

/**
 * Parses the rows out of the given modelList
 * @memberof EditModelGroupModal
 * @param {String[]} modelList  A list of models that will be parsed into data grid rows
 * @returns {array}             The rows representing the models of the modelList in the data grid
 */
function createRows(modelList) {
    const rows = [];

    for (let i = 0; i < modelList.length; i++) {
        const model = modelList[i];
        const matchResult = convertModelName(model);
        rows.push({
            "id": i,
            "project": matchResult.project,
            "institute": matchResult.institute,
            "model": matchResult.name,
            "mean": false,
            "standard deviation": false,
            "median": false,
            "percentile": false,
            "visible": false
        })
    }
    return rows;
}

/**
 * A modal where the user can edit the visibility and the inclusion in statistical value calculation
 * of each model in an existing model group.
 * Used in {@link ModelGroupConfigurator}.
 * 
 * @component
 * @param {Object} props specified in propTypes
 * @returns A JSX containing a modal with a data grid with all models from the model group
 */
function EditModelGroupModal(props) {

    const theme = useTheme();

    /**
     * The CSS settings for the Card component
     * @constant {object}
     */
    const cardStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '75%',
        boxShadow: 24,
        overflow: "auto",
        bgcolor: theme.palette.background.default,
        minHeight: "75%",
        maxHeight: "100vh",
        p: 4,
    };

    /**
     * Label displayed at the top of the modal
     * @constant {string}
     */
    const editModalLabel = "Edit Statistical Values";

    /**
     * The text displayed inside the apply button
     * @constant {string}
     */
    const applyButtonLabel = "Save Changes";
    /**
     * A dispatch function to dispatch actions to the redux store.
     * @constant {function}
     */
    const dispatch = useDispatch();

    /**
     * A list of all models in the currently selected model group.
     * The data is fetched from the redux store via a selector.
     * @constant {array}
     * @see selectModelsOfGroup
     */
    const modelList = useSelector(state => selectModelsOfGroup(state, props.modelGroupId));

    /**
     * An object containing all data about the visibility and inclusion in the statistical values'
     * calculation for each model.
     * The data is fetched from the redux store via a selector.
     * @constant {object}
     * @see selectModelDataOfGroup
     */
    const modelData = useSelector(state => selectModelDataOfGroup(state, props.modelGroupId));

    /**
     * All rows that are represented in the data grid.
     * @see createRows
     * @constant {array}
     */
    const rows = createRows(modelList);

    /**
     * The current filtered selection of rows.
     * This array contains all rows remaining as a search result of the Searchbar.
     * @default rows
     */
    const [filteredRows, setFilteredRows] = React.useState(rows);

    /**
     * An array filled with boolean values that indicate whether a model is included in the mean calculation or not.
     * The index of each model in the array is its corresponding row id.
     * @constant {array}
     */
    const [meanVisible, setMeanVisible] = React.useState(modelList.map(model => modelData[model][mean]));

    /**
     * An array filled with boolean values that indicate whether a model is included in the standard deviation (std) calculation or not.
     * The index of each model in the array is its corresponding row id.
     * @constant {array}
     */
    const [stdVisible, setStdVisible] = React.useState(modelList.map(model => modelData[model][std]));

    /**
     * An array filled with boolean values that indicate whether a model is included in the median calculation or not.
     * The index of each model in the array is its corresponding row id.
     * @constant {array}
     */
    const [medianVisible, setMedianVisible] = React.useState(modelList.map(model => modelData[model][median]));

    /**
     * An array filled with boolean values that indicate whether a model is included in the percentile calculation or not.
     * The index of each model in the array is its corresponding row id.
     * @constant {array}
     */
    const [percentileVisible, setPercentileVisible] = React.useState(modelList.map(model => modelData[model][percentile]));

    /**
     * An array filled with boolean values that indicate whether a model should be visible in the plot or not.
     * The index of each model in the array is its corresponding row id.
     * @constant {array}
     */
    const [isVisible, setIsVisible] = React.useState(modelList.map(model => modelData[model].isVisible));


    const [discardChangesOpen, setDiscardChangesOpen] = React.useState(false);

    /**
     * List of all checkbox and selection types that should be editable in the data grid.
     * It includes all statistical values and the "visible" type.
     * @constant {array}
     */
    const typeList = Object.values(STATISTICAL_VALUES);
    typeList.push("visible");

    /**
     * Gets the boolean list of checked and unchecked models of the selected type.
     * The type is either a statistical value or the visible property.
     * E.g. "visible" would return the isVisible boolean list.
     *
     * @param {String} type  The type of the list
     * @returns The boolean checked list of the selected type
     * @constant {function}
     */
    const getCheckedListByType = (type) => {
        switch (type.toLowerCase()) {
            case "mean":
                return meanVisible;
            case "standard deviation":
                return stdVisible;
            case "median":
                return medianVisible;
            case "percentile":
                return percentileVisible;
            case "visible":
                return isVisible;
            default:
                return medianVisible;
        }

    }

    useEffect(() => {
        if (props.isOpen && props.refresh) {
            setFilteredRows(rows);
            setPercentileVisible(modelList.map(model => modelData[model][percentile]));
            setIsVisible(modelList.map(model => modelData[model]["isVisible"]));
            setStdVisible(modelList.map(model => modelData[model][std]));
            setMedianVisible(modelList.map(model => modelData[model][median]));
            setMeanVisible(modelList.map(model => modelData[model][mean]));  
        }
        
    }, [props.isOpen]);

    /**
     * Gets the setter for the boolean list of checked and unchecked models of the selected type.
     * The type is either a statistical value or the visible property.
     * E.g. "visible" would return the setIsVisible setter.
     *
     * @param {String} type  The type of the setter
     * @returns The setter for the boolean checked list of the selected type
     * @constant {function}
     */
    const getCheckedSetterByType = (type) => {
        switch (type.toLowerCase()) {
            case "mean":
                return setMeanVisible;
            case "standard deviation":
                return setStdVisible;
            case "median":
                return setMedianVisible;
            case "percentile":
                return setPercentileVisible;
            case "visible":
                return setIsVisible;
            default:
                return setMedianVisible;
        }

    }

    /**
     * Applies the filtered rows by the Searchbar to the filteredRows component state.
     *
     * @param {int[]} indexArray    Array of the filtered indexes of the search result that identify the filtered rows.
<<<<<<< HEAD
     * @see setFilteredRows
=======
     * @constant {function}
>>>>>>> develop
     */
    const foundIndices = (indexArray) => {
        setFilteredRows(indexArray.map(idx => rows[idx])); // translates indices into selected rows
    }

    /**
     * Generates a function that handles if a specific cell in the data grid is checked.
     *
     * @param {boolean[]} checkedList   The boolean list with the information on which row is checked or not (e.g. isVisible)
     * @param {function} setter         The setter function for the checkedList (e.g. setIsVisible)
     * @returns                         A function to handle the event if a Cell-Checkbox is clicked
     * @constant {function}
     */
    const handleChecked = (checkedList, setter) => (id) => {
        let checkedListCopy = [...checkedList];
        checkedListCopy[id] = !checkedListCopy[id];
        setter(checkedListCopy);
    }

    /**
     * Checks if all currently filtered checkboxes of the given type are selected.
     *
     * @param {String} type     The type of the checkbox (e.g. visible)
     * @returns                 True if all checkboxes of the given type are selected
     * @constant {function}
     */
    const areAllCheckboxesSelected = (type) => {
        if (filteredRows.length === 0) return false;
        const checkedList = getCheckedListByType(type);

        let allRowsSelected = true;
        filteredRows.forEach(row => {
            if (!checkedList[row["id"]]) {
                allRowsSelected = false;
            }

        });
        return allRowsSelected;
    }

    /**
     * Checks if none of the currently filtered checkboxes of the given type are selected.
     *
     * @param {String} type     The type of the checkbox (e.g. visible)
     * @returns                 True if no checkboxes of the given type are selected
     * @constant {function}
     */
    const areNoCheckboxesSelected = (type) => {
        if (filteredRows.length === 0) return true;
        const checkedList = getCheckedListByType(type);

        let noSelectedRows = true;
        filteredRows.forEach(row => {
            if (checkedList[row["id"]]) {
                noSelectedRows = false;
            }

        });
        return noSelectedRows;
    }

    /**
     * Handles the change if a column header is clicked.
     *
     * @param {Object} params                       The default parameters with metadata about the clicked column
     * @param {String} params.colDef.field          The fieldId of the clicked column
     * @param {String} params.colDef.headerName     The name of the column that is displayed
     * @constant {function}
     */
    const columnHeaderClick = (params) => {
        if (!typeList.includes(params.colDef.field)) return;
        const type = params.colDef.headerName;
        const visibleCopy = [...getCheckedListByType(type)];
        const allCheckboxesSelected = areAllCheckboxesSelected(type);
        filteredRows.forEach(
            prop => {
                visibleCopy[prop["id"]] = !allCheckboxesSelected
            }
        )
        const setter = getCheckedSetterByType(type);
        setter(visibleCopy);
    }

    /**
     * Closes the discard changes modal and re-opens the edit group modal without refreshing the state.
     * @function
     */
    const closeDiscardChangesDialog = () => {
        setDiscardChangesOpen(false);
        props.setOpen(false); // re-open without refreshing the state
    }

    
    /**
     * Checks whether changes have been made to the statistical values or the visibility of the models
     * in the model group.
     * 
     * @returns whether changes have been made in the editStatisticalValueModal for the currently shown group
     */
    const hasChanges = () => {
        const meanData = [], stdData = [], medianData = [], percentileData = [], visibleData = [];

        for (const model of modelList) {
            meanData.push(modelData[model][mean]);
            stdData.push(modelData[model][std]);
            medianData.push(modelData[model][median]);
            percentileData.push(modelData[model][percentile]);
            visibleData.push(modelData[model].isVisible);
        }

        return !( // no changes if all arrays equal each other
            arraysEqual(meanVisible, meanData)
            && arraysEqual(stdVisible, stdData)
            && arraysEqual(medianVisible, medianData)
            && arraysEqual(percentileVisible, percentileData)
            && arraysEqual(isVisible, visibleData)
        );
    }


    /**
     * Applies the changes made in the current session of the EditModelGroup and closes the Modal.
     * The changes are dispatched into the redux store.
     * @constant {function}
     */
    const applyChanges = () => {
        const dataCpy = JSON.parse(JSON.stringify(modelData));
        for (let i = 0; i < modelList.length; i++) {
            const model = modelList[i];
            dataCpy[model][mean] = meanVisible[i];
            dataCpy[model][std] = stdVisible[i];
            dataCpy[model][median] = medianVisible[i];
            dataCpy[model][percentile] = percentileVisible[i];
            dataCpy[model]["isVisible"] = isVisible[i];
        }
        dispatch(updatePropertiesOfModelGroup({groupId: props.modelGroupId, data: dataCpy}))
        props.onClose();
    }

    /**
     * Default close handler that is called when clicked outside of the modal or the close icon is pressed.
     * @function
     */
    const closeModal = () => {
        if (hasChanges()) { // made changes, open discard changes modal
            props.onClose();
            setDiscardChangesOpen(true)
        } else { // no changes made
            props.onClose();
        }
    }

    /**
     * Generates a column header for a given type.
     *
     * @param {String} type     The type of the column (e.g. visible)
<<<<<<< HEAD
     * @returns {JSX.Element}   JSX with the generated header name.
=======
     * @returns                 JSX with the generated header name.
     * @constant {function}
>>>>>>> develop
     */
    const generateHeaderName = (type) => {
        return (
            <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', cursor: 'pointer'}}>
                <Box
                    sx={{
                        textAlign: 'center',
                        marginRight: '5px',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
                        },
                    }}
                >
                    {
                        areAllCheckboxesSelected(type) ?
                            <CheckBoxIcon
                                fontSize="medium"
                                color="primary"
                                data-testid={`ColumnCheckboxCheckedType${type}`}
                            />
                        : (
                            areNoCheckboxesSelected(type) ?
                                <CheckBoxOutlineBlankIcon
                                    fontSize="medium"
                                    data-testid={`ColumnCheckboxUncheckedType${type}`}
                                />
                            :
                                <IntermediateCheckBoxIcon
                                    fontSize="medium"
                                    color="primary"
                                    data-testid={`ColumnCheckboxIntermediateType${type}`}
                                />
                            )
                    }
                </Box>
                {type}
            </div>
        );
    }

    /**
     * A customized MUI Checkbox.
     *
     * @param {Object} props    Props for the MUI Checkbox
<<<<<<< HEAD
     * @returns {JSX.Element}   JSX with the customized Checkbox
=======
     * @returns                 JSX with the customized Checkbox
     * @constant {function}
>>>>>>> develop
     */
    const CustomCheckbox = (props) => {
        return (
            <div className="d-flex justify-content-between align-items-center" style={{cursor: "pointer"}}>
                <Checkbox size='medium' checked={props.isChecked} onClick={props.handleChecked} sx={{ml: '4px'}}/>
            </div>
        );
    }

    /**
     * Creates a checkbox for a specific cell in the data grid.
     *
     * @param {Object} params   The params containing metadata about the row
     * @param {String} type     The type of the selection (e.g. visible)
<<<<<<< HEAD
     * @returns {JSX.Element}   JSX element with the customized Cell-Checkbox
=======
     * @returns                 JSX element with the customized Cell-Checkbox
     * @constant {function}
>>>>>>> develop
     */
    const createCellCheckBox = (params, type) => {
        const checkedList = getCheckedListByType(type);
        const setter = getCheckedSetterByType(type);
        return (
            <div data-testid={`CellCheckboxRow${params.row.id}Type${type}`}>
                <CustomCheckbox
                    isChecked={checkedList[params.row.id]}
                    handleChecked={() => {
                        const checkedHandler = handleChecked(checkedList, setter);
                        checkedHandler(params.row.id)
                    }}
                />
            </div>
        );
    }

    /**
<<<<<<< HEAD
     * An array containing the specification for the columns of the data grid.
=======
     * An Object containing the specification for the columns of the data grid.
>>>>>>> develop
     * @constant {array}
     */
    const columns = [
        { field: 'project', headerName: 'Project', width: 120, editable: false},
        { field: 'institute', headerName: 'Institute', width: 150, editable: false },
        { field: 'model', headerName: 'Model', width: 225, editable: false },
        {
            field: mean, headerName: 'Mean', sortable: false, width: 140, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Mean"),
            renderCell: (params) => {
                return createCellCheckBox(params, "Mean")
            }
        },
        {
            field: std, headerName: 'Standard deviation', sortable: false, width: 200, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Standard deviation"),
            renderCell: (params) => {return createCellCheckBox(params, "Standard deviation")}
        },
        {
            field: median, headerName: 'Median', sortable: false, width: 140, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Median"),
            renderCell: (params) => {
                return createCellCheckBox(params, "Median")
            }
        },
        {
            field: percentile, headerName: "Percentile", width: 150, sortable: false, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Percentile"),
            renderCell: (params) => {
                return createCellCheckBox(params, "Percentile")
            }
        },
        {
            field: 'visible', headerName: 'Visible', sortable: false, width: 140, disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName("Visible"),
            renderCell: (params) => {
                return createCellCheckBox(params, "Visible")
            }
        },

    ];

    return (
        <React.Fragment>
            <Modal
                open={props.isOpen}
                onClose={closeModal}
                aria-labelledby="EditModelGroupModal-modal"
                data-testid="EditModelGroupModal-modal-wrapper"
            >
                <Card sx={cardStyle}>
                    <CardHeader
                        title={editModalLabel}
                        action={
                            <IconButton onClick={closeModal} aria-label="close" data-testid="DiscardButton">
                                <CloseIcon/>
                            </IconButton>
                        }
                    />
                    <div style={{width: "95%"}}>
                        <SearchBar inputArray={rows} foundIndicesCallback={foundIndices}/>
                    </div>
                    <StyledDataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        onColumnHeaderClick={columnHeaderClick}
                        disableColumnMenu
                        columnBuffer={8}
                        sx={{height: '65%'}}
                    />
                    <CardActions sx={{justifyContent: "flex-end", marginTop: "2%"}}>
                        <Button onClick={applyChanges} variant="contained" data-testid="ApplyButton">{applyButtonLabel}</Button>
                    </CardActions>
                </Card>
            </Modal>
            <DiscardChangesModal 
                isOpen={discardChangesOpen} 
                onClose={closeDiscardChangesDialog} 
                saveChanges={applyChanges} 
                discardChanges={() => {}} 
                closeDialog={() => setDiscardChangesOpen(false)}
            />
        </React.Fragment>
    );
}


EditModelGroupModal.propTypes = {
    /**
     * Boolean whether the modal should be visible
     */
    isOpen: PropTypes.bool.isRequired,
    /**
     * Function to call if modal should be closed
     */
    onClose: PropTypes.func.isRequired,
    /**
     * Id of the model group
     */
    modelGroupId: PropTypes.number.isRequired,
    /**
     * function to re-open the modal from inside the component.
     */
    setOpen: PropTypes.func.isRequired,
    /**
     * boolean indicating whether the state should be refreshed. This is usually
     * set to false, true is only required when the discard changes modal is closed
     * without saving or ultimately discarding the changes.
     */
    refresh: PropTypes.bool.isRequired,
    /**
     * function for error handlinf
     */
    reportError: PropTypes.func
}

export default EditModelGroupModal;