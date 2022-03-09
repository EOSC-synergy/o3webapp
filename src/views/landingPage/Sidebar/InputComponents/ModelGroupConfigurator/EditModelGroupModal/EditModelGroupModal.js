import React from "react";
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
    const regex = /([a-z]|[A-Z]|[0-9]|-)*/g;

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
 *
 * @component
 * @param {Object} props
 * @param {function} props.onClose      Function to call if modal should be closed
 * @param {boolean} props.isOpen        Boolean whether the modal should be visible
 * @param {function} props.reportError  Error function
 * @param {int} props.modelGroupId      Id of the model group
 * @returns                             A JSX containing a modal with a data grid with all models from the model group
 */
function EditModelGroupModal(props) {

    const theme = useTheme();

    /**
     * The CSS settings for the Card component
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
     */
    const editModalLabel = "Edit Statistical Values";

    /**
     * The text displayed inside the apply button
     */
    const applyButtonLabel = "Save Changes";
    /**
     * A dispatch function to dispatch actions to the redux store.
     */
    const dispatch = useDispatch();

    /**
     * A list of all models in the currently selected model group.
     * The data is fetched from the redux store via a selector.
     */
    const modelList = useSelector(state => selectModelsOfGroup(state, props.modelGroupId));

    /**
     * An object containing all data about the visibility and inclusion in the statistical values'
     * calculation for each model.
     * The data is fetched from the redux store via a selector.
     */
    const modelData = useSelector(state => selectModelDataOfGroup(state, props.modelGroupId));

    /**
     * All rows that are represented in the data grid.
     */
    const rows = createRows(modelList);

    /**
     * The current filtered selection of rows.
     * This array contains all rows remaining as a search result of the Searchbar.
     */
    const [filteredRows, setFilteredRows] = React.useState(rows);

    /**
     * An array filled with boolean values that indicate whether a model is included in the mean calculation or not.
     * The index of each model in the array is its corresponding row id.
     */
    const [meanVisible, setMeanVisible] = React.useState(modelList.map(model => modelData[model][mean]));

    /**
     * An array filled with boolean values that indicate whether a model is included in the standard deviation (std) calculation or not.
     * The index of each model in the array is its corresponding row id.
     */
    const [stdVisible, setStd] = React.useState(modelList.map(model => modelData[model][std]));

    /**
     * An array filled with boolean values that indicate whether a model is included in the median calculation or not.
     * The index of each model in the array is its corresponding row id.
     */
    const [medianVisible, setMedianVisible] = React.useState(modelList.map(model => modelData[model][median]));

    /**
     * An array filled with boolean values that indicate whether a model is included in the percentile calculation or not.
     * The index of each model in the array is its corresponding row id.
     */
    const [percentileVisible, setPercentileVisible] = React.useState(modelList.map(model => modelData[model][percentile]));

    /**
     * An array filled with boolean values that indicate whether a model should be visible in the plot or not.
     * The index of each model in the array is its corresponding row id.
     */
    const [isVisible, setIsVisible] = React.useState(modelList.map(model => modelData[model].isVisible));

    /**
     * List of all checkbox and selection types that should be editable in the data grid.
     * It includes all statistical values and the "visible" type.
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

    /**
     * Gets the setter for the boolean list of checked and unchecked models of the selected type.
     * The type is either a statistical value or the visible property.
     * E.g. "visible" would return the setIsVisible setter.
     *
     * @param {String} type  The type of the setter
     * @returns The setter for the boolean checked list of the selected type
     */
    const getCheckedSetterByType = (type) => {
        switch (type.toLowerCase()) {
            case "mean":
                return setMeanVisible;
            case "standard deviation":
                return setStd;
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
     * Applies the changes made in the current session of the EditModelGroup and closes the Modal.
     * The changes are dispatched into the redux store.
     */
    const applyChanges = () => {
        const dataCpy = JSON.parse(JSON.stringify(modelData));

        for (let i = 0; i < modelList.length; i++) {
            const model = modelList[i];
            dataCpy[model][mean] = meanVisible[i];
            dataCpy[model][std] = stdVisible[i];
            dataCpy[model][median] = medianVisible[i];
            dataCpy[model][percentile] = percentileVisible[i];
            dataCpy[model][isVisible] = isVisible[i];
        }

        dispatch(updatePropertiesOfModelGroup({groupId: props.modelGroupId, data: dataCpy}))
        props.onClose();
    }

    /**
     * Discards the changes made in the current session of the EditModelGroup and closes the Modal.
     * All changes are lost in the process.
     */
    const discardChanges = () => {
        const meanData = [], stdData = [], medianData = [], percentileData = [], visibleData = [];

        for (const model of modelList) {
            meanData.push(modelData[model][mean]);
            stdData.push(modelData[model][std]);
            medianData.push(modelData[model][median]);
            percentileData.push(modelData[model][percentile]);
            visibleData.push(modelData[model].isVisible);
        }

        setMeanVisible(meanData);
        setStd(stdData);
        setMedianVisible(medianData);
        setPercentileVisible(percentileData);
        setIsVisible(visibleData);

        props.onClose();
    }

    /**
     * Generates a column header for a given type.
     *
     * @param {String} type     The type of the column (e.g. visible)
     * @returns                 JSX with the generated header name.
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
     * @returns                 JSX with the customized Checkbox
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
     * @returns                 JSX element with the customized Cell-Checkbox
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
     * An Object containing the specification for the columns of the data grid.
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
        <Modal
            open={props.isOpen}
            onClose={discardChanges}
            aria-labelledby="EditModelGroupModal-modal"
            data-testid="EditModelGroupModal-modal-wrapper"
        >
            <Card sx={cardStyle}>
                <CardHeader
                    title={editModalLabel}
                    action={
                        <IconButton onClick={discardChanges} aria-label="close" data-testid="DiscardButton">
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
    );
}

EditModelGroupModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    modelGroupId: PropTypes.number.isRequired,
    reportError: PropTypes.func
}

export default EditModelGroupModal;