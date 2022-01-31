import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiVisibilityIcon from '@mui/icons-material/Visibility';
import { Checkbox, Divider, IconButton, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid';
import EditModelGroupModal from "../EditModelGroupModal/EditModelGroupModal";
import AddModelGroupModal from "../AddModelGroupModal/AddModelGroupModal";
import PropTypes from 'prop-types';
import { CardActions, Button } from '@mui/material';

/**
 * Function to get the model group name by id provided in props
 * @todo insert redux call here or make groupName a prop
 */
export const getGroupName = (modelGroupId) => {
    switch(modelGroupId) {
        case 1:
            return "refC2 models";
        case 2:
            return "Cmam models";
    }
}

/**
 * a card containing information about the a modal group
 * @param {OBject} props 
 * @param {String} props.reportError - error function
 * @param {int} props.modelGroupId -> id of the model group
 * @returns {JSX.Element} a jsx containing a modal with a data grid with all models from the model group
 */
function ModelGroupCard(props) {
    
    // const modelGroupData = useSelector(state => state.models[props.name])

    /**
     * States declared for implementing design
     * @todo move to redux
     */
    const [isModelGroupVisible, setModelGroupVisible] = React.useState(false);
    const [isModelGroupMedianVisible, setModelGroupMedianVisible] = React.useState(true);
    const [isModelGroupMeanVisible, setModelGroupMeanVisible] = React.useState(true);
    const [isModelGroupPercentileVisible, setModelGroupPercentileVisible] = React.useState(true);
    const [isModelGroupDerivativeVisible, setModelGroupDerivativeVisible] = React.useState(true);
    
    /**
     * toggles the visibility of the whole group in the graph
     * @todo insert redux call here
     */
    const toggleModelGroupVisibility = () => {
        setModelGroupVisible(!isModelGroupVisible);
    }

    /**
     * toggles the visibility of the median from this group in the graph
     * @todo insert redux call here
     */
    const toggleModelGroupMedianVisibility = (event) => {
        setModelGroupMedianVisible(event.target.checked);
    }

    /**
     * toggles the visibility of the mean from this group in the graph
     * @todo insert redux call here
     */
    const toggleModelGroupMeanVisibility = (event) => {
        setModelGroupMeanVisible(event.target.checked);
    }

    /**
     * toggles the visibility of the percentile from this group in the graph
     * @todo insert redux call here
     */
    const toggleModelGroupPercentileVisibility = (event) => {
        setModelGroupPercentileVisible(event.target.checked);
    }

    /**
     * toggles the visibility of the derivative from this group in the graph
     * @todo insert redux call here
     */
    const toggleModelGroupDerivativeVisibility = (event) => {
        setModelGroupDerivativeVisible(event.target.checked);
    }

    /**
     * state to keep track of whether the edit group modal is currently visible or not
     */
    const [isEditModalVisible, setEditModalVisible] = React.useState(false);
    /**
     * state to keep track of whether the add group modal (used to edit group members) is currently visible or not
     */
    const [isAddModalVisible, setAddModalVisible] = React.useState(false);

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
        return isModelGroupVisible ? <MuiVisibilityIcon /> : <VisibilityOffIcon />
    }

    return (
        <Card style={{margin: "5%"}} elevation={2}>
            <EditModelGroupModal id={props.modelGroupId} isOpen={isEditModalVisible} onClose={closeEditModal} />
            <AddModelGroupModal id={props.modelGroupId} isOpen={isAddModalVisible} onClose={closeAddModal} />
            <Grid container>
                <Grid item xs={2}>
                    <IconButton aria-label="change visibility" onClick={toggleModelGroupVisibility}><VisibilityIcon /></IconButton>
                </Grid>
                <Grid item xs={8} textAlign="center">
                    <Typography variant="h6">{getGroupName(props.modelGroupId)}</Typography>
                </Grid>
            </Grid>
            <Divider />
            <Grid container flexDirection="column">
                <Grid container item flexDirection="row">
                    <Grid item xs={6} sx={{paddingLeft: '1em'}}>
                        <FormControlLabel
                            label="median"
                            id="ModelGroupCoard-toggle-median-label"
                            control={
                                <Checkbox
                                    onChange={toggleModelGroupMedianVisibility}
                                    checked={isModelGroupMedianVisible}
                                    id="ModelGroupCoard-toggle-median-checkbox"
                                    labelid="ModelGroupCoard-toggle-median-label"
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={6} sx={{paddingLeft: '1em'}}>
                        <FormControlLabel
                            label="mean"
                            id="ModelGroupCoard-toggle-mean-label"
                            control={
                                <Checkbox
                                    onChange={toggleModelGroupMeanVisibility}
                                    checked={isModelGroupMeanVisible}
                                    id="ModelGroupCoard-toggle-mean-checkbox"
                                    labelid="ModelGroupCoard-toggle-mean-label"
                                />
                            }
                        />
                    </Grid>
                </Grid>
                <Grid container item flexDirection="row">
                    <Grid item xs={6} sx={{paddingLeft: '1em'}}>
                        <FormControlLabel
                            label="percentile"
                            id="ModelGroupCoard-toggle-percentile-label"
                            control={
                                <Checkbox
                                    onChange={toggleModelGroupPercentileVisibility}
                                    checked={isModelGroupPercentileVisible}
                                    id="ModelGroupCoard-toggle-percentile-checkbox"
                                    labelid="ModelGroupCoard-toggle-percentile-label"
                                />
                            }
                        />                    
                    </Grid>
                    <Grid item xs={6} sx={{paddingLeft: '1em'}}>
                        <FormControlLabel
                            label="derivative"
                            id="ModelGroupCoard-toggle-derivative-label"
                            control={
                                <Checkbox
                                    onChange={toggleModelGroupDerivativeVisibility}
                                    checked={isModelGroupDerivativeVisible}
                                    id="ModelGroupCoard-toggle-derivative-checkbox"
                                    labelid="ModelGroupCoard-toggle-derivative-label"
                                />
                            }
                        /> 
                    </Grid>
                </Grid>
            </Grid>
            <Divider />
            <CardActions>
                <Button size="small" variant="outlined" onClick={showEditModal}>Edit statistical values</Button>
                <Button size="small" variant="outlined" onClick={showAddModal}>Edit group members</Button>
            </CardActions>
        </Card>
    )
}

ModelGroupCard.propTypes = {
    modelGroupId: PropTypes.number.isRequired,
    reportError: PropTypes.func
}

export default ModelGroupCard;