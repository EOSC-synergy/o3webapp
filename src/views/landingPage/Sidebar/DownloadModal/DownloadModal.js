import React from 'react';
import { FormControl, InputLabel, MenuItem, Modal, Select, Typography, Card, Grid, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fileFormats } from '../../../../utils/constants';

/**
 * Opens a modal where the user can select the file format and download the plot.
 *
 * @param {Object} props 
 * @param {boolean} props.isOpen -> whether modal should be visible
 * @param {function} props.onClose -> handles closing the modal
 * @param {function} props.reportError -> enabling to report an error
 * @returns {JSX.Element} a jsx containing a modal with a dropdown to choose the file type and a download button
 */
export default function DownloadModal(props) {

    /**
     * The style of the DownloadModal.
     *
     * @type {{
     *          boxShadow: number, transform: string, pr: number, pb: number,
     *          top: string, bgColor: *, pt: number, left: string, width: string,
     *          position: string, pl: number
     *       }} the props
     */
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgColor: useTheme().palette.grey[200],
        boxShadow: 24,
        pl: 5,
        pr: 2,
        pt: 8,
        pb: 5,
    };

    /**
     * Downloads the plot.
     *
     * @todo implement
     */
    const downloadPlot = () => {
        console.log("downloading...");
    };

    /**
     * @todo move to redux store
     */
    const [selectedFileFormat, setSelectedFileFormat] = React.useState('');

    /**
     * Calls the redux store and changes the selected file format.
     *
     * @param {event} event the event that called this function
     *
     * @todo connect with redux store
     */
    const changeFileFormat = (event) => {
        setSelectedFileFormat(event.target.value);
    }

    return (
        <>
            <Modal
                open={props.isOpen}
                onClose={props.onClose}
            >
                <Card sx={style}>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant={"h6"} sx={{mt: -1}}>Choose file format:</Typography>
                        </Grid>
                        <Grid xs={6}>
                            <FormControl style={{width: "100%"}} sx={{mt: -3}}>
                                <Select
                                    labelId="formatSelectLabel"
                                    id="formatSelection"
                                    label="format"
                                    value={selectedFileFormat}
                                    onChange={changeFileFormat}
                                >
                                    {
                                        fileFormats.map(
                                            (elem, idx) => <MenuItem key={idx}>{elem.description}</MenuItem>
                                        )
                                    }
                                </Select>
                                <InputLabel id="formatSelectLabel">format</InputLabel>
                            </FormControl>
                        </Grid>
                        <Grid xs={3}>
                            <Button sx={{mx: 5, mt: -2}} variant="outlined" onClick={downloadPlot}>
                                <Typography>Download</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Modal>
        </>
    );
}