import { REQUEST_STATE } from 'services/API/apiSlice';
import React from 'react';
import PlotTypeSelector from 'views/landingPage/Sidebar/InputComponents/PlotTypeSelector';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { AppStore, createTestStore, GlobalState } from 'store';
import { Provider } from 'react-redux';

let store: AppStore;
describe('plot type selector test', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('PlotTypeSelector reports error if an error occurred in the fetching of plotTypes', async () => {
        const message = 'Error Message';
        const testStore = createTestStore({
            api: {
                plotTypes: {
                    status: REQUEST_STATE.error,
                    data: [],
                    error: message,
                },
            },
        } as unknown as GlobalState);
        const errorMessage = `API not responding: ${message}`;

        const reportError = jest.fn();

        render(
            <Provider store={testStore}>
                <PlotTypeSelector reportError={reportError} />
            </Provider>
        );
        expect(reportError.mock.calls[0][0]).toEqual(errorMessage);
    });

    it('should render all the returned data from the api', () => {
        const RETURNED_OPTIONS = ['tco3_zm', 'tco3_return'];
        const testStore = createTestStore({
            api: {
                plotTypes: {
                    status: REQUEST_STATE.success,
                    data: RETURNED_OPTIONS,
                    error: null,
                },
            },
            plot: {
                plotId: RETURNED_OPTIONS[0],
            },
        } as unknown as GlobalState);

        const { getByRole, getAllByRole } = render(
            <Provider store={testStore}>
                <PlotTypeSelector reportError={() => undefined} />
            </Provider>
        );

        act(() => {
            const trigger = getByRole('button');
            fireEvent.mouseDown(trigger);
        });

        const options = getAllByRole('option');

        expect(options.length).toEqual(RETURNED_OPTIONS.length);
        for (let i = 0; i < options.length; ++i) {
            expect(options[i].textContent).toEqual(RETURNED_OPTIONS[i]);
        }
    });

    it('should update the clicked value in the store', () => {
        const RETURNED_OPTIONS = ['tco3_zm', 'tco3_return'];

        const testStore = createTestStore({
            api: {
                plotTypes: {
                    status: REQUEST_STATE.success,
                    data: RETURNED_OPTIONS,
                    error: null,
                },
            },
            plot: {
                plotId: RETURNED_OPTIONS[0],
            },
        } as unknown as GlobalState);

        expect(testStore.getState().plot.plotId).toEqual(RETURNED_OPTIONS[0]); // default in store

        const { getByRole, getAllByRole } = render(
            <Provider store={testStore}>
                <PlotTypeSelector reportError={() => undefined} />
            </Provider>
        );

        act(() => {
            const trigger = getByRole('button');
            fireEvent.mouseDown(trigger);
        });
        act(() => {
            const options = getAllByRole('option');
            options[1].click(); // click on second option (tco3_return)
        });
        expect(testStore.getState().plot.plotId).toEqual(RETURNED_OPTIONS[1]); // after selection
    });

    it('should display a spinner while loading', () => {
        const mockDispatch = jest.fn();
        const mockSelector = jest.fn();
        jest.mock('react-redux', () => ({
            ...jest.requireActual('react-redux'),
            useDispatch: () => mockDispatch,
            useSelector: () => mockSelector,
        }));

        mockSelector
            .mockReturnValueOnce(
                // mock api request
                {
                    status: REQUEST_STATE.loading,
                    data: [],
                    error: null,
                }
            )
            .mockReturnValueOnce('tco3_zm');

        const { getByRole } = render(
            <Provider store={store}>
                <PlotTypeSelector reportError={() => undefined} />
            </Provider>
        );

        const trigger = getByRole('button');
        fireEvent.mouseDown(trigger);

        const loader = screen.getByTestId('plotTypeSelectorLoading');
        expect(loader).toBeInTheDocument();
    });
});
