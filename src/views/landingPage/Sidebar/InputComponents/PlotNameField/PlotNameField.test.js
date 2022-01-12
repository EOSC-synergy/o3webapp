import React from 'react';
import ReactDOM from 'react-dom';
import PlotNameField from './PlotNameField';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

console.error = jest.fn();


test('PlotNameField renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlotNameField />, div);
});




