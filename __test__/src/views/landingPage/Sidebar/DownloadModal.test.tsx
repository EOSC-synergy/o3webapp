import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DownloadModal from 'views/landingPage/Sidebar/DownloadModal';
import { Provider } from 'react-redux';
import { AppStore, createTestStore } from 'store';
import tco3zmResponse from '../../../../src/services/API/testing/tco3zm-response.json';
import { fetchPlotData } from 'services/API/apiSlice';
import { O3AS_PLOTS } from 'utils/constants';
import * as client from 'services/API/client';
import { fakeAxiosResponse } from 'services/API/fakeResponse';

jest.mock('services/API/client');

const mockedClient = client as jest.Mocked<typeof client>;

describe('testing basic rendering & selection', () => {
    let store: AppStore;
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders correctly when open', () => {
        const { container } = render(
            <Provider store={store}>
                {' '}
                <DownloadModal
                    isOpen={true}
                    onClose={() => undefined}
                    reportError={() => undefined}
                />{' '}
            </Provider>
        );
        expect(container).toBeVisible();
    });

    it('testing select file format functionality', async () => {
        // SETUP
        const mock = jest.fn();
        // mock api => data
        // simpler, but less powerful: axios.post.mockResolvedValue({data: tco3zmResponse});
        mockedClient.getFormattedPlotData.mockResolvedValue(fakeAxiosResponse(tco3zmResponse));
        await store.dispatch(fetchPlotData(O3AS_PLOTS.tco3_zm, ['CCMI-1_ACCESS_ACCESS-CCM-refC2']));

        const { getByTestId } = render(
            <Provider store={store}>
                <DownloadModal isOpen={true} onClose={() => undefined} reportError={mock} />
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
