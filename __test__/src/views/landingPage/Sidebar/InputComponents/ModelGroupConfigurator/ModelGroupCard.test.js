import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTestStore } from '../../../../../../../src/store';
import ModelGroupCard from '../../../../../../../src/views/landingPage/Sidebar/InputComponents/ModelGroupConfigurator/ModelGroupCard';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';

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
                <ModelGroupCard reportError={reportError} modelGroupId={groupId} />
            </Provider>
        );
    });

    /*
    it('renders correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={groupId} />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });
    */

    it('renders modelGroup name', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <ModelGroupCard reportError={reportError} modelGroupId={groupId} />
            </Provider>
        );
        expect(getByTestId(/groupName/)).toHaveTextContent(groupName);
    });

    it('renders checkboxes correctly checked', () => {
        const { getByLabelText } = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );

        for (let key in visibleSV) {
            expect(getByLabelText(key)).toBeInTheDocument();
            expect(getByLabelText(key)).toHaveProperty('checked', visibleSV[key]);
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
        const modelGroups = store.getState().models.modelGroups;
        groupId = parseInt(Object.keys(modelGroups)[0]);
        groupName = modelGroups[groupId].name;
        visibleSV = modelGroups[groupId].visibleSV;
    });

    it('dispatches setStatisticalValueForGroup with correct payload when checkbox is clicked', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );

        expect(store.getState().models.modelGroups['0'].visibleSV).toEqual({
            mean: true,
            'standard deviation': true,
            median: true,
            percentile: true,
        });
        act(() => {
            userEvent.click(getByTestId('ModelGroupCard-toggle-mean-checkbox'));
        });
        expect(store.getState().models.modelGroups['0'].visibleSV).toEqual({
            mean: false,
            'standard deviation': true,
            median: true,
            percentile: true,
        });
    });

    it('dispatches setVisibilityForGroup with correct payload when icon is clicked', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );

        const visibilityIcon = getByTestId('ModelGroupCard-VisibilityIcon-visible');
        expect(visibilityIcon).toBeInTheDocument();
        expect(store.getState().models.modelGroups['0'].isVisible).toEqual(true);

        act(() => {
            userEvent.click(visibilityIcon); // toggle visibility
        });

        const invisibilityIcon = getByTestId('ModelGroupCard-VisibilityIcon-invisible');
        expect(invisibilityIcon).toBeInTheDocument();
        expect(store.getState().models.modelGroups['0'].isVisible).toEqual(false);
    });

    it("opens the delete dialog and doesn't delete the model group if the keep button is clicked", () => {
        const { getByTestId, container } = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );
        const deleteIcon = getByTestId('ModelGroupCard-delete-model-group');

        expect(store.getState().models.modelGroups['0']).not.toEqual(undefined);
        act(() => {
            userEvent.click(deleteIcon); // delete model group
        });
        expect(container).toHaveTextContent('Delete this model group?');
        act(() => {
            userEvent.click(getByTestId('ModelGroupCard-delete-model-keep'));
        });

        expect(store.getState().models.modelGroups['0']).not.toEqual(undefined);
        expect(container).not.toHaveTextContent('Delete this model group?'); // delete dialog is closed
    });

    // TODO: this code does not work, seemingly due to redux lifetime / order of propagation issues (component is rendered when it shouldn't be)
    it.skip('opens the delete dialog and deletes the model group if the delete button is clicked', () => {
        const { getByTestId, container } = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );
        const deleteIcon = getByTestId('ModelGroupCard-delete-model-group');

        expect(store.getState().models.modelGroups['0']).not.toEqual(undefined);
        act(() => {
            userEvent.click(deleteIcon); // delete model group
        });
        expect(container).toHaveTextContent('Delete this model group?');

        act(() => {
            userEvent.click(getByTestId('ModelGroupCard-delete-model-delete'));
        });

        expect(store.getState().models.modelGroups['0']).toEqual(undefined);
        expect(container).not.toHaveTextContent('Delete this model group?'); // delete dialog is closed
    });

    it('opens edit model group modal', () => {
        const { baseElement, getByTestId } = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );
        expect(getByTestId(/EditModelGroupModal-button-open/)).toBeInTheDocument();
        const editSVButton = getByTestId(/EditModelGroupModal-button-open/);
        act(() => {
            userEvent.click(editSVButton);
        });
        expect(getByTestId(/EditModelGroupModal-modal-wrapper/)).toBeInTheDocument();
    });

    it('opens add model group modal', () => {
        const { baseElement, getByTestId } = render(
            <Provider store={store}>
                <ModelGroupCard modelGroupId={groupId} reportError={reportError} />
            </Provider>
        );
        expect(getByTestId(/EditModelGroupModal-button-open/)).toBeInTheDocument();
        const editMemberButton = getByTestId(/AddModelGroupModal-button-open/);
        act(() => {
            userEvent.click(editMemberButton);
        });
        expect(getByTestId(/AddModelGroupModal-modal-wrapper/)).toBeInTheDocument();
    });
});
