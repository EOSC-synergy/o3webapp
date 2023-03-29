import React, { FC, useEffect, useState } from 'react';
import { getOptions, generateSeries } from 'utils/optionsFormatter';
import { useSelector } from 'react-redux';
import {
    RegionBasedXRange,
    selectPlotId,
    selectPlotTitle,
    selectPlotXRange,
    selectPlotYRange,
    YearsBasedXRange,
} from 'store/plotSlice';
import { selectVisibility } from 'store/referenceSlice';
import { REQUEST_STATE, selectActivePlotData } from 'services/API/apiSlice/apiSlice';
import { Typography, CircularProgress } from '@mui/material';
import { Alert, Link } from '@mui/material';
import { O3AS_PLOTS } from 'utils/constants';
import { NO_MONTH_SELECTED } from 'utils/constants';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';
import { AppState, useAppStore } from '../../store/store';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import type { Props as ApexProps } from 'react-apexcharts';
import { LEGAL_PLOT_ID } from '../../services/API/client';

type GraphProps = {
    reportError: (error: string) => void;
};
/**
 * The Graph component. The input parameters are taken from the Redux Store.
 * @component
 * @param {object} props specified in propTypes
 * @returns a svg rendered element that represents a graph, this is done by
 *          the apexcharts library
 */
const Graph: FC<GraphProps> = ({ reportError }) => {
    const store = useAppStore();

    /**
     * Maps the plots provided by the API to their apexcharts plot type.
     * @constant {Object}
     * @default
     * {
        tco3_zm: "line",
        tco3_return: "boxPlot"

     */
    const APEXCHARTS_PLOT_TYPE: Record<LEGAL_PLOT_ID, ApexProps['type']> = {
        tco3_zm: 'line',
        tco3_return: 'boxPlot',
    };

    /**
     * How large the loading spinner should appear.
     * @constant {string}
     * @default "300px"
     */
    const HEIGHT_LOADING_SPINNER = '300px';

    const plotId = useSelector(selectPlotId);
    const plotTitle = useSelector(selectPlotTitle);
    const xAxisRange = useSelector(selectPlotXRange);
    const yAxisRange = useSelector(selectPlotYRange);
    const activeData = useSelector((state: AppState) => selectActivePlotData(state, plotId));
    const modelsSlice = useSelector((state: AppState) => state.models);
    const refLineVisible = useSelector(selectVisibility);

    /**
     * State to keep track of the current dimensions of the Graph
     * @constant {Array}
     * @default [window.innerHeight, window.innerWidth]
     */
    const [dimensions, setDimensions] = useState({
        height: 1280,
        width: 720,
    });

    const fatalErrorMessage = "CRITICAL: an internal error occurred that shouldn't happen!";
    const loadingMessage = 'Loading Data...';

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
            <Typography
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                Error: {activeData.error}
            </Typography>
        );
    } else if (activeData.status === REQUEST_STATE.success) {
        const { data, styling } = generateSeries({
            plotId,
            data: activeData.data,
            modelsSlice,
            // TODO: fix typing (assertion because xAxisRange only used for return here)
            xAxisRange: xAxisRange as RegionBasedXRange,
            yAxisRange,
            refLineVisible,
            state: store.getState(),
        });
        const seriesNames = data.map((series) => series.name);
        const options = getOptions({
            plotId,
            styling,
            plotTitle,
            // TODO: fix typing (assertion because xAxisRange only used for zm here)
            xAxisRange: xAxisRange as YearsBasedXRange,
            yAxisRange,
            seriesNames,
            state: store.getState(),
        });
        const uniqueNumber = Date.now(); // forces apexcharts to re-render correctly!
        const HEIGHT =
            (window.innerHeight - document.getElementById('NavBar')!.offsetHeight) * 0.975;
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
};

export default React.memo(Graph, () => true); // prevent graph from re-rendering if sidebar is opened and closed
