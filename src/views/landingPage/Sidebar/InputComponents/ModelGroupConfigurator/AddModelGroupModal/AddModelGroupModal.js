import React, { useEffect } from 'react';
import { setModelsOfModelGroup } from '../../../../../../store/modelsSlice';
import { useTheme } from '@mui/material/styles';
import { CardContent, Divider, IconButton, ListItemButton, Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { Card } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import CardHeader from '@mui/material/CardHeader';
import Searchbar from '../../../../../../components/SearchBar';
import { convertModelName } from '../../../../../../utils/ModelNameConverter';
import { union, not, intersection } from '../../../../../../utils/arrayOperations';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import DiscardChangesModal from '../../../../../../components/DiscardChangesModal';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, useStore } from 'react-redux';
import {
    fetchPlotDataForCurrentModels,
    REQUEST_STATE,
} from '../../../../../../services/API/apiSlice/apiSlice';
import { selectNameOfGroup, selectModelDataOfGroup } from '../../../../../../store/modelsSlice';

/**
 * Opens a modal where the user can add a new model group.
 * Used in {@link ModelGroupConfigurator}.
 *
 * @component
 * @param {Object} props specified in propTypes
 * @returns {JSX.Element} a jsx containing a modal with a transfer list with all available models
 * @component AddModelGroupModal
 */
