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
 * A card containing information about a modal group.
 * @param {Object} props
 * @param {String} props.reportError - error function
 * @param {int} props.modelGroupId -> id of the model group
 * @returns {JSX.Element} a jsx containing a modal with a data grid with all models from the model group
 */
function ModelGroupCard(props) {

    const dispatch = useDispatch();
    const modelGroupName = useSelector(state => selectNameOfGroup(state, props.modelGroupId));
    const modelGroupStatisticalValue = useSelector(state => selectStatisticalValueSettingsOfGroup(state, props.modelGroupId));
    const isModelGroupVisible = useSelector(state => selectVisibilityOfGroup(state, props.modelGroupId));

    /**
     * toggles the visibility of the given statistical value
     * by dispatching an action to the redux store
     * @param {event} event the event that called this function
     * @param {string} statisticalValue the name of the statistical value that should be toggled
     */
    const toggleModelGroupStatisticalValueVisibility = (event, statisticalValue) => {
        dispatch(setStatisticalValueForGroup(
            {groupId: props.modelGroupId, svType: statisticalValue, isIncluded: event.target.checked}
        ));
    }

    /**
     * toggles the visibility of the whole group in the graph
     * by dispatching an action to the redux store
     */
    const toggleModelGroupVisibility = () => {
        dispatch(setVisibilityForGroup({groupId: props.modelGroupId, isVisible: !isModelGroupVisible}));
        for (const key in STATISTICAL_VALUES) {
            dispatch(setStatisticalValueForGroup(
                {groupId: props.modelGroupId, svType: key, isIncluded: !isModelGroupVisible}
            ));
        }
    }

    /**
     * state to keep track of whether the edit group modal is currently visible or not
     */
    const [isEditModalVisible, setEditModalVisible] = React.useState(false);
    /**
     * state to keep track of whether the add group modal (used to edit group members) is currently visible or not
     */
    const [isAddModalVisible, setAddModalVisible] = React.useState(false);

    const [isDeleteRequest, setDeleteRequest] = React.useState(false);

    /**
     * shows the edit group modal
     */
    const showEditModal = () => {
        setAddModalVisible(false);  // avoid two modals being visible under all circumstances
        setEditModalVisible(true);
    }

    /**
     * closes the edit modal
     */
    const closeEditModal = () => {
        setEditModalVisible(false);
    }

    /**
     * shows the add model group modal (used to edit group members)
     */
    const showAddModal = () => {
        setEditModalVisible(false);  // avoid two modals being visible under all circumstances
        setAddModalVisible(true);
    }

    /**
     * closes the add model group modal (used to edit group members)
     */
    const closeAddModal = () => {
        setAddModalVisible(false);
    }

    /**
     * function to return the visibility icon, depending on whether the group is currently visible or not
     */
    const VisibilityIcon = () => {
        return isModelGroupVisible ? <MuiVisibilityIcon data-testid="ModelGroupCard-VisibilityIcon-visible"/> :
            <VisibilityOffIcon data-testid="ModelGroupCard-VisibilityIcon-invisible"/>
    }

    const toggleDeleteRequest = () => {
        setDeleteRequest(!isDeleteRequest);
    }

    /**
     *
     */
    const deleteGroup = () => {
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
                                    onClick={toggleDeleteRequest}><DeleteIcon/></IconButton>
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
    modelGroupId: PropTypes.number.isRequired,
    reportError: PropTypes.func.isRequired
}

export default ModelGroupCard;