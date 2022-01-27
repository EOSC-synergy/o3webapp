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
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import {
    STATISTICAL_VALUES,
    setStatisticalValueForGroup,
    selectStatisticalValueSettingsOfGroup,
    selectNameOfGroup,
    setVisibilityForGroup,
    selectVisibilityOfGroup
} from "../../../../../../store/modelsSlice/modelsSlice";

/**
 * a card containing information about the a modal group
 * @param {OBject} props 
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
     * toggles the visibility of the whole group in the graph
     * @todo insert redux call here
     */
    const toggleModelGroupVisibility = () => {
        dispatch(setVisibilityForGroup({groupId: props.modelGroupId, isVisible: !isModelGroupVisible}));
    }

    /**
     * toggles the visibility of the median from this group in the graph
     * @todo insert redux call here
     */
    const toggleModelGroupStatisticalValueVisibility = (event, statisticalValue) => {
        dispatch(setStatisticalValueForGroup(
            {groupId: props.modelGroupId, svType: statisticalValue, isIncluded: event.target.checked}
        ));
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
                    <Typography variant="h6">{modelGroupName}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton aria-label="edit" onClick={showEditModal}><Edit /></IconButton>
                </Grid>
            </Grid>
            <Divider />
            <Grid container sx={{paddingTop: '0.5em'}}>
                {Object.keys(STATISTICAL_VALUES).map((key, idx) => {
                    return (
                        <Grid item key={idx} xs={6} sx={{paddingLeft: '1em'}}>
                            <FormControlLabel
                                label={key}
                                id={`ModelGroupCoard-toggle-${key}-label`}
                                control={
                                    <Checkbox
                                        onChange={
                                            event => toggleModelGroupStatisticalValueVisibility(event, key)
                                        }
                                        checked={modelGroupStatisticalValue[key]}
                                        id={`ModelGroupCoard-toggle-${key}-checkbox`}
                                        labelid={`ModelGroupCoard-toggle-${key}-label`}
                                    />
                                }
                            />
                        </Grid>
                    );
                })}
            </Grid>
        </Card>
    )
}

ModelGroupCard.propTypes = {
    modelGroupId: PropTypes.number.isRequired,
    reportError: PropTypes.func
}

export default ModelGroupCard;