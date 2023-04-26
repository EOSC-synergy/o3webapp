import React from 'react';
import Navbar from 'components/Navbar/index';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

it('renders without crashing', () => {
    render(<Navbar />);
});

// Snapshot test
it('renders correctly', () => {
    const { asFragment } = render(<Navbar />);
    expect(asFragment()).toMatchSnapshot();
});
