import React from "react";
import {useTheme} from "@mui/material/styles";
import {Button, Card, Grid, Modal, Typography} from "@mui/material";
import PropTypes from 'prop-types';
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined';

/**
 * Forces the user to accept cookies.
 * @component
 * @param {Object} props specifid in propTypes
 * @returns {JSX.Element} a jsx file containing the modal
 * @deprecated
 */
function CookieConsentModal(props) {

    /**
     * The style of the modal
     *
     * @type {{boxShadow: number, transform: string, top: string, bgColor: *, left: string, position: string}}
     */
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgColor: useTheme().palette.grey[200],
        boxShadow: 24,
    };

    /**
     * function that is called when the user agrees to cookies
     */
    const agreeToCookies = () => props.onClose();
    /**
     * function that is called when the user disagrees to cookies
     */
    const disagreeToCookies = () => props.onClose();

    return (
        <Modal
            disableEscapeKeyDown={true}
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
                        key="cookie"
                        sx={{display: "flex", justifyContent: "center", pt: 5, mb: -3}}
                    >
                        <CookieOutlinedIcon sx={{fontSize: "100px"}}/>
                    </Grid>
                    <Grid
                        item
                        key="text"
                        sx={{px: 5, pt: 5, pb: 3}}>
                        <Typography variant="h3" sx={{textAlign: "center"}}><b>We Use Cookies!</b></Typography>
                        <br/>
                        <Typography>By using this website, you automatically accept that we use cookies.</Typography>
                    </Grid>
                    <Grid
                        item
                        key="acceptButton"
                        sx={{px: 5, pb: 5, display: "flex", justifyContent: "left"}}
                    >
                        <Button variant="outlined" onClick={disagreeToCookies}
                                sx={{marginRight: '1em'}}>Disagree</Button>
                        <Button variant="contained" onClick={agreeToCookies}>Agree</Button>
                    </Grid>
                </Grid>
            </Card>
        </Modal>
    );
}

CookieConsentModal.propTypes = {
    /**
     * whether the cookie consent modal should be displayed
     */
    isOpen: PropTypes.bool.isRequired,
    /**
     * handles closing of the modal
     */
    onClose: PropTypes.func.isRequired,
}

export default CookieConsentModal;