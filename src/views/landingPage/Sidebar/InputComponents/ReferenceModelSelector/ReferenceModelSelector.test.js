import React from 'react';
import ReferenceModelSelector from './ReferenceModelSelector';
import { render } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import { createTestStore } from '../../../../../store/store';
import { Provider } from "react-redux";
import axios from 'axios';
import modelsResponse from "../../../../../services/API/testing/models-response.json"
import { fetchModels } from '../../../../../services/API/apiSlice';
jest.mock('axios');


let store;
beforeEach(() => {
    store = createTestStore();
});

describe("tests basic rendering", () => {
    it('Component renders without crashing', () => {
        render(<Provider store={store}><ReferenceModelSelector /></Provider>);
    
    });
    
    
    // Snapshot test
    it('renders correctly', () => {
        const { container } = render(<Provider store={store}><ReferenceModelSelector /></Provider>);
        expect(container).toMatchSnapshot();
    });
});

describe("tests redux functionality", () => {
  
    it("should update the reference model in the store accordingly", async () => {
        axios.get.mockImplementation(
            () => Promise.resolve({data: modelsResponse})
        )
        await store.dispatch(fetchModels());
        render(
            <Provider store={store}>
                <ReferenceModelSelector reportError={(i) => console.log(i)}/>
            </Provider>
        );

        


    });
});


