import {render, fireEvent, waitForElementToBeRemoved} from '@testing-library/react';
import '@testing-library/jest-dom';
import {createTestStore} from '../../../../../../store/store';
import ModelGroupCard from './ModelGroupCard';
import {Provider} from "react-redux";
import userEvent from '@testing-library/user-event';
import {setModelsOfModelGroup} from "../../../../../../store/modelsSlice/modelsSlice";
import {DEFAULT_MODEL_GROUP, STATISTICAL_VALUES} from '../../../../../../utils/constants';

let store;
let reportError;
let groupId;
let groupName;
let visibleSV;

describe('test ModelGroupCard rendering', () => {

    beforeEach(() => {
        store = createTestStore();
        const modelGroups = store.getState().models.modelGroups;
        groupId = parseInt(Object.keys(modelGroups)[0]);
        groupName = modelGroups[groupId].name;
        visibleSV = modelGroups[groupId].visibleSV;
        reportError = jest.fn();
    });

    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={groupId}/>
            </Provider>
        );
    });

    it('renders correctly', () => {
        const {container} = render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={groupId}/>
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('renders modelGroup name', () => {
        const {getByTestId} = render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={groupId}/>
            </Provider>
        );
        expect(getByTestId(/groupName/)).toHaveTextContent(groupName);
    });

    test.todo('raises an error function if props.modelGroupId is not provided');

    it('raises a console.error function if props.reportError is not provided', () => {
        console.error = jest.fn();
        render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId}/>
            </Provider>
        );
        expect(console.error).toHaveBeenCalled();
    });

    it('renders checkboxes correctly checked', () => {
        const {getByLabelText} = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError}/>
            </Provider>
        );

        for (let key in visibleSV) {
            expect(getByLabelText(key)).toBeInTheDocument();
            expect(getByLabelText(key)).toHaveProperty('checked', visibleSV[key]);
        }
    });

    it('renders visibility icon correctly', () => {
        const {getByTestId} = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError}/>
            </Provider>
        );
        expect(getByTestId(/VisibilityIcon-visible/)).toBeInTheDocument();
    });
});

describe('test ModelGroupCard functionality', () => {

    beforeEach(() => {
        store = createTestStore();
        const modelGroups = store.getState().models.modelGroups;
        groupId = parseInt(Object.keys(modelGroups)[0]);
        groupName = modelGroups[groupId].name;
        visibleSV = modelGroups[groupId].visibleSV;
    });

    /*
    it('checks / unchecks statistical values, when visibility icon is clicked', () => {
        const { getByTestId, getByLabelText } = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );
        const visibilityIcon = getByTestId(/VisibilityIcon-visible/)
        expect(visibilityIcon).toBeInTheDocument();
        for(const key in STATISTICAL_VALUES) {
            expect(getByLabelText(key)).toBeInTheDocument();
            expect(getByLabelText(key)).toHaveProperty('checked', true);
        }
        userEvent.click(visibilityIcon);
        expect(getByTestId(/VisibilityIcon-invisible/)).toBeInTheDocument();
        for(const key in STATISTICAL_VALUES) {
            expect(getByLabelText(key)).toBeInTheDocument();
            expect(getByLabelText(key)).toHaveProperty('checked', false);
        }
    });
     */

    it("dispatches setStatisticalValueForGroup with correct payload when checkbox is clicked", () => {
        const {baseElement, getByTestId} = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError}/>
            </Provider>
        );
        
        expect(
            store.getState().models.modelGroups["0"].visibleSV
        ).toEqual(
            {
                mean: true,
                'standard deviation': true,
                median: true,
                percentile: true
            }
        );
        userEvent.click(getByTestId("ModelGroupCard-toggle-mean-checkbox"));
        expect(
            store.getState().models.modelGroups["0"].visibleSV
        ).toEqual(
            {
                mean: false,
                'standard deviation': true,
                median: true,
                percentile: true
            }
        );
    });

    test.todo("dispatches setStatisticalValueForGroup with correct payload when checkbox is clicked");
    test.todo("dispatches setVisibilityForGroup with correct payload when icon is clicked");
    test.todo("dispatches delete Model Group when delete icon is clicked");

    it('opens edit model group modal', () => {
        const {baseElement, getByTestId} = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError}/>
            </Provider>
        );
        expect(getByTestId(/EditModelGroupModal-button-open/)).toBeInTheDocument();
        const editSVButton = getByTestId(/EditModelGroupModal-button-open/);
        userEvent.click(editSVButton);
        expect(baseElement).toMatchSnapshot();
        expect(getByTestId(/EditModelGroupModal-modal-wrapper/)).toBeInTheDocument();
    });

    it('opens add model group modal', () => {
        const {baseElement, getByTestId} = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError}/>
            </Provider>
        );
        expect(getByTestId(/EditModelGroupModal-button-open/)).toBeInTheDocument();
        const editMemberButton = getByTestId(/AddModelGroupModal-button-open/);
        userEvent.click(editMemberButton);
        expect(baseElement).toMatchSnapshot();
        expect(getByTestId(/AddModelGroupModal-modal-wrapper/)).toBeInTheDocument();
    });

});
