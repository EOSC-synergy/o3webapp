import React, { FC, useEffect, useState } from 'react';
import {
    generateTco3_ReturnSeries,
    generateTco3_ZmSeries,
    getOptionsReturn,
    getOptionsZm,
} from 'utils/optionsFormatter';
import { useSelector } from 'react-redux';
import {
    selectPlotId,
    selectPlotTitle,
    selectPlotXRangeReturn,
    selectPlotXRangeZm,
    selectPlotYRange,
} from 'store/plotSlice';
import { selectVisibility } from 'store/referenceSlice';
import { REQUEST_STATE, selectActivePlotData } from 'services/API/apiSlice';
import { Alert, CircularProgress, Link, Typography } from '@mui/material';
import { NO_MONTH_SELECTED, O3AS_PLOTS } from 'utils/constants';
import dynamic from 'next/dynamic';
import { debounce } from 'lodash';
import { AppState, useAppStore } from 'store';
import type { Props as ApexProps } from 'react-apexcharts';
import { LEGAL_PLOT_ID } from 'services/API/client';
import { ErrorReporter } from 'utils/reportError';
import invariant from 'tiny-invariant';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const HEIGHT_LOADING_SPINNER = '300px';

const APEXCHARTS_PLOT_TYPE: Record<LEGAL_PLOT_ID, ApexProps['type']> = {
    tco3_zm: 'line',
    tco3_return: 'boxPlot',
};

const useSharedChartData = () => {
    const modelsSlice = useSelector((state: AppState) => state.models);
    const plotTitle = useSelector(selectPlotTitle);
    const yAxisRange = useSelector(selectPlotYRange);

    return {
        modelsSlice,
        plotTitle,
        yAxisRange,
    };
};

const zmPlotSelector = (state: AppState) => selectActivePlotData(state, O3AS_PLOTS.tco3_zm);

const ZmChart: FC = () => {
    const store = useAppStore();

    const xAxisRange = useSelector(selectPlotXRangeZm);
    const activeData = useSelector(zmPlotSelector);
    invariant(
        activeData.status === REQUEST_STATE.success,
        'can only render chart with successful data fetch'
    );
    const { modelsSlice, plotTitle, yAxisRange } = useSharedChartData();
    const refLineVisible = useSelector(selectVisibility);

    const { data, styling } = generateTco3_ZmSeries(
        activeData.data,
        modelsSlice,
        refLineVisible,
        store.getState()
    );
    const seriesNames = data.map((series) => series.name);
    const options = getOptionsZm(
        styling,
        plotTitle,
        xAxisRange,
        yAxisRange,
        // TODO: fix typing
        seriesNames as string[],
        store.getState()
    );
    const uniqueNumber = Date.now(); // forces apexcharts to re-render correctly!
    return (
        <Chart
            key={uniqueNumber}
            options={options}
            series={data}
            type={APEXCHARTS_PLOT_TYPE[O3AS_PLOTS.tco3_zm]}
            width="100%"
            height="100%"
        />
    );
};

const returnPlotSelector = (state: AppState) => selectActivePlotData(state, O3AS_PLOTS.tco3_return);
const ReturnChart: FC = () => {
    const store = useAppStore();

    const xAxisRange = useSelector(selectPlotXRangeReturn);
    const activeData = useSelector(returnPlotSelector);
    invariant(
        activeData.status === REQUEST_STATE.success,
        'can only render chart with successful data fetch'
    );
    const { modelsSlice, plotTitle, yAxisRange } = useSharedChartData();

    const { data, styling } = generateTco3_ReturnSeries(
        activeData.data,
        modelsSlice,
        xAxisRange,
        yAxisRange,
        store.getState()
    );
    const seriesNames = data.map((series) => series.name);
    const options = getOptionsReturn(
        styling,
        plotTitle,
        yAxisRange,
        // TODO: fix typing
        seriesNames as string[],
        store.getState()
    );
    const uniqueNumber = Date.now(); // forces apexcharts to re-render correctly!
    return (
        <Chart
            key={uniqueNumber}
            options={options}
            series={data}
            type={APEXCHARTS_PLOT_TYPE[O3AS_PLOTS.tco3_return]}
            width="100%"
            height="100%"
        />
    );
};

type GraphProps = {
    reportError: ErrorReporter;
};
/**
 * The Graph component. The input parameters are taken from the Redux Store.
 *
 * @param {object} props Specified in propTypes
 * @returns A svg rendered element that represents a graph, this is done by the apexcharts library
 * @component
 */
const Graph: FC<GraphProps> = ({ reportError }) => {
    const plotId = useSelector(selectPlotId);
    const activeData = useSelector((state: AppState) => selectActivePlotData(state, plotId));

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
        if (plotId === 'tco3_zm') {
            return <ZmChart />;
        } else if (plotId === 'tco3_return') {
            return <ReturnChart />;
        }
    }

    // this "case" should not happen
    return <Typography>{fatalErrorMessage}</Typography>;
};

export default Graph;