function AddModelGroupModal(props) {
    const store = useStore();

    /**
     * True if the Modal is open in the "Edit Mode".
     * @constant {boolean}
     */
    const isEditMode = 'modelGroupId' in props;

    /**
     * The label in the card heading.
     * @constant {string}
     */
    const addModelLabel = isEditMode ? 'Edit Model Group Members' : 'Add Model Group';

    /**
     * A function to dispatch actions to the redux store.
     * @function
     */
    const dispatch = useDispatch();

    /**
     * Selected modelList data.
     * @constant {Object}
     */
    const modelListRequestedData = useSelector((state) => state.api.models);

    let isLoading = true;
    let allModels = [];
    if (
        modelListRequestedData.status === REQUEST_STATE.idle ||
        modelListRequestedData.status === REQUEST_STATE.loading
    ) {
        isLoading = true;
    } else if (modelListRequestedData.status === REQUEST_STATE.success) {
        allModels = modelListRequestedData.data;
        isLoading = false;
    }

    /**
     * The Id of the currently open model group.
     * If the modal is opened in the "Edit Mode" the value is set to -1.
     * @constant {number}
     */
    const modelGroupId = isEditMode ? props.modelGroupId : -1;

    /**
     * Array containing all currently checked models.
     * @constant {Array}
     */
    const [checked, setChecked] = React.useState([]);
    /**
     * Array containing all models, that are currently plotted in the right transfer list
     * -> models that should eventually be added
     * @constant {Array}
     */
    const storeRight = Object.keys(
        useSelector((state) => selectModelDataOfGroup(state, modelGroupId))
    );
    const [right, setRight] = React.useState(storeRight);

    /**
     * Array containing all models that should currently be visibile
     * because of the search function those might differ from all models.
     * @constant {Array}
     */
    const [visible, setVisible] = React.useState([]);
    /**
     * The currently enetered group name.
     * @constant {string}
     */
    const storeGroupName = useSelector((state) => selectNameOfGroup(state, modelGroupId));
    const [groupName, setGroupName] = React.useState(storeGroupName);

    /**
     * Stores the error message if an error occured.
     * @constant {string}
     */
    const [errorMessage, setErrorMessage] = React.useState('');

    /**
     * The object containing the information about the theming of the webapp
     * @constant {Object}
     */
    const theme = useTheme();
    /**
     * reportError function provided by props.
     * Stored separetly in order to pass it to useEffect
     * @function
     */
    const reportError = props.reportError;

    const openDiscardChangesDialog = () => setDiscardChangesOpen(true);

    const closeDiscardChangesDialog = () => {
        setDiscardChangesOpen(false);
        props.setOpen(false);
    };

    useEffect(() => {
        if (modelListRequestedData.status === REQUEST_STATE.error) {
            reportError('API not responding: ' + modelListRequestedData.error);
        }
        if (modelListRequestedData.status === REQUEST_STATE.success) {
            setVisible(modelListRequestedData.data);
        }
    }, [allModels]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (props.isOpen && props.refresh) {
            setGroupName(storeGroupName);
            setVisible(allModels);
            setChecked([]);
            setRight(storeRight);
            setErrorMessage('');
        }
    }, [props.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Returns how many models in the provided array are currently checked
     * @param {Array} models models to check
     * @returns the number of checked models in models
     * @function
     */
    const numberOfChecked = (models) => intersection(checked, models).length;
    /**
     * All models that are currently on the left side
     * -> all models that are not currently on the right side are on the left side
     * @constant {Array}
     */
    const left = not(allModels, right);
    /**
     * An array containing all models that are currently on the left side and are checked
     * @constant {Array}
     */
    const leftChecked = intersection(checked, left);
    /**
     * An array containing all models that are currently on the right side and are checked
     * @constant {Array}
     */
    const rightChecked = intersection(checked, right);
    /**
     * An array containing all models that are currently on the left side and are visible
     * @constant {Array}
     */
    const leftVisible = intersection(visible, left);
    /**
     * An array containing all models that are currently on the right side and are visible
     * @constant {Array}
     */
    const rightVisible = intersection(visible, right);

    /**
     * This state tracks whether the discard changes modal is currently visible.
     * @default false
     */
    const [discardChangesOpen, setDiscardChangesOpen] = React.useState(false);

    /**
     * Toggles one element
     * i.e. checks the element if it had not been checked before
     * and unchecks it if it has been checked
     * @param {String} value the id of the model that has been clicked
     * @function
     */
    const handleChangeElement = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    /**
     * Toggles whole list of elements
     * i.e. checks all if one element in items has not been checked before
     * and unchecks all if all elements in items have been checked
     * @param {Array} items array containing model ids to check / uncheck
     * @function
     */
    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    /**
     * Moves all checked models from the right list to the left and unchecks them
     * -> Appends all leftChecked models to the right array and removes them from the checked array
     * @function
     */
    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setChecked(not(checked, leftChecked));
    };

    /**
     * Moves all checked models from the left to right and unchecks them
     * -> Removes all rightChecked models from the right and checked array
     * @function
     */
    const handleCheckedLeft = () => {
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    /**
     * Function that is called if the the changes of a existing model group need to be applied
     * or a new model group has to be added.#d3d3d3
     * @function
     */
    const addOrEditGroup = () => {
        if (groupName === '') {
            setErrorMessage('Please provide a model group name');
            return false;
        }
        if (right.length === 0) {
            setErrorMessage('Please provide a list of models for this group');
            return false;
        }
        dispatch(
            setModelsOfModelGroup({
                groupId: props.modelGroupId,
                groupName: groupName,
                modelList: right,
            })
        );
        dispatch(fetchPlotDataForCurrentModels());
        props.onClose();
        return true;
    };

    /**
     * Sets the currently visible models by a provided array of indices.
     * It also overwrites old visibilities.
     * @param {Array} visibleModels array of models that should be currently visible
     * @function
     */
    const setCurrentlyVisibleModels = (visibleModels) => {
        setVisible(visibleModels);
    };

    /**
     * Tries to safe the current made changes, if this fails it re-opens the modal once again
     * to enable the user to correct the mistake
     * @function
     */
    const saveChanges = () => {
        const success = addOrEditGroup();
        if (!success) {
            props.setOpen(false); // re-open because saving failed
        }
    };

    /**
     * Renders a custom transfer list component with provided lists
     * @param {Array} models array of modelIDs that belong to the list
     * @param {Array} modelsChecked array of modelIDs that are currently checked
     * @param {Array} modelsVisible array of modelIDS that are currently visible
     * @returns {JSX.Element} a Card containing a custom transfer list and a warning if checked models are currently not visible
     * @function
     */
    const customList = (models, modelsChecked, modelsVisible) => {
        const modelsCheckedInvisible = intersection(not(models, modelsVisible), modelsChecked);
        return (
            <Card sx={{ backgroundColor: theme.palette.background.paper }}>
                <CardHeader
                    sx={{ px: 2, py: 1 }}
                    avatar={
                        <Checkbox
                            onClick={handleToggleAll(modelsVisible)}
                            checked={
                                numberOfChecked(modelsVisible) === modelsVisible.length &&
                                modelsVisible.length !== 0
                            }
                            indeterminate={
                                numberOfChecked(modelsVisible) !== modelsVisible.length &&
                                numberOfChecked(modelsVisible) !== 0
                            }
                            disabled={modelsVisible.length === 0}
                            inputProps={{
                                'aria-label': 'all items selected',
                                'data-testid': 'AddModelGroupModal-select-all',
                            }}
                        />
                    }
                    title={`${numberOfChecked(modelsVisible)}/${modelsVisible.length} selected`}
                />
                <Divider />
                <List
                    sx={{
                        width: '100%',
                        height: 230,
                        bgcolor: 'background.paper',
                        overflow: 'auto',
                    }}
                    dense
                    component="div"
                    role="list"
                >
                    {modelsVisible.map((modelId, idx) => {
                        const labelId = `transfer-list-all-item-${modelId}-label`;
                        let model = convertModelName(modelId);
                        return (
                            <ListItemButton
                                key={idx}
                                role="listitem"
                                onClick={handleChangeElement(modelId)}
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checked.indexOf(modelId) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{
                                            'aria-labelledby': labelId,
                                        }}
                                        data-testid={`AddModelGroupModal-transfer-list-item-${labelId}-checkbox`}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={labelId}
                                    primary={model.name}
                                    secondary={`Institute: ${model.institute}\nProject: ${model.project}`}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>
                {modelsCheckedInvisible && modelsCheckedInvisible.length > 0 && (
                    <Alert severity="warning">
                        Currently {modelsCheckedInvisible.length} hidden model
                        {modelsCheckedInvisible.length > 1 ? 's are' : ' is'} checked.
                    </Alert>
                )}
            </Card>
        );
    };

    /**
     * Style of the modal.
     * @constant {Object}
     */
    const style = {
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
     * Updates the current group name.
     * @param {Object} event    The event that called this function
     * @function
     */
    const updateGroupName = (event) => {
        setGroupName(event.target.value);
    };

    /**
     * This function is called if the modal is closed and the changes have to be discarded.
     * Discards all changes made since the modal was last opened.
     * @returns {boolean} whether the user made changes to the current model group
     * @function
     */
    const hasChanges = () => {
        if (!isEditMode) {
            return groupName !== '' || right.length !== 0;
        }

        // compare group name
        const modelGroupName = selectNameOfGroup(store.getState(), modelGroupId);
        if (modelGroupName !== groupName) {
            return true;
        }

        // compare model list (equality not identity)
        const modelGroupNames = Object.keys(selectModelDataOfGroup(store.getState(), modelGroupId));
        if (modelGroupNames.length !== right.length) {
            return true;
        }
        for (let idx in right) {
            if (modelGroupNames[idx] !== right[idx]) {
                return true;
            }
        }

        return false;
    };

    /**
     * Default handler that is called when the modal is closed when clicking outside of the modal
     * or by clicking the close icon.
     * @function
     */
    const closeModal = () => {
        if (hasChanges()) {
            // made changes, reset
            props.onClose();
            openDiscardChangesDialog();
        } else {
            // no changes made
            props.onClose();
        }
    };

    return (
        <React.Fragment>
            <Modal
                open={props.isOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                data-testid="AddModelGroupModal-modal-wrapper"
            >
                <Card sx={style}>
                    <CardHeader
                        title={addModelLabel}
                        action={
                            <IconButton
                                onClick={closeModal}
                                aria-label="close"
                                data-testid="addModelGroupModal-close-button"
                            >
                                <CloseIcon />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                            style={{ marginBottom: '2em' }}
                        >
                            <TextField
                                defaultValue={groupName}
                                helperText="The name will only appear in the legend of the exported plot."
                                variant="standard"
                                onBlur={updateGroupName}
                                sx={{ marginBottom: '0.5em', marginLeft: '0.5em' }}
                                placeholder="Your group"
                                inputProps={{ 'data-testid': 'AddModelGroupModal-card-group-name' }}
                            />
                        </Grid>
                        <Box id="modal-modal-description" sx={{ mt: 2 }}>
                            <Searchbar
                                inputArray={allModels}
                                foundIndicesCallback={setCurrentlyVisibleModels}
                                shouldReturnValues={true}
                            />
                            <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                                sx={{ marginTop: '0.5em' }}
                            >
                                <Grid
                                    item
                                    sm={5}
                                    xs={12}
                                    data-testid="AddModelGroupModal-card-header-left"
                                >
                                    <Typography>All Available Models</Typography>
                                    {isLoading ? (
                                        <CircularProgress data-testid="AddModelGroupModal-spinner-left" />
                                    ) : (
                                        customList(left, leftChecked, leftVisible)
                                    )}
                                </Grid>
                                <Grid item sm={2} xs={12}>
                                    <Grid container direction="column" alignItems="center">
                                        <Button
                                            sx={{ my: 0.5 }}
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCheckedRight}
                                            disabled={leftChecked.length === 0}
                                            aria-label="move selected right"
                                            data-testid="AddModelGroupModal-button-move-allChecked-right"
                                        >
                                            &gt;
                                        </Button>
                                        <Button
                                            sx={{ my: 0.5 }}
                                            variant="outlined"
                                            size="small"
                                            onClick={handleCheckedLeft}
                                            disabled={rightChecked.length === 0}
                                            aria-label="move selected left"
                                            data-testid="AddModelGroupModal-button-move-allChecked-left"
                                        >
                                            &lt;
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    sm={5}
                                    xs={12}
                                    data-testid="AddModelGroupModal-card-header-right"
                                >
                                    <Typography>
                                        Models in {groupName ? groupName : 'your group'}
                                    </Typography>
                                    {isLoading ? (
                                        <CircularProgress data-testid="AddModelGroupModal-spinner-right" />
                                    ) : (
                                        customList(right, rightChecked, rightVisible)
                                    )}
                                </Grid>
                            </Grid>
                        </Box>
                        {errorMessage && (
                            <Alert severity="error" sx={{ marginTop: '2em' }}>
                                {errorMessage}
                            </Alert>
                        )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', marginTop: '2%' }}>
                        <Button
                            onClick={addOrEditGroup}
                            variant="contained"
                            data-testid="AddModelGroupModal-save-button"
                        >
                            {isEditMode ? 'Save Changes' : 'Add group'}
                        </Button>
                    </CardActions>
                </Card>
            </Modal>
            <DiscardChangesModal
                isOpen={discardChangesOpen}
                onClose={closeDiscardChangesDialog}
                saveChanges={saveChanges}
                discardChanges={() => undefined}
                closeDialog={() => setDiscardChangesOpen(false)}
            />
        </React.Fragment>
    );
}

AddModelGroupModal.propTypes = {
    /**
     * Function for error handling
     */
    reportError: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    /**
     * Function to call if modal should be closed
     */
    setOpen: PropTypes.func.isRequired,
    /**
     * Boolean whether the modal should be visible
     */
    refresh: PropTypes.bool.isRequired,
    /**
     * Number identifying the model group,
     * if this model should be used to edit an existing model group
     */
    modelGroupId: PropTypes.number,
};

export default AddModelGroupModal;
