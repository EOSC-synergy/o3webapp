import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTestStore } from '../../../../../../../src/store/store';
import { Provider } from 'react-redux';
import ModelGroupConfigurator from '../../../../../../../src/views/landingPage/Sidebar/InputComponents/ModelGroupConfigurator/ModelGroupConfigurator';
import userEvent from '@testing-library/user-event';
import * as redux from 'react-redux';

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
        const mockSelector = jest.fn();
        const redux = jest.mock('react-redux', () => ({
            ...jest.requireActual('react-redux'),
            useSelector: () => mockSelector,
        }));
        const spy = mockSelector;
        //const spy = jest.spyOn(redux, 'useSelector');
        const modelGroupName = 'blob';
        const fakeModelGroupName = 'blub';

        spy.mockReturnValueOnce([0])
            .mockReturnValueOnce(modelGroupName)
            .mockReturnValueOnce({
                median: true,
                mean: true,
                'standard deviation': false,
                percentile: true,
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
