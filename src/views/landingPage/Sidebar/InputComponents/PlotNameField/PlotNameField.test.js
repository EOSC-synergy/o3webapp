import React from 'react';
import ReactDOM from 'react-dom';
import PlotNameField from './PlotNameField';

console.error = jest.fn();


test('PlotNameField renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlotNameField />, div);
});




