import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import XAxisField from './XAxisField';
import { createTestStore } from "../../../../../store/store"
import {fireEvent} from '@testing-library/dom';

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

        const { container, getByTestId } = render(
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

        const { container, getByTestId } = render(
            <Provider store={store}>
                <XAxisField />
            </Provider>
        );     
        const inputField = getByTestId("XAxisField-left-input");
        fireEvent.change(inputField, {target: {value: "2010"}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX).toEqual(2010);
    });
});