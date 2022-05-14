import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './NavBar';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Navbar />, div);
});

// Snapshot test
it('renders correctly', () => {
    const { asFragment } = render(<Navbar />);
    expect(asFragment()).toMatchSnapshot();
});
