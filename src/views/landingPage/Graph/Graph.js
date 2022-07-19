import React, { useEffect } from 'react';
//import Chart from "react-apexcharts"
import { getOptions, generateSeries } from '../../../utils/optionsFormatter';
import { useSelector, useStore } from 'react-redux';
import {
    selectPlotId,
    selectPlotTitle,
    selectPlotXRange,
    selectPlotYRange,
} from '../../../store/plotSlice';
import { selectVisibility } from '../../../store/referenceSlice/referenceSlice';
import { REQUEST_STATE, selectActivePlotData } from '../../../services/API/apiSlice/apiSlice';
import { Typography, CircularProgress } from '@mui/material';
import { Alert, Link } from '@mui/material';
import { O3AS_PLOTS } from '../../../utils/constants';
import { NO_MONTH_SELECTED } from '../../../utils/constants';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * The Graph component. The input parameters are taken from the Redux Store.
 * @component
 * @param {object} props specified in propTypes
 * @returns a svg rendered element that represents a graph, this is done by
 *          the apexcharts library
 */
function Graph(props) {
    const store = useStore();

    /**
     * Maps the plots provided by the API to their apexcharts plot type.
     * @constant {Object}
     * @default 
     * {
        tco3_zm: "line",
        tco3_return: "boxPlot"
    
     */
    const APEXCHARTS_PLOT_TYPE = {
        tco3_zm: 'line',
        tco3_return: 'boxPlot',
    };

    /**
     * How large the loading spinner should appear.
     * @constant {string}
     * @default "300px"
     */
    const HEIGHT_LOADING_SPINNER = '300px';

    /**
     * Which type of plot should currently be plotted.
     * @see {@link selectPlotId}
     * @constant {String}
     */
    const plotId = useSelector(selectPlotId);

    /**
     * The current plot title. Taken from the redux store.
     * @constant {String}
     * @see {@link selectPlotTitle}
     */
    const plotTitle = useSelector(selectPlotTitle);

    /**
     * The current xAxisRange. Taken from the redux store.
     * @see {@link selectPlotXRange}
     * @constant {Array}
     */
    const xAxisRange = useSelector(selectPlotXRange);

    /**
     * The current yAxisRange. Taken from the redux store.
     * @see {@link selectPlotYRange}
     * @constant {Array}
     */
    const yAxisRange = useSelector(selectPlotYRange);

    /**
     * The current active data. Taken from the redux store.
     * @see {@link selectActivePlotData}
     * @constant {Object}
     */
    const activeData = useSelector((state) => selectActivePlotData(state, plotId));

    /**
     * The current models. Taken from the redux store.
     * @constant {Array}
     */
    const modelsSlice = useSelector((state) => state.models);

    /**
     * Whether the reference line should be shown. Taken from the redux store.
     * @see {@link selectVisibility}
     * @constant {boolean}
     */
    const refLineVisible = useSelector(selectVisibility);

    /**
     * State to keep track of the current dimensions of the Graph
     * @constant {Array}
     * @default [window.innerHeight, window.innerWidth]
     */
    const [dimensions, setDimensions] = React.useState({
        height: 1280,
        width: 720,
    });

    /**
     * Message to display if an error occured.
     * @constant {String}
     * @default "CRITICAL: an internal error occurred that shouldn't happen!"
     */
    const fatalErrorMessage = "CRITICAL: an internal error occurred that shouldn't happen!";

    /**
     * Message to display while data is being loaded
     * @constant {String}
     * @default "Loading Data..."
     */
    const loadingMessage = 'Loading Data...';

    function debounce(fn, ms) {
        let timer;
        return (_) => {
            clearTimeout(timer);
            timer = setTimeout((_) => {
                timer = null;
                fn.apply(this, arguments);
            }, ms);
        };
    }

    /**
     * reportError function provided by props.
     * Stored separetly in order to pass it to useEffect
     * @constant {function}
     */
    const reportError = props.reportError;

    useEffect(() => {
        // note: this is important, because we should only "propagate" the error to the top
        // if this component has finished rendering, causing no <em>side effects</em> in
        // its rendering process
        if (activeData.status === REQUEST_STATE.error && activeData.error !== NO_MONTH_SELECTED) {
            // if no month selected the user already gets notified with a more decent warning
            reportError(activeData.error);
        }
    }, [activeData, reportError]);

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        }, 1000);

        window.addEventListener('resize', debouncedHandleResize);

        return () => window.removeEventListener('resize', debouncedHandleResize);
    }, []);

    if (!(plotId in O3AS_PLOTS)) {
        const style = {
            color: 'rgb(1, 67, 97)',
            backgroundColor: 'rgb(229, 246, 253)',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5em',
        };
        return (
            <Alert severity="info" sx={style}>
                This plot type is not supported yet by the Webapp! But you can check it out at the{' '}
                <Link href="https://o3as.data.kit.edu/">O3as API</Link>.
            </Alert>
        );
    }

    if (activeData.status === REQUEST_STATE.loading || activeData.status === REQUEST_STATE.idle) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: HEIGHT_LOADING_SPINNER,
                }}
            >
                <div>
                    <CircularProgress size={100} /> <br />
                    <Typography component="p">{loadingMessage}</Typography>
                </div>
            </div>
        );
    } else if (activeData.status === REQUEST_STATE.error) {
        return (
            <React.Fragment>
                <Typography
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    Error: {activeData.error}
                </Typography>
            </React.Fragment>
        );
    } else if (activeData.status === REQUEST_STATE.success) {
        const { data, styling } = generateSeries({
            plotId,
            data: activeData.data,
            modelsSlice,
            xAxisRange,
            yAxisRange,
            refLineVisible,
            getState: store.getState,
        });
        const seriesNames = data.map((series) => series.name);
        const options = getOptions({
            plotId,
            styling,
            plotTitle,
            xAxisRange,
            yAxisRange,
            seriesNames,
            getState: store.getState,
        });
        const uniqueNumber = Date.now(); // forces apexcharts to re-render correctly!
        const HEIGHT =
            (window.innerHeight - document.getElementById('NavBar').offsetHeight) * 0.975;
        return (
            <Chart
                key={uniqueNumber}
                options={options}
                series={data}
                type={APEXCHARTS_PLOT_TYPE[plotId]}
                height={HEIGHT}
                style={{ marginTop: '2%' }}
            />
        );
    }

    // this "case" should not happen
    return <Typography>{fatalErrorMessage}</Typography>;
}

export default React.memo(Graph, () => true); // prevent graph from re-rendering if sidebar is opened and closed
