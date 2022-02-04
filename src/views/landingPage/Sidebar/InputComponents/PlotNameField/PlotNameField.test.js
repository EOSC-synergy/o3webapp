import React from 'react';
import '@testing-library/jest-dom';
import PlotNameField from './PlotNameField';
import { render, fireEvent } from '@testing-library/react';
import { createTestStore } from '../../../../../store/store';
import { Provider } from "react-redux";
import { PLOT_NAME_MAX_LEN } from "../../../../../utils/constants"

let store;
beforeEach(() => {
  store = createTestStore();
});


it('renders without crashing', () => {
  render(<Provider store={store}><PlotNameField /></Provider>);
});

it('renders correctly', () => {
  const { container } = render(<Provider store={store}><PlotNameField /></Provider>);
  expect(container).toMatchSnapshot();
});

it('renders TextField correctly', () => {
  const { getByTestId } = render(<Provider store={store}><PlotNameField /></Provider>);
  const input = getByTestId("plot-field");
  expect(input).toBeInTheDocument();
});

it('changes the name correctly', () => {
    
    
  const { getByTestId } = render(<Provider store={store}><PlotNameField /></Provider>);

  const selectNode = getByTestId("plot-field").querySelector('input');

  // Assert: if it fails the initial state may have changed
  expect(store.getState().plot.plotSpecificSettings.tco3_zm.title).toEqual("OCTS Plot"); 
  

  // Check if the value updates correctly
  fireEvent.change(selectNode, {target: {value: "Test"}} );
  expect(store.getState().plot.plotSpecificSettings.tco3_zm.title).toEqual("Test");

  // Check for max. length.
  fireEvent.change(selectNode, {target: {value: (Array(PLOT_NAME_MAX_LEN + 1).join("A") + "B")}} );
  expect(store.getState().plot.plotSpecificSettings.tco3_zm.title).toEqual(Array(PLOT_NAME_MAX_LEN + 1).join("A")); //
  
})






