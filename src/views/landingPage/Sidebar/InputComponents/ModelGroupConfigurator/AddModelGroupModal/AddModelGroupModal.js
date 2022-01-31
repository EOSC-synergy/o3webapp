import React, { useEffect } from "react";
import { setModelsOfModelGroup } from "../../../../../../store/modelsSlice/modelsSlice";
import { useTheme } from '@mui/material/styles';
import { CardContent, Divider, IconButton, Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { Card } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import CardHeader from '@mui/material/CardHeader';
import Searchbar from "../Searchbar/Searchbar";
import { convertModelName } from "../../../../../../utils/ModelNameConverter";
import { union, not, intersection } from "../../../../../../utils/arrayOperations";
import CloseIcon from '@mui/icons-material/Close';
import Alert from "@mui/material/Alert";
import PropTypes from 'prop-types'; 
import { useDispatch, useSelector } from "react-redux";
import { REQUEST_STATE } from "../../../../../../services/API/apiSlice";

/**
 * opens a modal where the user can add a new model group
 * @param {Object} props 
 * @param {function} props.onClose -> function to call if modal should be closed
 * @param {boolean} props.isOpen -> boolean whether the modal should be visible
 * @param {function} props.reportError -> error handling
 * @returns {JSX} a jsx containing a modal with a transfer list with all available models
 */
function AddModelGroupModal(props) {
    
    const dispatch = useDispatch();

    const modelListRequestedData = useSelector(state => state.api.models);

    let isLoading = true;
    let allModels = [];
    if (modelListRequestedData.status === REQUEST_STATE.idle
        || modelListRequestedData.status === REQUEST_STATE.loading) {
            isLoading = true;
    }
    else if (modelListRequestedData.status === REQUEST_STATE.success) {
        allModels = modelListRequestedData.data;
        isLoading = false;
    }

    useEffect(() => {
        if (modelListRequestedData.status === REQUEST_STATE.error) {
            props.reportError("API not responding: " + modelListRequestedData.error);
        }
        if (modelListRequestedData.status === REQUEST_STATE.success) {
            setVisible(modelListRequestedData.data);
        }
    });

    /**
     * Array containing all currently checked models
     */
    const [checked, setChecked] = React.useState([]);
    /**
     * Array containing all models, that are currently plotted in the right transfer list
     * -> models that should eventually be added
     */
    const [right, setRight] = React.useState([]);
    /**
     * Array containing all models that should currently be visibile
     * because of the search function those might differ from all models
     */
    const [visible, setVisible] = React.useState([]);
    /**
     * The currently enetered group name
     */
    const [groupName, setGroupName] = React.useState('');
    const theme = useTheme();

    

    /**
     * Returns how many models in the provided array are currently checked
     * @param {Array} models models to check
     * @returns the number of checked models in models
     */
    const numberOfChecked = (models) => intersection(checked, models).length;
    /**
     * All models that are currently on the left side
     * -> all models that are not currently on the right side are on the left side
     */
    const left = not(allModels, right);
    /**
     * An array containing all models that are currently on the left side and are checked
     */
    const leftChecked = intersection(checked, left);
    /**
     * An array containing all models that are currently on the right side and are checked
     */
    const rightChecked = intersection(checked, right);
    /**
     * An array containing all models that are currently on the left side and are visible
     */
    const leftVisible = intersection(visible, left);
    /**
     * An array containing all models that are currently on the right side and are visible
     */
    const rightVisible = intersection(visible, right);

    /**
     * Toggles one element
     * i.e. checks the element if it had not been checked before
     * and unchecks it if it has been checked
     * @param {String} value the id of the model that has been clicked
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
     */
    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    /**
     * moves all checked models from the right list to the left and unchecks them
     * -> appends all leftChecked models to the right array and removes them from the checked array
     */
    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setChecked(not(checked, leftChecked));
    };

    /**
     * moves all checked models from the left to right and unchecks them
     * -> removes all rightChecked models from the right and checked array
     */
    const handleCheckedLeft = () => {
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const addNewGroup = () => {
        // props.id
        dispatch(setModelsOfModelGroup({groupId: null, groupName: groupName, modelList: right}));
        props.onClose();
    }

    /**
     * sets the currently visible models by a provided array of indices
     * ! overwrites old visibilities
     * @param {Array} indices array of indices that should be currently visible
     */
    const setCurrentlyVisibleModelsByIndex = (indices) => {
        let newFilteredModelsIdx = [];
        for (let idx in indices) {
            if (idx > 0 && idx < allModels.length) {
                newFilteredModelsIdx.push(allModels[idx]);
            }
        }
        setVisible(newFilteredModelsIdx);
    }

    /**
     * renders a custom transfer list component with provided lists
     * @param {Array} models array of modelIDs that belong to the list
     * @param {Array} modelsChecked array of modelIDs that are currently checked
     * @param {Array} modelsVisible array of modelIDS that are currently visible
     * @returns {JSX.Element} a Card containing a custom transfer list and a warning if checked models are currently not visible
     */
    const customList = (models, modelsChecked, modelsVisible) => {
        const modelsCheckedInvisible = intersection(not(models, modelsVisible), modelsChecked);
        return (
            <Card>
                <CardHeader
                    sx={{ px: 2, py: 1 }}
                    avatar={
                        <Checkbox
                            onClick={handleToggleAll(modelsVisible)}
                            checked={numberOfChecked(modelsVisible) === modelsVisible.length && modelsVisible.length !== 0}
                            indeterminate={
                                numberOfChecked(modelsVisible) !== modelsVisible.length && numberOfChecked(modelsVisible) !== 0
                            }
                            disabled={modelsVisible.length === 0}
                            inputProps={{
                                'aria-label': 'all items selected',
                            }}
                        />
                    }
                    title={`${numberOfChecked(modelsVisible)}/${modelsVisible.length} selected`}
                />
                <Divider />
                <List
                    sx={{
                        width: "100%",
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
                                <ListItem
                                    key={idx}
                                    role="listitem"
                                    button
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
                                <ListItemText id={labelId} primary={model.name} secondary={`institute: ${model.institute}\nproject: ${model.project}`} />
                                </ListItem>
                            );
                    })}
                </List>
                    {
                        modelsCheckedInvisible
                        &&
                        modelsCheckedInvisible.length > 0 
                        &&
                        <Alert severity="warning">
                            Currently {modelsCheckedInvisible.length} hidden model{modelsCheckedInvisible.length > 1 ? 's are' : ' is'} checked.
                        </Alert>
                    }
            </Card>
        );
    }   

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        bgcolor: theme.palette.grey[200],
        boxShadow: 24,
        p: 4,
        overflow: 'auto',
        maxHeight: "100vh"
      };

    /**
     * updates the current group name
     * @param {event} event the event that called this function
     */
    const updateGroupName = (event) => {
        setGroupName(event.target.value);
    }

    /**
     * @todo open a "discard changes?" popup here
     */
    const closeWithChanges = () => {
        props.onClose();
    }

    return (
        <Modal
            open={props.isOpen}
            onClose={closeWithChanges}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >   
            <Card sx={style}>
                <CardHeader
                    title="Add a new model group"
                    action={
                        <IconButton onClick={closeWithChanges} aria-label="close" data-testid="addModelGroupModal-close-button">
                            <CloseIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <Grid container alignItems="center" justifyContent="center" style={{marginBottom: '2em'}}>
                        <TextField
                            defaultValue={groupName}
                            helperText="The name will only appear in the legend of the exported plot."
                            variant="standard"
                            onBlur={updateGroupName}
                            sx={{marginBottom: '0.5em', marginLeft: '0.5em'}}
                            placeholder="Your group"
                        />
                    </Grid>
                    <Divider>
                        <Typography> Select Models</Typography>
                    </Divider>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>
                        <Searchbar inputArray={allModels} foundIndicesCallback={setCurrentlyVisibleModelsByIndex} />
                        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: '0.5em' }}>
                            <Grid item sm={5} xs={12}>
                                <Typography>All available models</Typography>
                                {
                                    isLoading ? 
                                        <CircularProgress data-testid="AddModelGroupModal-spinner-left" />
                                    :
                                        customList(left, leftChecked, leftVisible)
                                }
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
                            <Grid item sm={5} xs={12}>
                                <Typography>Models in {groupName ? groupName : "your group"}</Typography>
                                {
                                    isLoading ? 
                                        <CircularProgress data-testid="AddModelGroupModal-spinner-right" />
                                    :
                                        customList(right, rightChecked, rightVisible)
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
                <CardActions sx={{justifyContent: "flex-end"}}>
                    <Button onClick={addNewGroup} variant="contained">Add group</Button>
                </CardActions>
            </Card>
        </Modal>
    );
}


AddModelGroupModal.propTypes = {
    reportError: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
}


export default AddModelGroupModal;