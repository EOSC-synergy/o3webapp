import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DownloadModal from '../../../../../src/views/landingPage/Sidebar/DownloadModal';
import { Provider } from 'react-redux';
import { createTestStore } from '../../../../../src/store';
import tco3zmResponse from '../../../../src/services/API/testing/tco3zm-response.json';
import axios from 'axios';
import { fetchPlotData } from '../../../../../src/services/API/apiSlice';
import { O3AS_PLOTS } from '../../../../../src/utils/constants';

jest.mock('axios');

describe('testing basic rendering & selection', () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                {' '}
                <DownloadModal reportError={() => {}} onClose={() => {}} isOpen={true} />
            </Provider>
        );
    });

    it('renders correctly when open', () => {
        let { baseElement, container } = render(
            <Provider store={store}>
                {' '}
                <DownloadModal isOpen={true} onClose={() => {}} reportError={() => {}} />{' '}
            </Provider>
        );
        expect(baseElement).toMatchSnapshot();
        expect(container).toBeVisible();
    });

    it('renders correctly when closed', () => {
        let { baseElement } = render(
            <Provider store={store}>
                {' '}
                <DownloadModal isOpen={false} onClose={() => {}} reportError={() => {}} />
            </Provider>
        );
        expect(baseElement).toMatchSnapshot();
    });

    it('raises a console.error function if a required prop is not provided', () => {
        console.error = jest.fn();
        render(
            <Provider store={store}>
                {' '}
                <DownloadModal onClose={() => {}} reportError={() => {}} />
            </Provider>
        );
        expect(console.error).toHaveBeenCalled();
        render(
            <Provider store={store}>
                {' '}
                <DownloadModal isOpen={true} reportError={() => {}} />
            </Provider>
        );
        expect(console.error).toHaveBeenCalled();
    });

    it('testing select file format functionality', async () => {
        // SETUP
        const mock = jest.fn();
        // mock api => data
        // simpler, but less powerful: axios.post.mockResolvedValue({data: tco3zmResponse});
        axios.post.mockImplementation((requestUrl) => {
            return Promise.resolve({ data: tco3zmResponse });
        });
        await store.dispatch(
            fetchPlotData({
                plotId: O3AS_PLOTS.tco3_zm,
                models: ['CCMI-1_ACCESS_ACCESS-CCM-refC2'],
            })
        );

        let { getByTestId } = render(
            <Provider store={store}>
                <DownloadModal isOpen={true} onClose={() => {}} reportError={mock} />
            </Provider>
        );

        // ACTUAL TEST
        const wrap = getByTestId('DownloadModal-select-file-format');
        fireEvent.mouseDown(wrap);

        fireEvent.change(wrap, { target: { value: 'CSV' } });
        fireEvent.click(getByTestId('DownloadModal-download-plot'));
        fireEvent.click(getByTestId('DownloadModal-download-plot'));
        expect(mock).toHaveBeenCalledWith(
            "Can't download the chart if it hasn't been fully loaded."
        );
    });
});
