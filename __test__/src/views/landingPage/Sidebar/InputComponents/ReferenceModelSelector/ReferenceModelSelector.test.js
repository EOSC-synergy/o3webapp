import React from 'react';
import ReferenceModelSelector from '../../../../../../../src/views/landingPage/Sidebar/InputComponents/ReferenceModelSelector';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTestStore } from '../../../../../../../src/store/store';
import { Provider } from 'react-redux';
import axios from 'axios';
import modelsResponse from '../../../../../../../__test__/src/services/API/testing/models-response.json';
import tco3zmResponse from '../../../../../../../__test__/src/services/API/testing/tco3zm-response.json';
import { fetchModels } from '../../../../../../../src/services/API/apiSlice/apiSlice';
jest.mock('axios');

let store;
beforeEach(() => {
    store = createTestStore();
});

describe('tests basic rendering', () => {
    it('Component renders without crashing', () => {
        render(
            <Provider store={store}>
                <ReferenceModelSelector />
            </Provider>
        );
    });

    // Snapshot test
    it('renders correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <ReferenceModelSelector />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });
});

describe('tests redux functionality', () => {
    it('should update the reference model in the store accordingly', async () => {
        axios.get.mockImplementation(() => Promise.resolve({ data: modelsResponse }));
        axios.post.mockResolvedValue({ data: tco3zmResponse });
        await store.dispatch(fetchModels()); // fetch models
        const { getByRole, getAllByRole } = render(
            <Provider store={store}>
                <ReferenceModelSelector reportError={() => {}} />
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
        axios.get.mockImplementation(() => Promise.reject({ message: errorMessage }));
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
