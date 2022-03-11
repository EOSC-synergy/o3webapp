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
import { fileFormats, O3AS_PLOTS } from "../../../../utils/constants";
import { downloadGraphAsPDF} from "../../../../services/pdf/pdfCreator";
import { useSelector } from "react-redux";
import { selectPlotId, selectPlotTitle} from "../../../../store/plotSlice/plotSlice";
import { selectActivePlotData} from "../../../../services/API/apiSlice";
import { selectAllModelGroups } from "../../../../store/modelsSlice/modelsSlice";
import { REQUEST_STATE } from "../../../../services/API/apiSlice";
import { generateCsv } from "../../../../services/csv/csvParser";
import CloseIcon from "@mui/icons-material/Close";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";

/**
 * Opens a modal where the user can select the file format and download the plot.
 * @component
 * @param {Object} props specified in propTypes
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
   * @constant {object}
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
   * Downloads the graph as a PNG file.
   *
   * @param {string} fileName the file name of the PNG
   * @returns a promise which provides the user to download the PNG file, if it was successful.
   */
  const downloadGraphAsPNG = (fileName) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgElement = document.querySelector(".apexcharts-svg");
      const imageBlobURL =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svgElement.outerHTML);

      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        downloadBase64File(dataURL, fileName);
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = imageBlobURL;
    });
  }

  /**
   * Downloads the graph as an SVG file.
   *
   * @param {string} fileName the File name of the SVG
   * @returns a promise which provides the user to download the SVG file, if it was successful.
   */
  const downloadGraphAsSVG = (fileName) => {
    return new Promise((resolve, reject) => {
      const svgElement = document.querySelector(".apexcharts-svg");
      const imageBlobURL =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svgElement.outerHTML);
      downloadBase64File(imageBlobURL, fileName);
      resolve(imageBlobURL);
    });
  }

  /**
   * Downloads the graph as a CSV file.
   * @component
   * @param {string} plotTitle - the title of the plot
   * @param {string} plotId - the current id of the plot
   */
  const downloadGraphAsCsv = (plotTitle, plotId) => {
      let series, seriesX, categoryLabels, seriesNames;
      try {
          const global = window.ApexCharts.getChartByID(plotId).w.globals;
          series = global.series;
          seriesX = global.seriesX;
          categoryLabels = global.categoryLabels;
          seriesNames = global.seriesNames;
      } catch (TypeError) {
        props.reportError("Can't download the chart if it hasn't been fully loaded.");
        return;
      }
      
      const csvData = [];
      if (plotId === O3AS_PLOTS.tco3_zm) {
        // ### tco3_zm ###
        const LENGTH = Math.max(...seriesX.map(series => series.length));
        for (let lineIndex = 0; lineIndex < LENGTH; ++lineIndex) {
            const line = {
                category: seriesX[0][lineIndex],
            };
            for (let index in seriesNames) {
                const value = series[index][lineIndex];
                line[seriesNames[index]] = value ? value.toFixed(2) : value;
            }
            csvData.push(line);
        }
      } else if (plotId === O3AS_PLOTS.tco3_return) {

        for (let regionIndex in categoryLabels) {
            
            const line = {
                category: categoryLabels[regionIndex],
            };
            for (let seriesIndex in seriesNames) {
                if (!seriesNames[seriesIndex]) continue; // skip "box" which is empty
                const value = series[seriesIndex][regionIndex];
                line[seriesNames[seriesIndex]] = value ? value.toFixed(2) : value;
            }
            csvData.push(line);
        }

      } else {
          throw new Error(`The given plotId: "${plotId} has not csv support (yet)!"`);
      }
      
      downloadCsvFile({fileName: plotTitle + ".csv", csvString: generateCsv(csvData)}); // download data with title

  }

  /**
   * Downloads a given string interpreted as CSV.
   * 
   * @param {string} fileName name of the downloadable file
   * @param {string} csvString the content of this file
   */
  const downloadCsvFile = ({fileName, csvString}) => {
    const blob = new Blob([csvString]);
    const a = window.document.createElement("a");

    a.href = window.URL.createObjectURL(blob, {
    type: "text/csv"
    });
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }


  /**
   * Downloads the Base64 file to the specified Base64 data.
   * 
   * @param {string} base64Data the given Base64 data
   * @param {string} fileName the file name
   */
  const downloadBase64File = (base64Data, fileName) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = base64Data;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  /**
   * Handles the download of the plot, if the download button is clicked.
   */
  const handleDownloadPlot = () => {
    if (selectedFileFormat === "PDF") {
      downloadGraphAsPDF(plotId, plotTitle, modelGroups, activeData.data);
    } else if (selectedFileFormat === "PNG") {
      downloadGraphAsPNG(plotTitle);
    } else if (selectedFileFormat === "SVG") {
      downloadGraphAsSVG(plotTitle);
    } else if (selectedFileFormat === "CSV") {
      downloadGraphAsCsv(plotTitle, plotId);
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
                      <IconButton onClick={props.onClose} aria-label="close">
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
                  >
                      <Typography>Download</Typography>
                  </Button>
              </CardActions>
          </Card>
      </Modal>
  );
}

DownloadModal.propTypes = {
  /**
   * whether modal should be visible
   */
  isOpen: PropTypes.bool.isRequired,
  /**
   * handles closing the modal
   */
  onClose: PropTypes.func.isRequired,
  /**
   * function for error handling
   */
  reportError: PropTypes.func,
};

export default DownloadModal;
