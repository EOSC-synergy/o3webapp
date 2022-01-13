import React from 'react';
import ReactDOM from 'react-dom';
import PlotTypeSelector from './PlotTypeSelector';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

console.error = jest.fn();


it('PlotTypeSelector renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlotTypeSelector reportError={() => {}} />, div);
});

// Snapshot test
it('PlotTypeSelector renders correctly', () => {
    const { asFragment } = render(<PlotTypeSelector reportError={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
    userEvent.tab();  // focuses select
    expect(asFragment()).toMatchSnapshot();
});

// Prop types
it('PlotTypeSelector expects a report error function', () => {
  render(<PlotTypeSelector />);
  expect(console.error).toHaveBeenCalledTimes(1);
});

test.todo("check that all options from O3As API are rendered");
test.todo("check circular waiting is rendered");
test.todo("check select expands");
