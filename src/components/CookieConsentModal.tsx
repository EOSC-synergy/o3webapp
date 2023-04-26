import React, { FC } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Card, Grid, Modal, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import CookieOutlinedIcon from '@mui/icons-material/CookieOutlined';

type CookieConsentModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

/**
 * A modal that asks the user to accept the cookies provieded by the website.
 *
 * @param isOpen Whether the cookie consent modal should be displayed
 * @param onClose Handles closing of the modal
 * @component
 */
const CookieConsentModal: FC<CookieConsentModalProps> = ({ isOpen, onClose }) => {
    /**
     * An object holding the styling information about the modal.
     *
     * @type {{
     *     boxShadow: number;
     *     transform: string;
     *     top: string;
     *     bgColor: any;
     *     left: string;
     *     position: string;
     * }}
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
     * Function that is called when the user agrees to cookies
     *
     * @function
     */
    const agreeToCookies = () => onClose();
    /**
     * Function that is called when the user disagrees to cookies
     *
     * @function
     */
    const disagreeToCookies = () => onClose();

    return (
        <Modal disableEscapeKeyDown={true} open={isOpen} onClose={onClose}>
            <Card sx={style}>
                <Grid container direction="column">
                    <Grid
                        item
                        key="cookie"
                        sx={{ display: 'flex', justifyContent: 'center', pt: 5, mb: -3 }}
                    >
                        <CookieOutlinedIcon sx={{ fontSize: '100px' }} />
                    </Grid>
                    <Grid item key="text" sx={{ px: 5, pt: 5, pb: 3 }}>
                        <Typography variant="h3" sx={{ textAlign: 'center' }}>
                            <b>We Use Cookies!</b>
                        </Typography>
                        <br />
                        <Typography>
                            By using this website, you automatically accept that we use cookies.
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        key="acceptButton"
                        sx={{ px: 5, pb: 5, display: 'flex', justifyContent: 'left' }}
                    >
                        <Button
                            variant="outlined"
                            onClick={disagreeToCookies}
                            sx={{ marginRight: '1em' }}
                            data-testid={'CookieConsentModal-disagree-btn'}
                        >
                            Disagree
                        </Button>
                        <Button
                            variant="contained"
                            onClick={agreeToCookies}
                            data-testid={'CookieConsentModal-agree-btn'}
                        >
                            Agree
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Modal>
    );
};

CookieConsentModal.propTypes = {
    /** Tracks whether the cookie consent modal should be displayed */
    isOpen: PropTypes.bool.isRequired,
    /** Handles closing of the modal */
    onClose: PropTypes.func.isRequired,
};

export default CookieConsentModal;
