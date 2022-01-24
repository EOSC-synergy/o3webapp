import * as React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MuiVisibilityIcon from '@mui/icons-material/Visibility';
import { Checkbox, Divider, IconButton, FormControlLabel } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import EditModelGroupModal from "../EditModelGroupModal/EditModelGroupModal";
import PropTypes from 'prop-types';

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
     * Function to get the model group name by id provided in props
     * @todo insert redux call here or make groupName a prop
     */
    const getGroupName = (modelGroupId) => {
        switch(modelGroupId) {
            case 1:
                return "refC2 models";
            case 2:
                return "Cmam models";
        }
    }

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
     * shows the edit group modal
     */
    const showEditModal = () => {
        setEditModalVisible(true);
    }

    /**
     * closes the edit modal
     */   
    const closeEditModal = () => {
        setEditModalVisible(false);
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
            <Grid container>
                <Grid item xs={2}>
                    <IconButton aria-label="change visibility" onClick={toggleModelGroupVisibility}><VisibilityIcon /></IconButton>
                </Grid>
                <Grid item xs={8} textAlign="center">
                    <Typography variant="h6">{getGroupName(props.modelGroupId)}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton aria-label="edit" onClick={showEditModal}><Edit /></IconButton>
                </Grid>
            </Grid>
            <Divider />
            <Grid container flexDirection="column">
                <Grid container item flexDirection="row">
                    <Grid item xs={6} sx={{paddingLeft: '1em'}}>
                        <FormControlLabel
                            label="median"
                            control={
                                <Checkbox
                                    onChange={toggleModelGroupMedianVisibility}
                                    checked={isModelGroupMedianVisible}
                                />
                            }
                        />
                    </Grid>
                    <Grid item xs={6} sx={{paddingLeft: '1em'}}>
                        <FormControlLabel
                            label="mean"
                            control={
                                <Checkbox
                                    onChange={toggleModelGroupMeanVisibility}
                                    checked={isModelGroupMeanVisible}
                                />
                            }
                        />
                    </Grid>
                </Grid>
                <Grid container item flexDirection="row">
                    <Grid item xs={6} sx={{paddingLeft: '1em'}}>
                        <FormControlLabel
                            label="percentile"
                            control={
                                <Checkbox
                                    onChange={toggleModelGroupPercentileVisibility}
                                    checked={isModelGroupPercentileVisible}
                                />
                            }
                        />                    
                    </Grid>
                    <Grid item xs={6} sx={{paddingLeft: '1em'}}>
                        <FormControlLabel
                            label="derivative"
                            control={
                                <Checkbox
                                    onChange={toggleModelGroupDerivativeVisibility}
                                    checked={isModelGroupDerivativeVisible}
                                />
                            }
                        /> 
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    )
}

ModelGroupCard.propTypes = {
    modelGroupId: PropTypes.number.isRequired,
    reportError: PropTypes.func
}

export default ModelGroupCard;