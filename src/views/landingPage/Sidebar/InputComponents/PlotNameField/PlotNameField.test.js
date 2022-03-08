import React from 'react';
import '@testing-library/jest-dom';
import PlotNameField from './PlotNameField';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTestStore } from '../../../../../store/store';
import { Provider } from "react-redux";
import { PLOT_NAME_MAX_LEN } from "../../../../../utils/constants";
import { initialState } from "../../../../../store/plotSlice/plotSlice";

let store;
beforeEach(() => {
  store = createTestStore();
});


it('renders without crashing', () => {
  render(<Provider store={store}><PlotNameField reportError={() => {}}/></Provider>);
});

it('renders correctly', () => {
  const { container } = render(<Provider store={store}><PlotNameField reportError={() => {}}/></Provider>);
  expect(container).toMatchSnapshot();
});

it('renders TextField correctly', () => {
  const { getByTestId } = render(<Provider store={store}><PlotNameField reportError={() => {}}/></Provider>);
  const input = getByTestId("plot-field");
  expect(input).toBeInTheDocument();
});

it('changes the name correctly', () => {
    
    
  const { getByTestId } = render(<Provider store={store}><PlotNameField reportError={() => {}} /></Provider>);

  const selectNode = getByTestId("plot-field").querySelector('input');

  // Assert: if it fails the initial state may have changed
  expect(store.getState().plot.plotSpecificSettings.tco3_zm.title).toEqual(initialState.plotSpecificSettings.tco3_zm.title); 
  

  // Check if the value updates correctly
  userEvent.clear(selectNode);
  userEvent.type(selectNode, "Test{enter}");
  expect(store.getState().plot.plotSpecificSettings.tco3_zm.title).toEqual("Test");

  // Check for max. length.
  userEvent.clear(selectNode);
  userEvent.type(selectNode, (Array(PLOT_NAME_MAX_LEN + 1).join("A") + "B{enter}"));
  expect(store.getState().plot.plotSpecificSettings.tco3_zm.title).toEqual(Array(PLOT_NAME_MAX_LEN + 1).join("A")); //
  
})






