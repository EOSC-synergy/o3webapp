import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import RegionSelector from 'views/landingPage/Sidebar/InputComponents/RegionSelector';
import { AppStore, createTestStore } from 'store/store';
import { setActivePlotId } from 'store/plotSlice';

let store: AppStore;
beforeEach(() => {
    store = createTestStore();
    store.dispatch(setActivePlotId({ plotId: 'tco3_return' })); // this component is only for the
});

describe('tests basic rendering', () => {
    it('renders without crashing', () => {
        render(
            <>
                <Provider store={store}>
                    <RegionSelector />
                </Provider>
            </>
        );
    });

    it('renders correctly', () => {
        const { container } = render(
            <>
                <Provider store={store}>
                    <RegionSelector />
                </Provider>
            </>
        );

        expect(container).toMatchSnapshot();
    });
});

describe('tests redux functionality', () => {
    it('updates the region(s) accordingly to the deselection in the store', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <RegionSelector />
            </Provider>
        );

        // before clicking
        expect(
            store.getState().plot.plotSpecificSettings.tco3_return.displayXRange.regions
        ).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);

        fireEvent.click(getByTestId('RegionSelector-0'));
        fireEvent.click(getByTestId('RegionSelector-1'));
        fireEvent.click(getByTestId('RegionSelector-2'));
        fireEvent.click(getByTestId('RegionSelector-3'));

        // after clicking
        expect(
            store.getState().plot.plotSpecificSettings.tco3_return.displayXRange.regions
        ).toEqual([4, 5, 6, 7]);
    });

    it('updates the region(s) accordingly to the selection in the store', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <RegionSelector />
            </Provider>
        );

        // SETUP

        // before clicking
        expect(
            store.getState().plot.plotSpecificSettings.tco3_return.displayXRange.regions
        ).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);

        fireEvent.click(getByTestId('RegionSelector-0'));
        fireEvent.click(getByTestId('RegionSelector-1'));
        fireEvent.click(getByTestId('RegionSelector-2'));
        fireEvent.click(getByTestId('RegionSelector-3'));

        // after deselecting
        expect(
            store.getState().plot.plotSpecificSettings.tco3_return.displayXRange.regions
        ).toEqual([4, 5, 6, 7]);

        // new test case starts HERE

        fireEvent.click(getByTestId('RegionSelector-0'));
        fireEvent.click(getByTestId('RegionSelector-1'));
        fireEvent.click(getByTestId('RegionSelector-2'));
        fireEvent.click(getByTestId('RegionSelector-3'));

        // after selecting
        expect(
            store.getState().plot.plotSpecificSettings.tco3_return.displayXRange.regions
        ).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });
});
