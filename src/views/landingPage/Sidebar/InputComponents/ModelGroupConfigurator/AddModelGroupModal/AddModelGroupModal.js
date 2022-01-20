import React, { useState } from "react";
// import { useDispatch } from "react-redux"
// import { useGetModelsQuery } from "../../../../../../services/API/apiSlice"
// import { addedModelGroup, updatedModelGroup } from "../../../../../../store/modelsSlice";
import { styled, useTheme, alpha } from '@mui/material/styles';
import { CardActionArea, CardContent, Divider, FormControl, IconButton, Modal, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { Card } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import models from '../../../../../../utils/models.json';
import CircularProgress from '@mui/material/CircularProgress';
import CardHeader from '@mui/material/CardHeader';
import SearchBar from "../Searchbar/SearchBar";
import { convertModelName } from "../../../../../../utils/ModelNameConverter";
import { union, not, intersection } from "../../../../../../utils/arrayOperations";
import CloseIcon from '@mui/icons-material/Close';
import Alert from "@mui/material/Alert";

/**
 * opens a modal where the user can add a new model group
 * @param {Object} props 
 * @param {function} props.onClose -> function to call if modal should be closed
 * @param {boolean} props.isOpen -> boolean whether the modal should be visible
 * @param {function} props.reportError -> error handling
 * @returns {JSX} a jsx containing a modal with a transfer list with all available models
 */
function AddModelGroupModal(props) {

    const [checked, setChecked] = React.useState([]);
    const [allModels, setAllModels] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const [visible, setVisible] = React.useState([]);
    const [groupName, setGroupName] = React.useState('');


    // Omly needed for development
    const [isLoading, setIsLoading] = React.useState(true);

    const numberOfChecked = (items) => intersection(checked, items).length;
    const left = not(allModels, right);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    const leftVisible = intersection(visible, left);
    const rightVisible = intersection(visible, right);

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

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        // setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        // setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const addNewGroup = () => {
        // handleAllLeft();
        // setGroupName('');
        // // dispatch(addedModelGroup({groupName})) // add data (modelList)
    }

    const setCurrentlyVisibleModelsByIndex = (indices) => {
        let newFilteredModelsIdx = [];
        for (let idx in indices) {
            if (idx > 0 && idx < allModels.length) {
                newFilteredModelsIdx.push(allModels[idx]);
            }
        }
        console.log(newFilteredModelsIdx);
        setVisible(newFilteredModelsIdx);
    }

    /**
     * mocks a sleeping function; used for dev reasons
     * @param {int} ms the number of milisecons the program should sleep
     * @returns a promise waiting ms milisecons
     * @todo after getAvailablePlotTypes is connect remove this function
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    

    const getAllAvailableModels = () => {
        // const {data, isSuccess, isLoading, isError, error} = useGetModelsQuery()
        // display spinner until loading finished
        sleep(1000).then(() => {
            if (isLoading) {
                setVisible(models);
                setIsLoading(false);
                setAllModels(models);
            }
        });
    }
    getAllAvailableModels();

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

    const theme = useTheme();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        bgcolor: theme.palette.grey[200],
        boxShadow: 24,
        p: 4,
      };

    const updateGroupName = (event) => {
        setGroupName(event.target.value);
    }

    return (
        <Modal
            open={props.isOpen}
            onClose={props.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Card sx={style}>
                <CardHeader
                    title="Add a new model group"
                    action={
                        <IconButton onClick={props.onClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <TextField
                        label="Name of the group"
                        defaultValue={groupName}
                        helperText="The name will only appear in the legend of the exported plot."
                        variant="standard"
                        onBlur={updateGroupName}
                    />
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>
                        <SearchBar inputArray={allModels} foundIndicesCallback={setCurrentlyVisibleModelsByIndex} />
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item sm={5}>
                                <Typography>All available models</Typography>
                                {
                                    isLoading ? 
                                        <CircularProgress />
                                    :
                                        customList(left, leftChecked, leftVisible)
                                }
                            </Grid>
                            <Grid item sm={2}>
                                <Grid container direction="column" alignItems="center">
                                    <Button
                                        sx={{ my: 0.5 }}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleCheckedRight}
                                        disabled={leftChecked.length === 0}
                                        aria-label="move selected right"
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
                                    >
                                        &lt;
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item sm={5}>
                                <Typography>Models in {groupName ? groupName : "your group"}</Typography>
                                {
                                    isLoading ? 
                                        <CircularProgress />
                                    :
                                        customList(right, rightChecked, rightVisible)
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
                <CardActions sx={{justifyContent: "flex-end"}}>
                    <Button onClick={addNewGroup} size="small">Add group</Button>
                </CardActions>
            </Card>
        </Modal>
    );
}

export default AddModelGroupModal;
