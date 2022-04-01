import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux'
import YAxisField from './YAxisField';
import { createTestStore } from "../../../../../store/store"
import { setActivePlotId, setDisplayYRangeForPlot } from '../../../../../store/plotSlice/plotSlice';
import { O3AS_PLOTS } from '../../../../../utils/constants';

describe("tests basic rendering", () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
    });
    
    it('renders without crashing', () => {
        render(<>
            <Provider store={store}>
                <YAxisField reportError={() => {}} />
            </Provider>
        </>)
    });
    
    it('renders correctly', () => {
    
        const { container } = render(<>
            <Provider store={store}>
                <YAxisField reportError={() => {}} />
            </Provider>
        </>);
    
        expect(container).toMatchSnapshot();
    });
});

describe('test functionality redux for tco3_zm', () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
        store.dispatch(setDisplayYRangeForPlot({plotId: O3AS_PLOTS.tco3_zm, minY: 270, maxY: 330}));
        store.dispatch(setDisplayYRangeForPlot({plotId: O3AS_PLOTS.tco3_return, minY: 2000, maxY: 2100}));
    });

    it('should update the store on user input (left field)', () => {
        const startValue = store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.minY;
        const newValue = startValue - 20;

        const { getByTestId } = render(
            <Provider store={store}>
                <YAxisField />
            </Provider>
        );
        const inputField = getByTestId("YAxisField-left-input");
        fireEvent.change(inputField, {target: {value: newValue}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.minY).toEqual(newValue);
    });

    it('should update the store on user input (right field)', () => {
        const startValue = store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.maxY;
        const newValue = startValue + 20;

        const { getByTestId } = render(
            <Provider store={store}>
                <YAxisField />
            </Provider>
        );
        const inputField = getByTestId("YAxisField-right-input");
        fireEvent.change(inputField, {target: {value: newValue}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.maxY).toEqual(newValue);
    });
});

describe('test functionality redux for tco3_return', () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
        store.dispatch(setActivePlotId({plotId: O3AS_PLOTS.tco3_return}))
        store.dispatch(setDisplayYRangeForPlot({plotId: O3AS_PLOTS.tco3_zm, minY: 270, maxY: 330}));
        store.dispatch(setDisplayYRangeForPlot({plotId: O3AS_PLOTS.tco3_return, minY: 2000, maxY: 2100}));
    });

    it('should update the store on user input (left field)', () => {
        const startValue = store.getState().plot.plotSpecificSettings.tco3_return.displayYRange.minY;
        const newValue = startValue - 20;

        const { getByTestId } = render(
            <Provider store={store}>
                <YAxisField />
            </Provider>
        );
        const inputField = getByTestId("YAxisField-left-input");
        fireEvent.change(inputField, {target: {value: newValue}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_return.displayYRange.minY).toEqual(newValue);
    });

    it('should update the store on user input (right field)', () => {
        const startValue = store.getState().plot.plotSpecificSettings.tco3_return.displayYRange.maxY;
        const newValue = startValue + 20;

        const { getByTestId } = render(
            <Provider store={store}>
                <YAxisField />
            </Provider>
        );
        const inputField = getByTestId("YAxisField-right-input");
        fireEvent.change(inputField, {target: {value: newValue}}); // change input
        expect(store.getState().plot.plotSpecificSettings.tco3_return.displayYRange.maxY).toEqual(newValue);
    });
});


describe('test error handling functionality', () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
        store.dispatch(setDisplayYRangeForPlot({plotId: O3AS_PLOTS.tco3_zm, minY: 270, maxY: 330}));
        store.dispatch(setDisplayYRangeForPlot({plotId: O3AS_PLOTS.tco3_return, minY: 2000, maxY: 2100}));
    });

    it("doesn't update if LEFT >= RIGHT", () => {
        const previousState = store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.maxY;

        const { container, getByTestId } = render(
            <Provider store={store}>
                <YAxisField />
            </Provider>
        );     
        const inputFieldLeft = getByTestId("YAxisField-left-input");
        const inputFieldRight = getByTestId("YAxisField-right-input");
        fireEvent.change(inputFieldLeft, {target: {value: 300}}); // change input
        fireEvent.change(inputFieldRight, {target: {value: 300}}); // change input (should have no effect)
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.minY).toEqual(300); // assure left got updated correctly
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.maxY).toEqual(previousState); // no update took place on the right side
        expect(container).toHaveTextContent("min>=max"); // expect that error is displayed
    });

    it("doesn't accept values <0", () => {
        const previousState = store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.minY;

        const { container, getByTestId } = render(
            <Provider store={store}>
                <YAxisField />
            </Provider>
        );     
        const inputFieldRight = getByTestId("YAxisField-left-input");
        fireEvent.change(inputFieldRight, {target: {value: "-42"}}); // change input (should have no effect)
        expect(store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.minY).toEqual(previousState); // no update took place
        expect(container).toHaveTextContent("<0"); // expect that error is displayed
    });

});
