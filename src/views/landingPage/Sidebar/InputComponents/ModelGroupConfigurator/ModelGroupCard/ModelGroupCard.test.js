import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTestStore } from '../../../../../../store/store';
import ModelGroupCard, { getGroupName } from './ModelGroupCard';
import { Provider } from "react-redux";
import * as redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import {
    setStatisticalValueForGroup,
    setVisibilityForGroup
} from '../../../../../../store/modelsSlice/modelsSlice';

const groupName = "blob";
const isVisibile = true;
const statisticalValues = {
    mean: true,
    median: false,
    derivative: true,
    percentile: false
};

let store;
let reportError;
describe('test ModelGroupCard rendering', () => {

    beforeEach(() => {
        store = createTestStore();
        const spy = jest.spyOn(redux, 'useSelector');
        
        spy.mockReturnValueOnce(groupName)
            .mockReturnValueOnce(statisticalValues)
            .mockReturnValueOnce(isVisibile);
        reportError = jest.fn();
    });
    
    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={0} />
            </Provider>
        );
    });

    it('renders correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={1} />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('renders modelGroup name', () => {
        const { container } = render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={1} />
            </Provider>
        );        
        expect(container).toHaveTextContent(groupName);
    });

    it('raises a console.error function if props.reportError is not provided', () => {
        console.error = jest.fn();
        render(            
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} />
            </Provider>
        );
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('raises a console.error function if props.modelGroupId is not provided', () => {
        console.error = jest.fn();
        render(            
            <Provider store={store}>
                <ModelGroupCard modelGroupId={1} />
            </Provider>
        );
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('renders checkboxes correctly checked', () => {
        const { getByLabelText } = render(            
            <Provider store={store}>
                <ModelGroupCard modelGroupId={1} reportError={reportError} />
            </Provider>
        );
        expect(getByLabelText("mean")).toBeInTheDocument();
        expect(getByLabelText("mean")).toHaveProperty('checked', true);
        expect(getByLabelText("median")).toBeInTheDocument();
        expect(getByLabelText("median")).toHaveProperty('checked', false);
        expect(getByLabelText("derivative")).toBeInTheDocument();
        expect(getByLabelText("derivative")).toHaveProperty('checked', true);
        expect(getByLabelText("derivative")).toBeInTheDocument();
        expect(getByLabelText("percentile")).toHaveProperty('checked', false);
    });

    it('renders visibility icon correctly', () => {
        const { getByTestId } = render(            
            <Provider store={store}>
                <ModelGroupCard modelGroupId={1} reportError={reportError} />
            </Provider>
        );
        expect(getByTestId(/VisibilityIcon-visible/)).toBeInTheDocument();
    });
});

describe('test addModelGroupModal functionality', () => {

    beforeEach(() => {
        store = createTestStore();
        const spy = jest.spyOn(redux, 'useSelector');
        
        spy.mockReturnValueOnce(groupName)
            .mockReturnValueOnce(statisticalValues)
            .mockReturnValueOnce(isVisibile)
            .mockReturnValueOnce(groupName)
            .mockReturnValueOnce(statisticalValues)
            .mockReturnValueOnce(isVisibile);
        reportError = jest.fn();
    });

    it('dispatches setStatisticalValueForGroup with correct payload when checkbox is clicked', () => {
        store.dispatch = jest.fn();
        const modelGroupId = 1;

        const { getByLabelText } = render(           
            <Provider store={store}>
                <ModelGroupCard modelGroupId={modelGroupId} reportError={reportError} />
            </Provider>
        );
        userEvent.click(getByLabelText("mean"));
        expect(store.dispatch).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(
            setStatisticalValueForGroup(
                {groupId: 1, svType: "mean", isIncluded: !statisticalValues.mean}
            )
        );
    });

    it('dispatches setVisibilityForGroup with correct payload when icon is clicked', () => {
        store.dispatch = jest.fn();
        const modelGroupId = 1;

        const { queryByTestId } = render(           
            <Provider store={store}>
                <ModelGroupCard modelGroupId={modelGroupId} reportError={reportError} />
            </Provider>
        );
        userEvent.click(queryByTestId(/VisibilityIcon-visible/));
        expect(store.dispatch).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(
            setVisibilityForGroup(
                {groupId: modelGroupId, isVisible: !isVisibile}
            )
        );
    });

    test.todo('test that edit modal opens');

});
