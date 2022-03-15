import React, {useEffect} from 'react';
import Chart from "react-apexcharts"
import {getOptions, generateSeries} from "../../../utils/optionsFormatter/optionsFormatter"
import {useSelector} from 'react-redux'
import {selectPlotId, selectPlotTitle, selectPlotXRange, selectPlotYRange} from '../../../store/plotSlice/plotSlice';
import {selectVisibility} from '../../../store/referenceSlice/referenceSlice';
import {REQUEST_STATE, selectActivePlotData} from '../../../services/API/apiSlice';
import {Typography, CircularProgress} from '@mui/material';
import {Alert, Link} from '@mui/material';
import {O3AS_PLOTS} from '../../../utils/constants';
import {NO_MONTH_SELECTED} from '../../../utils/constants';
import store from '../../../store/store';

/**
 * Currently there is no dynamic data linking. The graph will always
 * render the data from default-data.json in this folder. This is
 * just a preview to work with until the API is implemented and
 * synced with redux and the UI (input components).
 * @component
 * @param {object} props currently not used
 * @returns a svg rendered element that represents a graph, this is done by
 *          the apexcharts library
 */
function Graph(props) {
    /**
     * Maps the plots provided by the api to their apexcharts plot type
     * @constant {object}
     * @memberof Graph
     */
    const APEXCHARTS_PLOT_TYPE = {
        tco3_zm: "line",
        tco3_return: "boxPlot"
    };

    /**
     * How large the loading spinner should appear.
     * @constant {string}
     * @memberof Graph
     */
    const HEIGHT_LOADING_SPINNER = "300px";

    const plotId = useSelector(selectPlotId);
    const plotTitle = useSelector(selectPlotTitle);
    const xAxisRange = useSelector(selectPlotXRange);
    const yAxisRange = useSelector(selectPlotYRange);
    const activeData = useSelector(state => selectActivePlotData(state, plotId));
    const modelsSlice = useSelector(state => state.models);
    const refLineVisible = useSelector(selectVisibility);

    const setDimensions = React.useState({ 
        height: window.innerHeight,
        width: window.innerWidth
    })[1];

    /**
     * Message to display if an error occured.
     * @constant {string}
     */
    const fatalErrorMessage = "CRITICAL: an internal error occurred that shouldn't happen!";

    /**
     * Message to display while data is being loaded
     * @constant {string}
     */
    const loadingMessage = "Loading Data...";
    
    useEffect(() => { 
        // note: this is important, because we should only "propagate" the error to the top
        // if this component has finished rendering, causing no <em>side effects</em> in
        // its rendering process 
        if (activeData.status === REQUEST_STATE.error
            && activeData.error !== NO_MONTH_SELECTED) { // if no month selected the user already gets notified with a more decent warning
            props.reportError(activeData.error);
        }
    }, [activeData]); // eslint-disable-line react-hooks/exhaustive-deps

    function debounce(fn, ms) {
        let timer
        return _ => {
          clearTimeout(timer)
          timer = setTimeout(_ => {
            timer = null
            fn.apply(this, arguments)
          }, ms)
        };
      }

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setDimensions({
              height: window.innerHeight,
              width: window.innerWidth
            })
          }, 1000);
      
          window.addEventListener('resize', debouncedHandleResize)
      
          return _ => window.removeEventListener('resize', debouncedHandleResize)      
    });

    if (!(plotId in O3AS_PLOTS)) {
        const style = {
            color: "rgb(1, 67, 97)",
            backgroundColor: "rgb(229, 246, 253)",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5em"
        }
        return (
            <Alert severity="info" sx={style}>
                This plot type is not supported yet by the Webapp! But you can check it out at the <Link
                href="https://o3as.data.kit.edu/">O3as API</Link>.
            </Alert>
        );
    }

    if (activeData.status === REQUEST_STATE.loading || activeData.status === REQUEST_STATE.idle) {
        return (<div
            style={{display: "flex", alignItems: "center", justifyContent: "center", height: HEIGHT_LOADING_SPINNER}}>
            <div>
                <CircularProgress size={100}/> <br/>
                <Typography component="p">{loadingMessage}</Typography>
            </div>

        </div>);
    } else if (activeData.status === REQUEST_STATE.error) {
        return (
            <React.Fragment>
                <Typography style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%"
                }}>Error: {activeData.error}</Typography>
            </React.Fragment>
        );
    } else if (activeData.status === REQUEST_STATE.success) {
        const {data, styling} = generateSeries({
            plotId,
            data: activeData.data,
            modelsSlice,
            xAxisRange,
            yAxisRange,
            refLineVisible,
            getState: store.getState
        });
        const seriesNames = data.map(series => series.name);
        const options = getOptions({
            plotId,
            styling,
            plotTitle,
            xAxisRange,
            yAxisRange,
            seriesNames,
            getState: store.getState
        });
        const uniqueNumber = Date.now(); // forces apexcharts to re-render correctly!
        const HEIGHT = (window.innerHeight - document.getElementById('Navbar').offsetHeight) * 0.975;
        return <Chart key={uniqueNumber} options={options} series={data} type={APEXCHARTS_PLOT_TYPE[plotId]} height={HEIGHT} style={{marginTop: "2%"}} />
    }

    // this "case" should not happen
    return <Typography>{fatalErrorMessage}</Typography>;
}

export default React.memo(Graph, () => true); // prevent graph from re-rendering if sidebar is opened and closed
