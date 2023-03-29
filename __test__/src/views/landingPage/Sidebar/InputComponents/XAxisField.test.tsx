import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import XAxisField from 'views/landingPage/Sidebar/InputComponents/XAxisField';
import { AppStore, createTestStore } from 'store';
import { END_YEAR, START_YEAR } from 'utils/constants';

describe('tests basic rendering', () => {
    let store: AppStore;
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders without crashing', () => {
        render(
            <>
                <Provider store={store}>
                    <XAxisField />
                </Provider>
            </>
        );
    });

    it('renders correctly', () => {
        const { container } = render(
            <>
                <Provider store={store}>
                    <XAxisField />
                </Provider>
            </>
        );

        expect(container).toMatchSnapshot();
    });
});

describe('test functionality redux', () => {
    let store: AppStore;
    beforeEach(() => {
        store = createTestStore();
    });

    it('should update the store on user input (left field)', () => {
        // value before change
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX).toEqual(
            1960
        );

        const { getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );
        const inputField = getByTestId('XAxisField-left-input');
        fireEvent.change(inputField, { target: { value: '2000' } }); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX).toEqual(
            2000
        );
    });

    it('should update the store on user input (right field)', () => {
        // value before change
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX).toEqual(
            2100
        );

        const { getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );
        const inputField = getByTestId('XAxisField-right-input');
        fireEvent.change(inputField, { target: { value: '2010' } }); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX).toEqual(
            2010
        );
    });
});

describe('test error handling functionality', () => {
    let store: AppStore;
    beforeEach(() => {
        store = createTestStore();
    });

    it("doesn't update if the value is smaller than START_YEAR (1960)", () => {
        const previousState =
            store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX;

        const { container, getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );
        const inputField = getByTestId('XAxisField-left-input');
        fireEvent.change(inputField, { target: { value: START_YEAR - 1 } }); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX).toEqual(
            previousState
        ); // no update took place
        expect(container).toHaveTextContent(`<${START_YEAR}`); // expect that error is displayed
    });

    it("doesn't update if the value is greater than END_YEAR (1960)", () => {
        const previousState =
            store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX;

        const { container, getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );
        const inputField = getByTestId('XAxisField-right-input');
        fireEvent.change(inputField, { target: { value: END_YEAR + 1 } }); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX).toEqual(
            previousState
        ); // no update took place
        expect(container).toHaveTextContent(`>${END_YEAR}`); // expect that error is displayed
    });

    it("doesn't update if LEFT >= RIGHT", () => {
        const previousState =
            store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX;

        const { container, getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );
        const inputFieldLeft = getByTestId('XAxisField-left-input');
        const inputFieldRight = getByTestId('XAxisField-right-input');
        fireEvent.change(inputFieldLeft, { target: { value: 2060 } }); // change input
        fireEvent.change(inputFieldRight, { target: { value: 2060 } }); // change input (should have no effect)
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX).toEqual(
            2060
        ); // assure left got updated correctly
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX).toEqual(
            previousState
        ); // no update took place on the right side
        expect(container).toHaveTextContent('min>=max'); // expect that error is displayed
    });

    it("doesn't accept non-numerical input", () => {
        const previousState =
            store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX;

        const { getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );
        const inputFieldRight = getByTestId('XAxisField-right-input');
        fireEvent.change(inputFieldRight, { target: { value: 'test' } }); // change input (should have no effect)
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX).toEqual(
            previousState
        ); // no update took place
    });
});
