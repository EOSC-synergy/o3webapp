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
     *          p: number, boxShadow: number, transform: string, top: string,
     *          bgColor: *, left: string, width: string, position: string
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
        p: 5,
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
                    <Grid
                        container
                        spacing={5}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key="heading" sx={{textAlign: "center"}}>
                            <Typography variant={"h3"}>Download plot</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} key="text">
                            <Typography variant={"h6"}>Choose file format:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key="select">
                            <FormControl style={{width: "100%", minWidth: 150}}>
                                <InputLabel id="formatSelectLabel">format</InputLabel>
                                <Select
                                    labelId="formatSelectLabel"
                                    id="formatSelection"
                                    label="format"
                                    value={selectedFileFormat}
                                    onChange={changeFileFormat}
                                >
                                    {
                                        fileFormats.map((elem, idx) =>
                                            <MenuItem key={idx.toString()} value={elem.description}>{elem.description}</MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} key="button">
                            <Button variant="outlined" onClick={downloadPlot}>
                                <Typography>Download</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Modal>
        </>
    );
}

DownloadModal.defaultProps = {
    isOpen: false,
}