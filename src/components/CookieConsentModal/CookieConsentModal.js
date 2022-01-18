import React from "react";
import {useTheme} from "@mui/material/styles";
import {Button, Card, FormControl, Grid, Modal, Typography} from "@mui/material";
import { BiCookie } from "react-icons/bi";

/**
 * displays an error message
 * @param {Object} props
 * @param {boolean} props.isOpen -> whether the error message modal should be displayed
 * @param {function} props.onClose -> handles closing of the modal
 * @returns {JSX.Element} a jsx file containing a modal with the given error message
 */
export default function ErrorMessageModal(props) {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgColor: useTheme().palette.grey[200],
        boxShadow: 24,
    };

    return (
        <>
            <Modal
                open={true}//{props.isOpen}
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
                            key="cookie"
                            sx={{display: "flex", justifyContent: "center", pt: 5, mb: -3}}
                        >
                            <BiCookie size={100} />
                        </Grid>
                        <Grid
                            item
                            xs={12} sm={12} md={6} lg={6} xl={6}
                            key="text"
                            sx={{px: 5, pt: 5, pb: 3}}>
                            <Typography variant="h3" sx={{textAlign: "center"}}><b>We Use Cookies</b></Typography>
                            <br />
                            <Typography>By using this website, you automatically accept that we use cookies.</Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12} sm={12} md={6} lg={6} xl={6}
                            key="acceptButton"
                            sx={{px: 5, pb: 5, display: "flex", justifyContent: "left"}}
                        >
                            <Button onClick={props.onClose}>Understood</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Modal>
        </>
    );
}

ErrorMessageModal.defaultProps = {
    isOpen: true,
}