import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import XAxisField from './XAxisField';
import { createTestStore } from "../../../../../store/store"
import {fireEvent} from '@testing-library/dom';
import { END_YEAR, START_YEAR } from '../../../../../utils/constants';

describe('tests basic rendering', () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders without crashing', () => {
        render(<>
            <Provider store={store}>
                <XAxisField reportError={() => {}} />
            </Provider>
        </>)
    });

    it('renders correctly', () => {

        const { container } = render(<>
            <Provider store={store}>
                <XAxisField reportError={() => {}} />
            </Provider>
        </>);

        expect(container).toMatchSnapshot();
    });
});

describe('test functionality redux', () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
    });

    it('should update the store on user input (left field)', () => {
        // value before change
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX).toEqual(1960);

        const { getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );     
        const inputField = getByTestId("XAxisField-left-input");
        fireEvent.change(inputField, {target: {value: "2000"}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX).toEqual(2000);
    });

    it('should update the store on user input (right field)', () => {
        // value before change
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX).toEqual(2100);

        const { getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );     
        const inputField = getByTestId("XAxisField-right-input");
        fireEvent.change(inputField, {target: {value: "2010"}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX).toEqual(2010);
    });
});

describe('test error handling functionality', () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
    });

    it("doesn't update if the value is smaller than START_YEAR (1960)", () => {
        const previousState = store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX;

        const { container, getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );     
        const inputField = getByTestId("XAxisField-left-input");
        fireEvent.change(inputField, {target: {value: START_YEAR - 1}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX).toEqual(previousState); // no update took place
        expect(container).toHaveTextContent(`<${START_YEAR}`); // expect that error is displayed
    });

    it("doesn't update if the value is greater than END_YEAR (1960)", () => {
        const previousState = store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX;

        const { container, getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );     
        const inputField = getByTestId("XAxisField-right-input");
        fireEvent.change(inputField, {target: {value: END_YEAR + 1}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX).toEqual(previousState); // no update took place
        expect(container).toHaveTextContent(`>${END_YEAR}`); // expect that error is displayed
    });

    it("doesn't update if the value on the left is greater than the value on the right", () => {

        const { container, getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );     
        const inputField = getByTestId("XAxisField-right-input");
        fireEvent.change(inputField, {target: {value: END_YEAR + 1}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX).toEqual(previousState); // no update took place
        expect(container).toHaveTextContent(`>${END_YEAR}`); // expect that error is displayed
    });

   

});