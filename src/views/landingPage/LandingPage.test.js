import React from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './LandingPage';
import renderer from 'react-test-renderer';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { queryByTestId } from '@testing-library/dom';


it('LandingPage renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LandingPage reportError={() => {}} />, div);
});

// Snapshot test
it('LandingPage renders correctly', () => {
    const treeClosed = renderer
        .create(<LandingPage reportError={() => {}} />)
        .toJSON();
    expect(treeClosed).toMatchSnapshot();
});