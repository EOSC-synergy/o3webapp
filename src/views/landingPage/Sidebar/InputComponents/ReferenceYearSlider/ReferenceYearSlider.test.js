import React from 'react';
import ReactDOM from 'react-dom';
import ReferenceYearSlider from './ReferenceYearSlider';
import { render } from '@testing-library/react';
import "@testing-library/jest-dom/extend-expect";

it('Component renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ReferenceYearSlider />, div);
});

// Snapshot test
it('Component renders correctly from config file', () => {
    const { container } = render(<ReferenceYearSlider />);
    expect(container).toMatchSnapshot();
});
