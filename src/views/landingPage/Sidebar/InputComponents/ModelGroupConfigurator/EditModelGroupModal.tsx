import React, { type FC, type MouseEventHandler, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Card, CardActions, Checkbox, IconButton, Modal } from '@mui/material';
import { DataGrid, type GridColDef, type GridColumnHeaderParams } from '@mui/x-data-grid';
import SearchBar from 'components/SearchBar';
import { styled, useTheme } from '@mui/material/styles';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IntermediateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import {
    selectModelDataOfGroup,
    selectModelsOfGroup,
    updatePropertiesOfModelGroup,
} from 'store/modelsSlice';
import { mean, median, percentile, STATISTICAL_VALUES, std } from 'utils/constants';
import CardHeader from '@mui/material/CardHeader';
import CloseIcon from '@mui/icons-material/Close';
import { convertModelName } from 'utils/ModelNameConverter';
import { alpha } from '@mui/system';
import DiscardChangesModal from 'components/DiscardChangesModal';
import { arraysEqual } from 'utils/arrayOperations';
import { type AppState, useAppDispatch } from 'store';

/**
 * A DataGrid with applied CSS styling.
 *
 * @memberof EditModelGroupModal
 * @constant {JSX.Object}
 */
const StyledDataGrid = styled(DataGrid)(() => ({
    height: '70%',
    marginTop: '3%',
}));

/**
 * Parses the rows out of the given modelList.
 *
 * @memberof EditModelGroupModal
 * @param {Array} modelList A list of models that will be parsed into data grid rows
 * @returns {Array} The rows representing the models of the modelList in the data grid
 */
function createRows(modelList: string[]) {
    const rows = [];

    for (let i = 0; i < modelList.length; i++) {
        const model = modelList[i];
        const matchResult = convertModelName(model);
        rows.push({
            id: i,
            project: matchResult.project,
            institute: matchResult.institute,
            model: matchResult.name,
            mean: false,
            'standard deviation': false,
            median: false,
            percentile: false,
            visible: false,
        });
    }
    return rows;
}

type EditModelGroupModalProps = {
    isOpen: boolean;
    onClose: () => void;
    modelGroupId: number;
    /** A function to call if modal should be closed */
    setOpen: (open: boolean) => void;
    /**
     * Boolean indicating whether the state should be refreshed. This is usually set to false, true
     * is only required when the discard changes modal is closed without saving or ultimately
     * discarding the changes.
     */
    refresh: boolean;
};
/**
 * A modal where the user can edit the visibility and the inclusion in statistical value calculation
 * of each model in an existing model group.
 */
