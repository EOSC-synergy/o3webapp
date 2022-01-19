import React from 'react';
import PlotNameField from './PlotNameField';
import { render, fireEvent } from '@testing-library/react';
import { createTestStore } from '../../../../../store/store';

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

it('renders the input of the sarchbar', () => {
  const { getByTestId } = render(<Provider store={store}><PlotNameField /></Provider>);
  const input = getByTestId("PlotNameField");
  expect(input).toBeInTheDocument();
});





