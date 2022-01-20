import React, { useState } from "react";
// import { useDispatch } from "react-redux"
// import { useGetModelsQuery } from "../../../../../../services/API/apiSlice"
// import { addedModelGroup, updatedModelGroup } from "../../../../../../store/modelsSlice";
import { styled, useTheme, alpha } from '@mui/material/styles';
import { CardContent, Divider, FormControl, IconButton, Modal, TextField } from '@mui/material';
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
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const [groupName, setGroupName] = React.useState('');


    // Omly needed for development
    const [isLoading, setIsLoading] = React.useState(true);

    const numberOfChecked = (items) => intersection(checked, items).length;
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

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

    const handleCheckedRight = (event) => {
        event.preventDefault();
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const addNewGroup = () => {
        // handleAllLeft();
        // setGroupName('');
        // // dispatch(addedModelGroup({groupName})) // add data (modelList)
    }

    const searchData = (event, data) => {

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
        sleep(2000).then(() => {
            if (isLoading) {
                setLeft(models);
                setIsLoading(false);
            }
        });
    }
    getAllAvailableModels();

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
          setChecked(not(checked, items));
        } else {
          setChecked(union(checked, items));
        }
      };

    const customList = (items) => (
        <Card>
        <CardHeader
            sx={{ px: 2, py: 1 }}
            avatar={
            <Checkbox
                onClick={handleToggleAll(items)}
                checked={numberOfChecked(items) === items.length && items.length !== 0}
                indeterminate={
                numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                }
                disabled={items.length === 0}
                inputProps={{
                'aria-label': 'all items selected',
                }}
            />
            }
            title={`${numberOfChecked(items)}/${items.length} selected`}
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
            {items.map((value, idx) => {
            const labelId = `transfer-list-all-item-${value}-label`;
            let model = convertModelName(value);
                return (
                    <ListItem
                        key={value}
                        role="listitem"
                        button
                        onClick={handleChangeElement(value)}
                    >
                    <ListItemIcon>
                        <Checkbox
                            checked={checked.indexOf(value) !== -1}
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
    </Card>
    );

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
                        <SearchBar />
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={5}>
                                <Typography>All available models</Typography>
                                {
                                    isLoading ? 
                                        <CircularProgress />
                                    :
                                        customList(left)
                                }
                            </Grid>
                            <Grid item xs={2}>
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
                            <Grid item xs={5}>
                                <Typography>Models in {groupName ? groupName : "your group"}</Typography>
                                {
                                    isLoading ? 
                                        <CircularProgress />
                                    :
                                        customList(right)
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