const EditModelGroupModal: FC<EditModelGroupModalProps> = ({
    isOpen,
    onClose,
    modelGroupId,
    setOpen,
    refresh,
}) => {
    const theme = useTheme();

    /**
     * The CSS settings for the Card component.
     *
     * @constant {Object}
     */
    const cardStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '75%',
        boxShadow: 24,
        overflow: 'auto',
        bgcolor: theme.palette.background.default,
        minHeight: '75%',
        maxHeight: '100vh',
        p: 4,
    };

    /**
     * Label displayed at the top of the modal.
     *
     * @constant {string}
     */
    const editModalLabel = 'Edit Statistical Values';

    /**
     * The text displayed inside the apply button
     *
     * @constant {string}
     */
    const applyButtonLabel = 'Save Changes';
    /**
     * A dispatch function to dispatch actions to the redux store.
     *
     * @function
     */
    const dispatch = useAppDispatch();

    /**
     * A list of all models in the currently selected model group. The data is fetched from the
     * redux store via a selector.
     *
     * @constant {Array}
     * @see selectModelsOfGroup
     */
    const modelList = useSelector((state: AppState) => selectModelsOfGroup(state, modelGroupId));

    /**
     * An object containing all data about the visibility and inclusion in the statistical values'
     * calculation for each model. The data is fetched from the redux store via a selector.
     *
     * @constant {Object}
     * @see selectModelDataOfGroup
     */
    const modelData = useSelector((state: AppState) => selectModelDataOfGroup(state, modelGroupId));

    /**
     * All rows that are represented in the data grid.
     *
     * @constant {Array}
     * @see createRows
     */
    const rows = createRows(modelList);

    /**
     * The current filtered selection of rows. This array contains all rows remaining as a search
     * result of the Searchbar.
     *
     * @constant {Array}
     * @default rows
     */
    const [filteredRows, setFilteredRows] = useState(rows);

    /**
     * An array filled with boolean values that indicate whether a model is included in the mean
     * calculation or not. The index of each model in the array is its corresponding row id.
     *
     * @constant {Array}
     */
    const [meanVisible, setMeanVisible] = useState(
        modelList.map((model) => modelData[model][mean])
    );

    /**
     * An array filled with boolean values that indicate whether a model is included in the standard
     * deviation (std) calculation or not. The index of each model in the array is its corresponding
     * row id.
     *
     * @constant {Array}
     */
    const [stdVisible, setStdVisible] = useState(modelList.map((model) => modelData[model][std]));

    /**
     * An array filled with boolean values that indicate whether a model is included in the median
     * calculation or not. The index of each model in the array is its corresponding row id.
     *
     * @constant {Array}
     */
    const [medianVisible, setMedianVisible] = useState(
        modelList.map((model) => modelData[model][median])
    );

    /**
     * An array filled with boolean values that indicate whether a model is included in the
     * percentile calculation or not. The index of each model in the array is its corresponding row
     * id.
     *
     * @constant {Array}
     */
    const [percentileVisible, setPercentileVisible] = useState(
        modelList.map((model) => modelData[model][percentile])
    );

    /**
     * An array filled with boolean values that indicate whether a model should be visible in the
     * plot or not. The index of each model in the array is its corresponding row id.
     *
     * @constant {Array}
     */
    const [isVisible, setIsVisible] = useState(
        modelList.map((model) => modelData[model].isVisible)
    );

    const [discardChangesOpen, setDiscardChangesOpen] = useState(false);

    /**
     * List of all checkbox and selection types that should be editable in the data grid. It
     * includes all statistical values and the "visible" type.
     *
     * @constant {Array}
     */
    const typeList: string[] = Object.values(STATISTICAL_VALUES);
    typeList.push('visible');

    /**
     * Gets the boolean list of checked and unchecked models of the selected type. The type is
     * either a statistical value or the visible property. E.g. "visible" would return the isVisible
     * boolean list.
     *
     * @function
     * @param type The type of the list
     * @returns The boolean checked list of the selected type
     */
    const getCheckedListByType = (type: string) => {
        switch (type.toLowerCase()) {
            case 'mean':
                return meanVisible;
            case 'standard deviation':
                return stdVisible;
            case 'median':
                return medianVisible;
            case 'percentile':
                return percentileVisible;
            case 'visible':
                return isVisible;
            default:
                return medianVisible;
        }
    };

    useEffect(() => {
        if (isOpen && refresh) {
            setFilteredRows(rows);
            setPercentileVisible(modelList.map((model) => modelData[model][percentile]));
            setIsVisible(modelList.map((model) => modelData[model]['isVisible']));
            setStdVisible(modelList.map((model) => modelData[model][std]));
            setMedianVisible(modelList.map((model) => modelData[model][median]));
            setMeanVisible(modelList.map((model) => modelData[model][mean]));
        }
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Gets the setter for the boolean list of checked and unchecked models of the selected type.
     * The type is either a statistical value or the visible property. E.g. "visible" would return
     * the setIsVisible setter.
     *
     * @function
     * @param type The type of the setter
     * @returns The setter for the boolean checked list of the selected type
     */
    const getCheckedSetterByType = (type: string) => {
        switch (type.toLowerCase()) {
            case 'mean':
                return setMeanVisible;
            case 'standard deviation':
                return setStdVisible;
            case 'median':
                return setMedianVisible;
            case 'percentile':
                return setPercentileVisible;
            case 'visible':
                return setIsVisible;
            default:
                return setMedianVisible;
        }
    };

    /**
     * Applies the filtered rows by the Searchbar to the filteredRows component state.
     *
     * @param newItems Array of the filtered indexes of the search result that identify the filtered
     *   rows.
     * @see setFilteredRows
     */
    const onFilteredItems = (newItems: (typeof rows)[number][]) => {
        setFilteredRows(newItems);
    };

    /**
     * Generates a function that handles if a specific cell in the data grid is checked.
     *
     * @function
     * @param checkedList The boolean list with the information on which row is checked or not (e.g.
     *   isVisible)
     * @param setter The setter function for the checkedList (e.g. setIsVisible)
     * @returns {function} A function to handle the event if a Cell-Checkbox is clicked
     */
    const handleChecked =
        (checkedList: boolean[], setter: (list: boolean[]) => void) => (id: number) => {
            const checkedListCopy = [...checkedList];
            checkedListCopy[id] = !checkedListCopy[id];
            setter(checkedListCopy);
        };

    /**
     * Checks if all currently filtered checkboxes of the given type are selected.
     *
     * @function
     * @param type The type of the checkbox (e.g. visible)
     * @returns True if all checkboxes of the given type are selected
     */
    const areAllCheckboxesSelected = (type: string): boolean => {
        if (filteredRows.length === 0) {
            return false;
        }
        const checkedList = getCheckedListByType(type);

        let allRowsSelected = true;
        filteredRows.forEach((row) => {
            if (!checkedList[row['id']]) {
                allRowsSelected = false;
            }
        });
        return allRowsSelected;
    };

    /**
     * Checks if none of the currently filtered checkboxes of the given type are selected.
     *
     * @function
     * @param type The type of the checkbox (e.g. visible)
     * @returns True if no checkboxes of the given type are selected
     */
    const areNoCheckboxesSelected = (type: string): boolean => {
        if (filteredRows.length === 0) {
            return true;
        }
        const checkedList = getCheckedListByType(type);

        let noSelectedRows = true;
        filteredRows.forEach((row) => {
            if (checkedList[row['id']]) {
                noSelectedRows = false;
            }
        });
        return noSelectedRows;
    };

    /**
     * Handles the change if a column header is clicked.
     *
     * @function
     * @param params.colDef.field The fieldId of the clicked column
     * @param params.colDef.headerName The name of the column that is displayed
     */
    const columnHeaderClick = (params: GridColumnHeaderParams) => {
        if (!typeList.includes(params.colDef.field)) {
            return;
        }
        const type = params.colDef.headerName;
        if (!type) {
            return;
        }
        const visibleCopy = [...getCheckedListByType(type)];
        const allCheckboxesSelected = areAllCheckboxesSelected(type);
        filteredRows.forEach((prop) => {
            visibleCopy[prop['id']] = !allCheckboxesSelected;
        });
        const setter = getCheckedSetterByType(type);
        setter(visibleCopy);
    };

    /**
     * Closes the discard changes modal and re-opens the edit group modal without refreshing the
     * state.
     *
     * @function
     */
    const closeDiscardChangesDialog = () => {
        setDiscardChangesOpen(false);
        setOpen(false); // re-open without refreshing the state
    };

    /**
     * Checks whether changes have been made to the statistical values or the visibility of the
     * models in the model group.
     *
     * @returns Whether changes have been made in the editStatisticalValueModal for the currently
     *   shown group
     */
    const hasChanges = () => {
        const meanData = [],
            stdData = [],
            medianData = [],
            percentileData = [],
            visibleData = [];

        for (const model of modelList) {
            meanData.push(modelData[model][mean]);
            stdData.push(modelData[model][std]);
            medianData.push(modelData[model][median]);
            percentileData.push(modelData[model][percentile]);
            visibleData.push(modelData[model].isVisible);
        }

        return !(
            // no changes if all arrays equal each other
            (
                arraysEqual(meanVisible, meanData) &&
                arraysEqual(stdVisible, stdData) &&
                arraysEqual(medianVisible, medianData) &&
                arraysEqual(percentileVisible, percentileData) &&
                arraysEqual(isVisible, visibleData)
            )
        );
    };

    /**
     * Applies the changes made in the current session of the EditModelGroup and closes the Modal.
     * The changes are dispatched into the redux store.
     *
     * @function
     */
    const applyChanges = () => {
        const dataCpy = JSON.parse(JSON.stringify(modelData));
        for (let i = 0; i < modelList.length; i++) {
            const model = modelList[i];
            dataCpy[model][mean] = meanVisible[i];
            dataCpy[model][std] = stdVisible[i];
            dataCpy[model][median] = medianVisible[i];
            dataCpy[model][percentile] = percentileVisible[i];
            dataCpy[model]['isVisible'] = isVisible[i];
        }
        dispatch(updatePropertiesOfModelGroup({ groupId: modelGroupId, data: dataCpy }));
        onClose();
    };

    /**
     * Discards the changes made in the current session of the EditModelGroup and closes the Modal.
     * All changes are lost in the process.
     *
     * @function
     */
    const closeModal = () => {
        if (hasChanges()) {
            // made changes, open discard changes modal
            onClose();
            setDiscardChangesOpen(true);
        } else {
            // no changes made
            onClose();
        }
    };

    /**
     * Generates a column header for a given type.
     *
     * @function
     * @param {String} type The type of the column (e.g. visible)
     * @returns {JSX.Element} JSX with the generated header name.
     */
    const generateHeaderName = (type: string) => {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    cursor: 'pointer',
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        marginRight: '5px',
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        '&:hover': {
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                theme.palette.action.hoverOpacity
                            ),
                        },
                    }}
                >
                    {areAllCheckboxesSelected(type) ? (
                        <CheckBoxIcon
                            fontSize="medium"
                            color="primary"
                            data-testid={`ColumnCheckboxCheckedType${type}`}
                        />
                    ) : areNoCheckboxesSelected(type) ? (
                        <CheckBoxOutlineBlankIcon
                            fontSize="medium"
                            data-testid={`ColumnCheckboxUncheckedType${type}`}
                        />
                    ) : (
                        <IntermediateCheckBoxIcon
                            fontSize="medium"
                            color="primary"
                            data-testid={`ColumnCheckboxIntermediateType${type}`}
                        />
                    )}
                </Box>
                {type}
            </div>
        );
    };

    type CustomCheckboxProps = {
        isChecked: boolean;
        handleChecked: MouseEventHandler<HTMLButtonElement>;
    };
    /**
     * A customized MUI Checkbox.
     *
     * @param props Props for the MUI Checkbox
     * @returns JSX with the customized Checkbox
     */
    const CustomCheckbox: FC<CustomCheckboxProps> = ({ isChecked, handleChecked }) => {
        return (
            <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
            >
                <Checkbox
                    size="medium"
                    checked={isChecked}
                    onClick={handleChecked}
                    sx={{ ml: '4px' }}
                />
            </div>
        );
    };

    type CellCheckboxProps = { row: { id: number } };
    /**
     * Creates a checkbox for a specific cell in the data grid.
     *
     * @function
     * @param params The params containing metadata about the row
     * @param type The type of the selection (e.g. visible)
     * @returns JSX element with the customized Cell-Checkbox
     */
    const createCellCheckBox = (params: CellCheckboxProps, type: string) => {
        const checkedList = getCheckedListByType(type);
        const setter = getCheckedSetterByType(type);
        return (
            <div data-testid={`CellCheckboxRow${params.row.id}Type${type}`}>
                <CustomCheckbox
                    isChecked={checkedList[params.row.id]}
                    handleChecked={() => {
                        const checkedHandler = handleChecked(checkedList, setter);
                        checkedHandler(params.row.id);
                    }}
                />
            </div>
        );
    };

    useEffect(() => {
        setIsVisible(modelList.map((model) => modelData[model].isVisible));
        setMeanVisible(modelList.map((model) => modelData[model].mean));
        setStdVisible(modelList.map((model) => modelData[model][std]));
        setMedianVisible(modelList.map((model) => modelData[model].median));
        setPercentileVisible(modelList.map((model) => modelData[model].percentile));
    }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    /** An array containing the specification for the columns of the data grid. */
    const columns: GridColDef[] = [
        { field: 'project', headerName: 'Project', width: 120, editable: false },
        { field: 'institute', headerName: 'Institute', width: 150, editable: false },
        { field: 'model', headerName: 'Model', width: 225, editable: false },
        {
            field: mean,
            headerName: 'Mean',
            sortable: false,
            width: 140,
            //disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName('Mean'),
            renderCell: (params: CellCheckboxProps) => {
                return createCellCheckBox(params, 'Mean');
            },
        },
        {
            field: std,
            headerName: 'Standard deviation',
            sortable: false,
            width: 200,
            //disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName('Standard deviation'),
            renderCell: (params: CellCheckboxProps) => {
                return createCellCheckBox(params, 'Standard deviation');
            },
        },
        {
            field: median,
            headerName: 'Median',
            sortable: false,
            width: 140,
            //disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName('Median'),
            renderCell: (params: CellCheckboxProps) => {
                return createCellCheckBox(params, 'Median');
            },
        },
        {
            field: 'percentile',
            headerName: 'Percentile',
            width: 150,
            sortable: false,
            //disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName('Percentile'),
            renderCell: (params: CellCheckboxProps) => {
                return createCellCheckBox(params, 'Percentile');
            },
        },
        {
            field: 'visible',
            headerName: 'Visible',
            sortable: false,
            width: 140,
            //disableClickEventBubbling: true,
            renderHeader: () => generateHeaderName('Visible'),
            renderCell: (params: CellCheckboxProps) => {
                return createCellCheckBox(params, 'Visible');
            },
        },
    ];

    return (
        <>
            <Modal
                open={isOpen}
                onClose={closeModal}
                aria-labelledby="EditModelGroupModal-modal"
                data-testid="EditModelGroupModal-modal-wrapper"
            >
                <Card sx={cardStyle}>
                    <CardHeader
                        title={editModalLabel}
                        action={
                            <IconButton
                                onClick={closeModal}
                                aria-label="close"
                                data-testid="DiscardButton"
                            >
                                <CloseIcon />
                            </IconButton>
                        }
                    />
                    <div style={{ width: '95%' }}>
                        <SearchBar inputArray={rows} onFilteredItems={onFilteredItems} />
                    </div>
                    <StyledDataGrid
                        rows={filteredRows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        onColumnHeaderClick={columnHeaderClick}
                        disableColumnMenu
                        columnBuffer={8}
                        sx={{ height: '65%' }}
                    />
                    <CardActions sx={{ justifyContent: 'flex-end', marginTop: '2%' }}>
                        <Button
                            onClick={applyChanges}
                            variant="contained"
                            data-testid="ApplyButton"
                        >
                            {applyButtonLabel}
                        </Button>
                    </CardActions>
                </Card>
            </Modal>
            <DiscardChangesModal
                isOpen={discardChangesOpen}
                onClose={closeDiscardChangesDialog}
                saveChanges={applyChanges}
                discardChanges={() => undefined}
                closeDialog={() => setDiscardChangesOpen(false)}
            />
        </>
    );
};

export default EditModelGroupModal;
