import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTestStore } from '../../../../../store/store';
import { Provider, useSelector } from "react-redux";
import ModelGroupConfigurator from './ModelGroupConfigurator';
import userEvent from '@testing-library/user-event';
import * as redux from 'react-redux';
import { updatedModelGroup, addedModelGroup, selectAllGroupIds } from "../../../../../store/modelsSlice/modelsSlice";

let store;
describe('test ModelGroupCard rendering', () => {

    beforeEach(() => {
        store = createTestStore();
    });
    
    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <ModelGroupConfigurator reportError={jest.fn()} />
            </Provider>
        );
    });
    
    it('renders correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <ModelGroupConfigurator reportError={jest.fn()} />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('renders add model group button', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <ModelGroupConfigurator reportError={jest.fn()} />
            </Provider>
        );        
        expect(getByTestId(/addModelGroup-button/)).toBeInTheDocument();
        expect(getByTestId(/addModelGroup-button/)).toBeEnabled();
    });

    it('raises a console.error function if a required prop is not provided', () => {
        console.error = jest.fn();
        render(            
            <Provider store={store}>
                <ModelGroupConfigurator />
            </Provider>
        );
        expect(console.error).toHaveBeenCalled();
    });
});

describe('test functionality buttons', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders add model group modal', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <ModelGroupConfigurator reportError={jest.fn()} />
            </Provider>
        );        
        userEvent.click(getByTestId(/addModelGroup-button/));
        expect(getByTestId(/addModelGroupModal/)).toBeInTheDocument();
    });
});

describe('test functionality redux', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders all model group cards in store', () => {
        const spy = jest.spyOn(redux, 'useSelector');
        const modelGroupName = 'blob';
        const fakeModelGroupName = 'blub';
        
        spy.mockReturnValueOnce([0])
            .mockReturnValueOnce(modelGroupName)
            .mockReturnValueOnce({
                median: true,
                mean: true,
                "standard deviation": false,
                percentile: true
            })
            .mockReturnValueOnce(true);

        const { getByText, queryByText } = render(
            <Provider store={store}>
                <ModelGroupConfigurator reportError={jest.fn()} />
            </Provider>
        );

        expect(getByText(modelGroupName)).toBeInTheDocument();
        expect(queryByText(fakeModelGroupName)).toBeNull();
    });
});