import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTestStore } from '../../../../../../store/store';
import ModelGroupCard, { getGroupName } from './ModelGroupCard';
import { Provider } from "react-redux";
import * as redux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { REQUEST_STATE } from "../../../../../../services/API/apiSlice";
import { modelGroups } from "../../../../../../store/modelsSlice/modelsSlice";

let store;
let reportError;
const groupId = parseInt(Object.keys(modelGroups)[0]);
const groupName = modelGroups[groupId].name;
const visibileSV = modelGroups[groupId].visibileSV;
console.log(Object.keys(visibileSV));
const isVisble = modelGroups[groupId].isVisible;
describe('test ModelGroupCard rendering', () => {

    beforeEach(() => {
        store = createTestStore();
        reportError = jest.fn();
    });
    
    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={groupId} />
            </Provider>
        );
    });

    it('renders correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={groupId} />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('renders modelGroup name', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={groupId} />
            </Provider>
        );        
        expect(getByTestId(/groupName/)).toHaveTextContent(groupName);
    });

    test.todo('raises an error function if props.modelGroupId is not provided');

    it('raises a console.error function if props.reportError is not provided', () => {
        console.error = jest.fn();
        render(            
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} />
            </Provider>
        );
        expect(console.error).toHaveBeenCalled();
    });

    it('renders checkboxes correctly checked', () => {
        const { getByLabelText } = render(            
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );

        for (let key in visibileSV) {
            expect(getByLabelText(key)).toBeInTheDocument();
            expect(getByLabelText(key)).toHaveProperty('checked', visibileSV[key]);
        }
    });

    it('renders visibility icon correctly', () => {
        const { getByTestId } = render(            
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );
        expect(getByTestId(/VisibilityIcon-visible/)).toBeInTheDocument();
    });
});

describe('test ModelGroupCard functionality', () => {

    beforeEach(() => {
        store = createTestStore();
    });

    test.todo("dispatches setStatisticalValueForGroup with correct payload when checkbox is clicked");
    test.todo("dispatches setVisibilityForGroup with correct payload when icon is clicked");
    test.todo('test whether edit model group modal opens');
    test.todo('test whether add model group modal opens');

});
