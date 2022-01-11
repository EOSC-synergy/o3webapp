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
import { FormHelperText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { InputBase } from '@mui/material';
import models from './models.json';
import CircularProgress from '@mui/material/CircularProgress';

// TODO: move to utils
function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

// TODO: move to utils
function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

/**
 * opens a modal where the user can add a new model group
 * @param {Object} props 
 * @param {function} props.onClose -> function to call if modal should be closed
 * @param {boolean} props.isOpen -> boolean whether the modal should be visible
 * @param {function} props.reportError -> error handling
 * @returns {JSX} a jsx containing a modal with a transfer list with all available models
 */
function AddModelGroupModal(props) {

    let i = props.isOpen;
    i = props.onClose;
    i = props.reportError;

    // const dispatch = useDispatch()
    
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);
    const [groupName, setGroupName] = React.useState('');

    // Omly needed for development
    const [isLoading, setIsLoading] = React.useState(true);
    // setLeft(models);

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

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
          padding: theme.spacing(1, 1, 1, 0),
          // vertical padding + font size from searchIcon
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('md')]: {
            width: '20ch',
          },
        },
      }));


    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const addNewGroup = () => {
        handleAllLeft();
        setGroupName('');
        // dispatch(addedModelGroup({groupName})) // add data (modelList)
    }

    const updateGroupName = (event) => {
        event.preventDefault();
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
            setLeft(models);
            setIsLoading(false);
        });
    }

    getAllAvailableModels();

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }));

      const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      }));

      const customList = (items) => (
        <Paper sx={{ width: '100%', height: 230, overflow: 'auto' }}>
          <List dense component="div" role="list">
            {items.map((value) => {
              const labelId = `transfer-list-item-${value}-label`;
    
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
                  <ListItemText id={labelId} primary={value} />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
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

    return (
        <>
            {props.isOpen &&
             
             <Modal
                open={props.isOpen}
                onClose={props.onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card sx={style}>
                    <CardContent>
                        <Typography variant="h6">Add new model group</Typography>
                        <Divider><Typography>Select name</Typography></Divider>
                        <Grid container spacing={1} style={{width:"100%", justifyContent:"center"}}>
                            <TextField value={groupName} onChange={updateGroupName} variant="standard" label="" />
                        </Grid>
                        <br/>
                        <Divider><Typography>Add new Models</Typography></Divider>
                        <Box id="modal-modal-description" sx={{ mt: 2 }}>
                            <Grid container spacing={2} justifyContent="center" alignItems="center">
                                <Grid item xs={5}>
                                    <Typography>All available models</Typography>
                                    <Search>
                                        <SearchIconWrapper>
                                        <SearchIcon />
                                        </SearchIconWrapper>
                                        <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        />
                                    </Search>
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
                                        onClick={handleAllRight}
                                        disabled={left.length === 0}
                                        aria-label="move all right"
                                    >
                                        ≫
                                    </Button>
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
                                    <Button
                                        sx={{ my: 0.5 }}
                                        variant="outlined"
                                        size="small"
                                        onClick={handleAllLeft}
                                        disabled={right.length === 0}
                                        aria-label="move all left"
                                    >
                                        ≪
                                    </Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography>Currently plotted models</Typography>
                                    <Search>
                                        <SearchIconWrapper>
                                        <SearchIcon />
                                        </SearchIconWrapper>
                                        <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        />
                                    </Search>
                                    {customList(right)}
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                    <CardActions sx={{justifyContent: "flex-end"}}>
                        <Button onClick={addNewGroup} size="small">Add group</Button>
                    </CardActions>
                </Card>
            </Modal>
        }
        </>
    );
}

export default AddModelGroupModal;
