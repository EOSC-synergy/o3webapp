import React from 'react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Typography,
    Card,
    Button,
    IconButton,
    CardContent,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { downloadGraphAsPDF } from '../../../../services/downloading/pdf/pdfCreator';
import {
    downloadGraphAsCSV,
    downloadGraphAsPNG,
    downloadGraphAsSVG,
} from '../../../../services/downloading/otherFormats';
import { useSelector } from 'react-redux';
import { selectPlotId, selectPlotTitle } from '../../../../store/plotSlice/plotSlice';
import { selectActivePlotData } from '../../../../services/API/apiSlice/apiSlice';
import { selectAllModelGroups } from '../../../../store/modelsSlice/modelsSlice';
import { REQUEST_STATE } from '../../../../services/API/apiSlice/apiSlice';
import CloseIcon from '@mui/icons-material/Close';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';

/**
 * The file formats which can be selected in the dropdown menu.
 * @constant {Array}
 * @memberof DownloadModal
 */
const fileFormats = [Symbol('CSV'), Symbol('PDF'), Symbol('PNG'), Symbol('SVG')];

type DownloadModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reportError?: (error: string) => void;
};

/**
 * Opens a modal where the user can select the file format and download the plot.
 * @component
 * @param isOpen whether modal should be visible
 * @param onClose handles closing the modal
 * @param reportError enabling to report an error
 * @returns {JSX.Element} a jsx containing a modal with a dropdown to choose the file type and a download button
 */
const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, reportError }) => {
    /**
     * An array containing all model groups.
     * @constant {Array}
     */
    const modelGroups = useSelector((state) => selectAllModelGroups(state));

    /**
     * The plot id of the graph (tco3_zm, tco3_return etc.).
     * @constant {string}
     */
    const plotId = useSelector(selectPlotId);

    /**
     * The active data of the current plot which contains information about the models.
     * @constant {Object}
     *
     */
    const activeData = useSelector((state) => selectActivePlotData(state, plotId));

    /**
     * The plot title which is shown above the graph.
     * @constant {string}
     */
    const plotTitle = useSelector(selectPlotTitle);

    /**
     * The selected file format.
     * @constant {string}
     */
    const [selectedFileFormat, setSelectedFileFormat] = React.useState('');

    /**
     * An object containing the information about the style of the DownloadModal.
     * @constant {Object}
     */
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        bgColor: useTheme().palette.grey[200],
        boxShadow: 24,
        p: 5,
    };

    /**
     * Handles the download of the plot, if the download button is clicked.
     * @function
     */
    const handleDownloadPlot = () => {
        if (selectedFileFormat === 'PDF') {
            downloadGraphAsPDF(plotId, plotTitle, modelGroups, activeData.data);
        } else if (selectedFileFormat === 'PNG') {
            downloadGraphAsPNG(plotTitle);
        } else if (selectedFileFormat === 'SVG') {
            downloadGraphAsSVG(plotTitle);
        } else if (selectedFileFormat === 'CSV') {
            downloadGraphAsCSV(plotTitle, plotId, reportError);
        }
    };

    /**
     * Changes the selected file format.
     *
     * @param {Object} event    The event object given by the dropdown menu.
     * @function
     */
    const changeFileFormat = (event: SelectChangeEvent) => {
        setSelectedFileFormat(event.target.value);
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Card sx={style}>
                <CardHeader
                    title="Download Plot"
                    action={
                        <IconButton
                            onClick={onClose}
                            aria-label="close"
                            data-testid="DownloadModal-close"
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <FormControl style={{ width: '100%', minWidth: 150 }}>
                        <InputLabel id="formatSelectLabel">Format</InputLabel>
                        <Select
                            labelId="formatSelectLabel"
                            id="formatSelection"
                            label="format"
                            value={selectedFileFormat}
                            onChange={changeFileFormat}
                            inputProps={{ 'data-testid': 'DownloadModal-select-file-format' }}
                        >
                            {fileFormats.map((elem, idx) => (
                                <MenuItem key={idx} value={elem.description}>
                                    {elem.description}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', marginTop: '2%' }}>
                    <Button
                        disabled={
                            selectedFileFormat === '' || activeData.status !== REQUEST_STATE.success
                        }
                        variant="contained"
                        onClick={handleDownloadPlot}
                        data-testid="DownloadModal-download-plot"
                    >
                        <Typography>Download</Typography>
                    </Button>
                </CardActions>
            </Card>
        </Modal>
    );
};

DownloadModal.propTypes = {
    /**
     * Tracks whether modal should be visible
     */
    isOpen: PropTypes.bool.isRequired,
    /**
     * Handles closing the modal
     */
    onClose: PropTypes.func.isRequired,
    /**
     * A function for error handling
     */
    reportError: PropTypes.func,
};

export default DownloadModal;
