import React from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Typography,
    Card,
    Button, IconButton, CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { fileFormats } from "../../../../utils/constants";
import { downloadGraphAsPDF} from "../../../../services/downloading/pdf/pdfCreator";
import { downloadGraphAsCSV, downloadGraphAsPNG, downloadGraphAsSVG} from "../../../../services/downloading/otherFormats";
import { useSelector } from "react-redux";
import { selectPlotId, selectPlotTitle} from "../../../../store/plotSlice/plotSlice";
import { selectActivePlotData} from "../../../../services/API/apiSlice";
import { selectAllModelGroups } from "../../../../store/modelsSlice/modelsSlice";
import { REQUEST_STATE } from "../../../../services/API/apiSlice";
import CloseIcon from "@mui/icons-material/Close";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";

/**
 * Opens a modal where the user can select the file format and download the plot.
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen -> whether modal should be visible
 * @param {function} props.onClose -> handles closing the modal
 * @param {function} props.reportError -> enabling to report an error
 * @returns {JSX.Element} a jsx containing a modal with a dropdown to choose the file type and a download button
 */
function DownloadModal(props) {

  /**
   * An array containing all model groups.
   */
  const modelGroups = useSelector(state => selectAllModelGroups(state));

  /**
   * The plot id of the graph (tco3_zm, tco3_return etc.).
   */
  const plotId = useSelector(selectPlotId);

  /**
   * The active data of the current plot which contains information about the models.
   */
  const activeData = useSelector(state => selectActivePlotData(state, plotId));

  /**
   * The plot title which is shown above the graph.
   */
  const plotTitle = useSelector(selectPlotTitle);

  /**
   * The selected file format.
   */
  const [selectedFileFormat, setSelectedFileFormat] = React.useState('');

  /**
   * The style of the DownloadModal.
   */
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    bgColor: useTheme().palette.grey[200],
    boxShadow: 24,
    p: 5,
  };

  /**
   * Handles the download of the plot, if the download button is clicked.
   */
  const handleDownloadPlot = () => {
    if (selectedFileFormat === "PDF") {
      downloadGraphAsPDF(plotId, plotTitle, modelGroups, activeData.data, props.reportError);
    } else if (selectedFileFormat === "PNG") {
      downloadGraphAsPNG(plotTitle, props.reportError);
    } else if (selectedFileFormat === "SVG") {
      downloadGraphAsSVG(plotTitle, props.reportError);
    } else if (selectedFileFormat === "CSV") {
      downloadGraphAsCSV(plotTitle, plotId, props.reportError);
    }
  };

  /**
   * Changes the selected file format in the Redux store.
   *
   * @param {event} event the event that called this function
   */
  const changeFileFormat = (event) => {
    setSelectedFileFormat(event.target.value);
  };

  return (
      <Modal open={props.isOpen} onClose={props.onClose}>
          <Card sx={style}>
              <CardHeader
                  title="Download Plot"
                  action={
                      <IconButton onClick={props.onClose} aria-label="close" data-testid="DownloadModal-close">
                          <CloseIcon />
                      </IconButton>
                  }
              />
              <CardContent>
                  <FormControl style={{ width: "100%", minWidth: 150 }}>
                      <InputLabel id="formatSelectLabel">Format</InputLabel>
                      <Select
                          labelId="formatSelectLabel"
                          id="formatSelection"
                          label="format"
                          value={selectedFileFormat}
                          onChange={changeFileFormat}
                          inputProps={{"data-testid":"DownloadModal-select-file-format"}}
                          
                      >
                          {fileFormats.map((elem, idx) => (
                              <MenuItem key={idx} value={elem.description}>
                                  {elem.description}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
              </CardContent>
              <CardActions sx={{justifyContent: "flex-end", marginTop: "2%"}}>
                  <Button
                      disabled={selectedFileFormat === '' || activeData.status !== REQUEST_STATE.success}
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
}

DownloadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reportError: PropTypes.func,
};

export default DownloadModal;
