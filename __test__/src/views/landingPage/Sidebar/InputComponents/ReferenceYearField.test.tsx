import React from 'react';
import ReferenceYearField from 'views/landingPage/Sidebar/InputComponents/ReferenceYearField';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppStore, createTestStore } from 'store';
import { Provider } from 'react-redux';
import { END_YEAR, START_YEAR } from 'utils/constants';
import userEvent from '@testing-library/user-event';

let store: AppStore;

beforeEach(() => {
    store = createTestStore();
});

describe('tests redux functionality', () => {
    it('updates the reference year value in the store correctly', () => {
        const startValue = store.getState().reference.settings.year;
        const newValue = startValue + 20;

        const { getByTestId } = render(
            <Provider store={store}>
                <ReferenceYearField />
            </Provider>
        );
        const inputField = getByTestId('ReferenceYearField-year');
        act(() => {
            fireEvent.change(inputField, { target: { value: newValue } }); // change input
        });
        expect(store.getState().reference.settings.year).toEqual(newValue);
    });

    it('toggles the visibility of the reference line in the store correctly', () => {
        const startValue = store.getState().reference.settings.visible;

        const { getByTestId } = render(
            <Provider store={store}>
                <ReferenceYearField />
            </Provider>
        );
        const toggleButton = getByTestId('ReferenceYearField-toggleVisibility');
        act(() => {
            userEvent.click(toggleButton); // toggle visibility
        });
        expect(store.getState().reference.settings.visible).toEqual(!startValue);
    });
});

describe('tests error handling', () => {
    it('displays a warning if the reference year value is outside of the allowed range', () => {
        const { getByTestId, container } = render(
            <Provider store={store}>
                <ReferenceYearField />
            </Provider>
        );
        const inputField = getByTestId('ReferenceYearField-year');
        act(() => {
            fireEvent.change(inputField, { target: { value: END_YEAR + 1 } }); // change input (not valid)
        });
        expect(container).toHaveTextContent(`>${END_YEAR}`);
        act(() => {
            fireEvent.change(inputField, { target: { value: START_YEAR - 1 } }); // change input (not valid)
        });
        expect(container).toHaveTextContent(`<${START_YEAR}`);
    });
});
