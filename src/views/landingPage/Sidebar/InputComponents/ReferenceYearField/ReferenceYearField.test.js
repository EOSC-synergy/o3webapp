import React from 'react';
import ReferenceYearField from './ReferenceYearField';
import { render, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";
import { createTestStore } from '../../../../../store/store';
import { Provider } from "react-redux";
import { END_YEAR, START_YEAR } from '../../../../../utils/constants';

let store;

beforeEach(() => {
    store = createTestStore();
});

describe("tests basic rendering", () => {
    it('Component renders without crashing', () => {
        render(<Provider store={store}><ReferenceYearField /></Provider>);
    
    });
  
  
    // Snapshot test
    it('renders correctly', () => {
        const { container } = render(<Provider store={store}><ReferenceYearField /></Provider>);
        expect(container).toMatchSnapshot();
    });
});

describe("tests redux functionality", () => {
    it("updates the reference year value in the store correctly", () => {
        const startValue = store.getState().reference.settings.year;
        const newValue = startValue + 20;

        const { getByTestId } = render(
            <Provider store={store}>
                <ReferenceYearField />
            </Provider>
        );
        const inputField = getByTestId("ReferenceYearField-year");
        fireEvent.change(inputField, {target: {value: newValue}}); // change input
        expect(store.getState().reference.settings.year).toEqual(String(newValue));

    });

    it("doesn't update the store if the reference year value is outside of the allowed range", () => {
        const startValue = store.getState().reference.settings.year;

        const { getByTestId } = render(
            <Provider store={store}>
                <ReferenceYearField />
            </Provider>
        );
        const inputField = getByTestId("ReferenceYearField-year");
        fireEvent.change(inputField, {target: {value: END_YEAR + 1}}); // change input (not valid)
        expect(store.getState().reference.settings.year).toEqual(startValue);
        fireEvent.change(inputField, {target: {value: START_YEAR - 1}}); // change input (not valid)
        expect(store.getState().reference.settings.year).toEqual(startValue);
    });

    it("toggles the visibility of the reference line in the store correctly", () => {
      const startValue = store.getState().reference.settings.visible;


      const { getByTestId } = render(
          <Provider store={store}>
              <ReferenceYearField />
          </Provider>
      );
      const toggleButton = getByTestId("ReferenceYearField-toggleVisibility");
      fireEvent.click(toggleButton); // toggle visibility
      console.log(store.getState().reference.settings.visible);
      expect(store.getState().reference.settings.visible).toEqual(!startValue);
    });


});

