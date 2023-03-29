import React from 'react';
import {
    Button,
    Card,
    CardContent,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    type SelectChangeEvent,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { downloadGraphAsPDF } from 'services/downloading/pdf/pdfCreator';
import {
    downloadGraphAsCSV,
    downloadGraphAsPNG,
    downloadGraphAsSVG,
} from 'services/downloading/otherFormats';
import { useSelector } from 'react-redux';
import { selectPlotId, selectPlotTitle } from 'store/plotSlice';
import { REQUEST_STATE, selectActivePlotData } from 'services/API/apiSlice';
import { type GlobalModelState, selectAllModelGroups } from 'store/modelsSlice';
import CloseIcon from '@mui/icons-material/Close';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import { type AppState } from 'store';
import { type ErrorReporter } from 'utils/reportError';

/**
 * The file formats which can be selected in the dropdown menu.
 *
 * @memberof DownloadModal
 * @constant {Array}
 */
const fileFormats = [Symbol('CSV'), Symbol('PDF'), Symbol('PNG'), Symbol('SVG')];

type DownloadModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reportError?: ErrorReporter;
};

/**
 * Opens a modal where the user can select the file format and download the plot.
 *
 * @param isOpen Whether modal should be visible
 * @param onClose Handles closing the modal
 * @param reportError Enabling to report an error
 * @returns {JSX.Element} A jsx containing a modal with a dropdown to choose the file type and a
 *   download button
 * @component
 */
const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, reportError }) => {
    /**
     * An array containing all model groups.
     *
     * @constant {Array}
     */
    const modelGroups = useSelector((state: GlobalModelState) => selectAllModelGroups(state));

    /**
     * The plot id of the graph (tco3_zm, tco3_return etc.).
     *
     * @constant {string}
     */
    const plotId = useSelector(selectPlotId);

    /**
     * The active data of the current plot which contains information about the models.
     *
     * @constant {Object}
     */
    const activeData = useSelector((state: AppState) => selectActivePlotData(state, plotId));

    /**
     * The plot title which is shown above the graph.
     *
     * @constant {string}
     */
    const plotTitle = useSelector(selectPlotTitle);

    /**
     * The selected file format.
     *
     * @constant {string}
     */
    const [selectedFileFormat, setSelectedFileFormat] = React.useState('');

    /**
     * An object containing the information about the style of the DownloadModal.
     *
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
     *
     * @function
     */
    const handleDownloadPlot = () => {
        if (activeData.status != REQUEST_STATE.success) {
            // TODO: error message
            return;
        }
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
     * @function
     * @param {Object} event The event object given by the dropdown menu.
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

export default DownloadModal;
