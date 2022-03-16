import React from "react";
import {useTheme} from "@mui/material/styles";
import {Button, Card, Grid, Modal, Typography} from "@mui/material";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PropTypes from 'prop-types';

/**
 * Displays an error message.
 * @component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen -> whether the error message modal should be displayed
 * @param {function} props.onClose -> handles closing of the modal
 * @param {String} props.message -> error message
 * @returns {JSX.Element} a jsx file containing a modal with the given error message
 */
function ErrorMessageModal(props) {

    /**
     * The style of the modal.
     *
     * @type {{boxShadow: number, transform: string, top: string, bgColor: *, left: string, minWidth: string, position: string}}
     */
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgColor: useTheme().palette.grey[200],
        boxShadow: 24,
    };

    return (
        <Modal
            open={props.isOpen}
            onClose={props.onClose}
        >
            <Card sx={style}>
                <Grid
                    container
                    direction="column"
                >
                    <Grid
                        item
                        key="header"
                        sx={{backgroundColor: "#e85e6c", display: "flex", justifyContent: "center", py: 5}}
                    >
                        <CancelOutlinedIcon color="white" sx={{fontSize: '100px'}}/>
                    </Grid>
                    <Grid
                        item
                        key="message"
                        sx={{px: 5, pt: 5}}>
                        <Typography variant="h3" sx={{textAlign: "center"}}>Ooops!</Typography>
                        <br/>
                        <Typography>{props.message}</Typography>
                    </Grid>
                    <Grid
                        item
                        key="button"
                        sx={{px: 5, pb: 5, display: "flex", justifyContent: "right"}}
                    >
                        <Button onClick={props.onClose}>Dismiss</Button>
                    </Grid>
                </Grid>
            </Card>
        </Modal>
    );
}

ErrorMessageModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default ErrorMessageModal;