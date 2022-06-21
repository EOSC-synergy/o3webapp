import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import CustomLatitudeSelector from '.';
import { createTestStore } from '../../../../../../store/store';

let store;
beforeEach(() => {
    store = createTestStore();
});

it('renders without crashing', () => {
    render(
        <>
            <Provider store={store}>
                <CustomLatitudeSelector reportError={() => {}} />
            </Provider>
        </>
    );
});

it('renders correctly', () => {
    const { container } = render(
        <>
            <Provider store={store}>
                <CustomLatitudeSelector reportError={() => {}} />
            </Provider>
        </>
    );

    expect(container).toMatchSnapshot();
});

it('changes max. latitude correctly', () => {
    const { getByTestId } = render(
        <>
            <Provider store={store}>
                <CustomLatitudeSelector reportError={() => {}} />
            </Provider>
        </>
    );
    expect(store.getState().plot.generalSettings.location.maxLat).not.toEqual(89);
    const maxLatSelector = getByTestId('maxLatSelector').querySelector('input');
    fireEvent.change(maxLatSelector, { target: { value: '89' } });

    expect(store.getState().plot.generalSettings.location.maxLat).toEqual(89);
});

it('changes min. latitude correctly', () => {
    const { getByTestId } = render(
        <>
            <Provider store={store}>
                <CustomLatitudeSelector reportError={() => {}} />
            </Provider>
        </>
    );
    expect(store.getState().plot.generalSettings.location.minLat).not.toEqual(89);
    const minLatSelector = getByTestId('minLatSelector').querySelector('input');
    fireEvent.change(minLatSelector, { target: { value: '89' } });

    expect(store.getState().plot.generalSettings.location.minLat).toEqual(89);
});

it("doesn't changes min. and max latitude on incorrect input", () => {
    const { getByTestId } = render(
        <>
            <Provider store={store}>
                <CustomLatitudeSelector reportError={() => {}} />
            </Provider>
        </>
    );
    const maxLatSelector = getByTestId('maxLatSelector').querySelector('input');
    const minLatSelector = getByTestId('minLatSelector').querySelector('input');
    fireEvent.change(maxLatSelector, { target: { value: '91' } });
    fireEvent.change(minLatSelector, { target: { value: '-91' } });

    expect(store.getState().plot.generalSettings.location.maxLat).not.toEqual(91);
    expect(store.getState().plot.generalSettings.location.minLat).not.toEqual(-91);
});
