import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTestStore } from '../../../../../../../src/store';
import { Provider } from 'react-redux';
import ModelGroupConfigurator from '../../../../../../../src/views/landingPage/Sidebar/InputComponents/ModelGroupConfigurator';
import userEvent from '@testing-library/user-event';
import { setModelsOfModelGroup } from '../../../../../../../src/store/modelsSlice';

let store;
describe('test ModelGroupCard rendering', () => {
    beforeEach(() => {
        store = createTestStore();
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
        act(() => {
            userEvent.click(getByTestId(/addModelGroup-button/));
        });
        expect(getByTestId(/addModelGroupModal/)).toBeInTheDocument();
    });
});

describe('test functionality redux', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders all model group cards in store', () => {
        const modelGroupName = 'blob';
        const fakeModelGroupName = 'blub';

        store.dispatch(
            setModelsOfModelGroup({
                groupId: undefined, // no valid id => add new group
                groupName: modelGroupName,
                modelList: [
                    'CCMI-1_ACCESS_ACCESS-CCM-refC2',
                    'CCMI-1_ACCESS_ACCESS-CCM-senC2fGHG',
                    'CCMI-1_CCCma_CMAM-refC2',
                ],
            })
        );

        const { getByText, queryByText } = render(
            <Provider store={store}>
                <ModelGroupConfigurator reportError={jest.fn()} />
            </Provider>
        );

        expect(getByText(modelGroupName)).toBeInTheDocument();
        expect(queryByText(fakeModelGroupName)).toBeNull();
    });
});
