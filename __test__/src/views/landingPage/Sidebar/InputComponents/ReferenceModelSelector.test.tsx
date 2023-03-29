import React from 'react';
import ReferenceModelSelector from 'views/landingPage/Sidebar/InputComponents/ReferenceModelSelector';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTestStore, type AppStore } from 'store';
import { Provider } from 'react-redux';
import modelsResponse from '../../../../../../__test__/src/services/API/testing/models-response.json';
import tco3zmResponse from '../../../../../../__test__/src/services/API/testing/tco3zm-response.json';
import { fetchModels } from 'services/API/apiSlice';
import * as client from 'services/API/client';
import { fakeAxiosResponse } from 'services/API/fakeResponse';

jest.mock('services/API/client');

const mockedClient = client as jest.Mocked<typeof client>;

let store: AppStore;
beforeEach(() => {
    store = createTestStore();
});

describe('tests basic rendering', () => {
    it('Component renders without crashing', () => {
        render(
            <Provider store={store}>
                <ReferenceModelSelector reportError={() => undefined} />
            </Provider>
        );
    });

    // Snapshot test
    it('renders correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <ReferenceModelSelector reportError={() => undefined} />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });
});

describe('tests redux functionality', () => {
    it('should update the reference model in the store accordingly', async () => {
        mockedClient.getModels.mockResolvedValue(fakeAxiosResponse(modelsResponse));
        mockedClient.getPlotData.mockResolvedValue(fakeAxiosResponse(tco3zmResponse));
        await store.dispatch(fetchModels()); // fetch models
        const { getByRole, getAllByRole } = render(
            <Provider store={store}>
                <ReferenceModelSelector reportError={() => undefined} />
            </Provider>
        );

        const model = 'CCMI-1_ACCESS_ACCESS-CCM-refC2'; // this should be selected
        const input = getByRole('combobox');
        fireEvent.change(input, { target: { value: model } }); // type to get all options on virtual dom
        fireEvent.click(getAllByRole('option')[0]); // select

        expect(store.getState().reference.settings.model).toEqual(model); // expect store is updated
    });

    it('should report an error message if no model data is available', async () => {
        const errorMessage = 'blubBlob';
        mockedClient.getModels.mockRejectedValue({ message: errorMessage });
        await store.dispatch(fetchModels());
        const mock = jest.fn();
        render(
            <Provider store={store}>
                <ReferenceModelSelector reportError={mock} />
            </Provider>
        );
        expect(mock).toHaveBeenCalledWith(`API not responding: ${errorMessage}`);
    });
});
