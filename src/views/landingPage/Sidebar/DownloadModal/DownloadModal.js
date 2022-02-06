import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
  Card,
  Grid,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { fileFormats } from "../../../../utils/constants";
import { downloadGraphAsPDF} from "../../../../services/pdf/pdfCreator";
import { useSelector } from "react-redux";
import { selectPlotId, selectPlotTitle } from "../../../../store/plotSlice/plotSlice";
import { getIncludedModelsAsObjects } from "../../../../utils/optionsFormatter";

/**
 * Opens a modal where the user can select the file format and download the plot.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen -> whether modal should be visible
 * @param {function} props.onClose -> handles closing the modal
 * @param {function} props.reportError -> enabling to report an error
 * @returns {JSX.Element} a jsx containing a modal with a dropdown to choose the file type and a download button
 */
function DownloadModal(props) {
  /**
   * @todo move to redux store
   */
  const [selectedFileFormat, setSelectedFileFormat] = React.useState("");
  const plotId = useSelector(selectPlotId);
  const modelsSlice = useSelector((state) => state.models);
  const plotTitle = useSelector(selectPlotTitle);

  /**
   * The style of the DownloadModal.
   *
   * @type {{
   *          p: number, boxShadow: number, transform: string, top: string,
   *          bgColor: *, left: string, width: string, position: string
   *       }} the props
   */
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgColor: useTheme().palette.grey[200],
    boxShadow: 24,
    p: 5,
  };




function downloadGraphAsPNG(fileName) {
    return new Promise((resolve, reject) => {
         const img = new Image();
         const svgElement = document.querySelector('.apexcharts-svg');
         const imageBlobURL = 'data:image/svg+xml;charset=utf-8,' +
            encodeURIComponent(svgElement.outerHTML);
         img.onload = ()=> {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            downloadBase64File(dataURL, fileName);
            resolve(dataURL);
         };
         img.onerror = (error) => {
           reject(error);
         };
         img.src = imageBlobURL;
        
       }
       );
  }

  
function downloadBase64File(base64Data, fileName) {
    const downloadLink = document.createElement("a");
    downloadLink.href = base64Data;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  /**
   * Downloads the plot.
   *
   */
  const downloadPlot = () => {
    const includedModels = getIncludedModelsAsObjects(modelsSlice);

    if (selectedFileFormat === "pdf") {
        downloadGraphAsPDF(plotId, plotTitle);
    } else if (selectedFileFormat === "png") {
       downloadGraphAsPNG(plotTitle);
    } else if (selectedFileFormat === "svg") {

    } else {
    }
  };



  /**
   * Calls the redux store and changes the selected file format.
   *
   * @param {event} event the event that called this function
   *
   * @todo connect with redux store
   */
  const changeFileFormat = (event) => {
    setSelectedFileFormat(event.target.value);
  };

  return (
    <Modal open={props.isOpen} onClose={props.onClose}>
      <Card sx={style}>
        <Grid container spacing={5} justifyContent="center" alignItems="center">
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            key="heading"
            sx={{ textAlign: "center" }}
          >
            <Typography variant={"h3"}>Download plot</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3} key="text">
            <Typography variant={"h6"}>Choose file format:</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} key="select">
            <FormControl style={{ width: "100%", minWidth: 150 }}>
              <InputLabel id="formatSelectLabel">format</InputLabel>
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
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3} key="button">
            <Button variant="outlined" onClick={downloadPlot}>
              <Typography>Download</Typography>
            </Button>
          </Grid>
        </Grid>
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
