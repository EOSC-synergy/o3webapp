import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiVisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import {Checkbox, Divider, IconButton, FormControlLabel} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditModelGroupModal from "../EditModelGroupModal/EditModelGroupModal";
import AddModelGroupModal from "../AddModelGroupModal/AddModelGroupModal";
import PropTypes from 'prop-types';
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {CardActions, Button} from '@mui/material';
import {
    setStatisticalValueForGroup,
    selectStatisticalValueSettingsOfGroup,
    selectNameOfGroup,
    setVisibilityForGroup,
    selectVisibilityOfGroup,
    deleteModelGroup
} from "../../../../../../store/modelsSlice/modelsSlice";
import {STATISTICAL_VALUES} from "../../../../../../utils/constants";

/**
 * A card containing information about a model group.
 * Used in {@link ModelGroupConfigurator}.
 * 
 * @component
 * @param {Object} props specified in propTypes
 * @returns {JSX.Element} a jsx containing a modal with a data grid with all models from the model group
 */
function ModelGroupCard(props) {

         
    /**
     * Dispatcher to dispatch the plot name change action.
     * @constant {function}
    */
    const dispatch = useDispatch();

    /**
     * the name of the model group. Retrieved from the Redux Store
     * @see {@link selectNameOfGroup}
     * @constant {Array}
     */
    const modelGroupName = useSelector(state => selectNameOfGroup(state, props.modelGroupId));
    
    /**
     * gets the statisticalVales of the model Group. Retrieved from the Redux Store.
     * @see {@link selectStatisticalValueSettingsOfGroup}
     * @constant {Object}
     */
    const modelGroupStatisticalValue = useSelector(state => selectStatisticalValueSettingsOfGroup(state, props.modelGroupId));
   
    /**
     * whether the model group is currenly visible or not. Retrieved from the Redux Store.
     * @see {@link selectVisibilityOfGroup}
     * @constant {boolean}
     */
    const isModelGroupVisible = useSelector(state => selectVisibilityOfGroup(state, props.modelGroupId));

    /**
     * Toggles the visibility of the given statistical value
     * by dispatching an action to the redux store.
     *
     * @param {Event} event the event that called this function
     * @param {String} statisticalValue the name of the statistical value that should be toggled
     * @function
     */
    const toggleModelGroupStatisticalValueVisibility = (event, statisticalValue) => {
        dispatch(setStatisticalValueForGroup(
            {groupId: props.modelGroupId, svType: statisticalValue, isIncluded: event.target.checked}
        ));
    }

    /**
     * Toggles the visibility of the whole group in the graph
     * by dispatching an action to the redux store.
     * @function
     */
    const toggleModelGroupVisibility = () => {
        dispatch(setVisibilityForGroup({groupId: props.modelGroupId, isVisible: !isModelGroupVisible}));
    }

    /**
     * State to keep track of whether the edit group modal is currently visible or not.
     * @constant {Array}
     * @default false
     */
    const [isEditModalVisible, setEditModalVisible] = React.useState(false);

    /**
     * State to keep track of whether the add group modal (used to edit group members) is currently visible or not.
     * @constant {Array}
     * @default false
     */
    const [isAddModalVisible, setAddModalVisible] = React.useState(false);

    /**
     * State to keep track of whether a delete request is open or not.
     * @constant {Array}
     * @default false
     */
    const [isDeleteRequest, setDeleteRequest] = React.useState(false);

    /**
     * Shows the edit group modal.
     * @cfunction
     */
    const showEditModal = () => {
        setAddModalVisible(false);  // avoid two modals being visible under all circumstances
        setEditModalVisible(true);
    }

    /**
     * Closes the edit modal.
     * @function
     */
    const closeEditModal = () => {
        setEditModalVisible(false);
    }

    /**
     * Shows the add model group modal (used to edit group members).
     * @function
     */
    const showAddModal = () => {
        setEditModalVisible(false);  // avoid two modals being visible under all circumstances
        setAddModalVisible(true);
    }

    /**
     * Closes the add model group modal (used to edit group members).
     * @function
     */
    const closeAddModal = () => {
        setAddModalVisible(false);
    }

    /**
     * Returns the visibility icon, depending on whether the group is currently visible or not.
     * @function
     * @returns {JSX.Element} JSX containing an icon of an open or closed eye depending on isModelGroupVisible
     */
    const VisibilityIcon = () => {
        return isModelGroupVisible ? <MuiVisibilityIcon data-testid="ModelGroupCard-VisibilityIcon-visible"/> :
            <VisibilityOffIcon data-testid="ModelGroupCard-VisibilityIcon-invisible"/>
    }

    /**
     * Toggles the visibility of the delete request card.
     * Always sets it to the opposite of what it is now.
     * @function
     */
    const toggleDeleteRequest = () => {
        setDeleteRequest(!isDeleteRequest);
    }

    /**
     * Deletes a model group.
     * Dispatches the deletion to Redux with the group id of the model group card.
     * @function
     */
    const deleteGroup = () => {
        toggleDeleteRequest();
        dispatch(deleteModelGroup({groupId: props.modelGroupId}));
    }

    if (!isDeleteRequest) {
        return (
            <Card style={{margin: "3%", padding: '2%', width: '300px', height: '210px'}} elevation={2}>
                <EditModelGroupModal modelGroupId={props.modelGroupId} isOpen={isEditModalVisible}
                                     onClose={closeEditModal}/>
                <AddModelGroupModal modelGroupId={props.modelGroupId} isOpen={isAddModalVisible} onClose={closeAddModal}
                                    reportError={props.reportError}/>
                <Grid container>
                    <Grid item xs={2}>
                        <IconButton aria-label="change visibility"
                                    onClick={toggleModelGroupVisibility}><VisibilityIcon/></IconButton>
                    </Grid>
                    <Grid item xs={8} textAlign="center">
                        <Typography variant="h6" data-testid="ModelGroupCard-groupName">{modelGroupName}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton aria-label="delete model group"
                                    onClick={toggleDeleteRequest}
                                    data-testid="ModelGroupCard-delete-model-group"
                                    ><DeleteIcon/></IconButton>
                    </Grid>
                </Grid>
                <Divider/>
                <Grid container sx={{paddingTop: '0.5em'}}>
                    {Object.keys(STATISTICAL_VALUES).map((key, idx) => {
                        return (
                            <Grid item key={idx} xs={6} sx={{paddingLeft: '1em'}}>
                                <FormControlLabel
                                    label={key}
                                    id={`ModelGroupCard-toggle-${key}-label`}
                                    control={
                                        <Checkbox
                                            onChange={
                                                event => toggleModelGroupStatisticalValueVisibility(event, key)
                                            }
                                            checked={modelGroupStatisticalValue[key]}
                                            id={`ModelGroupCard-toggle-${key}-checkbox`}
                                            labelid={`ModelGroupCard-toggle-${key}-label`}
                                            data-testid={`ModelGroupCard-toggle-${key}-checkbox`}
                                        />
                                    }
                                />
                            </Grid>
                        );
                    })}
                </Grid>
                <Divider/>
                <CardActions>
                    <Button size="small" variant="outlined" onClick={showEditModal}
                            data-testid="ModelGroupCard-EditModelGroupModal-button-open">
                        Edit statistical values
                    </Button>
                    <Button size="small" variant="outlined" onClick={showAddModal}
                            data-testid="ModelGroupCard-AddModelGroupModal-button-open">
                        Edit group members
                    </Button>
                </CardActions>
            </Card>
        )
    } else {
        return (
            <Card
                style={{
                    margin: "3%",
                    padding: '2%',
                    width: '300px',
                    height: '210px',
                }}
                elevation={2}
                justifyContent="center"
                alignItems="center"
            >
                <Grid container sx={{mt: '60px'}}>
                    <Grid item xs={12} sx={{mb: '5px', textAlign: "center"}}>
                        <Typography variant="h6">
                            Delete this model group?
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{mt: '5px', textAlign: "center"}}>
                        <Button
                            size="medium"
                            variant="outlined"
                            onClick={toggleDeleteRequest}
                            sx={{
                                mr: '10px'
                            }}
                            data-testid="ModelGroupCard-delete-model-keep"
                        >
                            Keep
                        </Button>
                        <Button
                            size="medium"
                            variant="filled"
                            onClick={deleteGroup}
                            sx={{
                                ml: '10px',
                                color: 'black',
                                backgroundColor: '#fed136',
                                '&:hover': {
                                    backgroundColor: '#b19225'
                                }
                            }}
                            data-testid="ModelGroupCard-delete-model-delete"
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        );
    }

}


ModelGroupCard.propTypes = {
    /**
     * function for error handling
     */
    modelGroupId: PropTypes.number.isRequired,
    /**
     * id of the model group
     */
    reportError: PropTypes.func.isRequired
}

export default ModelGroupCard;