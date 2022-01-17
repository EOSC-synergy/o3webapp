import React from "react";
import {useTheme} from "@mui/material/styles";
import {Button, Card, FormControl, Grid, Modal, Typography} from "@mui/material";
import { IoCloseCircleOutline } from "react-icons/io5";

/**
 * displays an error message
 * @param {Object} props 
 * @param {boolean} props.isOpen -> whether the error message modal should be displayed
 * @param {function} props.onClose -> handles closing of the modal
 * @param {String} props.message -> error message
 * @returns {JSX.Element} a jsx file containing a modal with the given error message
 */
export default function ErrorMessageModal(props) {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        bgColor: useTheme().palette.grey[200],
        boxShadow: 24,
    };

    return (
        <>
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
                            xs={12} sm={12} md={12} lg={12} xl={12}
                            key="header"
                            sx={{backgroundColor:"#e85e6c", display: "flex", justifyContent: "center", py: 5}}
                        >
                            <IoCloseCircleOutline color="white" size={100} />
                        </Grid>
                        <Grid
                            item
                            xs={12} sm={12} md={6} lg={6} xl={6}
                            key="message"
                            sx={{px: 5, pt: 5}}>
                            <Typography variant="h3" sx={{textAlign: "center"}}>Ooops!</Typography>
                            <br />
                            <Typography>{props.message}</Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12} sm={12} md={6} lg={6} xl={6}
                            key="button"
                            sx={{px: 5, pb: 5, display: "flex", justifyContent: "right"}}
                        >
                            <Button onClick={props.onClose}>Close</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Modal>
        </>
    );
}

ErrorMessageModal.defaultProps = {
    isOpen: false,
}