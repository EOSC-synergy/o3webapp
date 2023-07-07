import React from 'react';
import '@testing-library/jest-dom';
import PlotNameField, {
    PLOT_NAME_MAX_LEN,
} from '../../../../../../src/views/landingPage/Sidebar/InputComponents/PlotNameField';
import { render, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestStore } from '../../../../../../src/store';
import { Provider } from 'react-redux';
import { initialState } from '../../../../../../src/store/plotSlice';

let store;
beforeEach(() => {
    store = createTestStore();
});

it('renders TextField correctly', () => {
    const { getByTestId } = render(
        <Provider store={store}>
            <PlotNameField reportError={() => {}} />
        </Provider>
    );
    const input = getByTestId('plot-field');
    expect(input).toBeInTheDocument();
});

it('changes the name correctly', () => {
    const { getByTestId } = render(
        <Provider store={store}>
            <PlotNameField reportError={() => {}} />
        </Provider>
    );

    const selectNode = getByTestId('plot-field').querySelector('input');

    // Assert: if it fails the initial state may have changed
    expect(store.getState().plot.plotSpecificSettings.tco3_zm.title).toEqual(
        initialState.plotSpecificSettings.tco3_zm.title
    );

    // Check if the value updates correctly
    act(() => {
        userEvent.clear(selectNode);
        userEvent.type(selectNode, 'Test{enter}');
    });
    expect(store.getState().plot.plotSpecificSettings.tco3_zm.title).toEqual('Test');

    // Check for max. length.
    act(() => {
        userEvent.clear(selectNode);
        userEvent.type(selectNode, Array(PLOT_NAME_MAX_LEN + 1).join('A') + 'B{enter}');
    });
    expect(store.getState().plot.plotSpecificSettings.tco3_zm.title).toEqual(
        Array(PLOT_NAME_MAX_LEN + 1).join('A')
    ); //
});
