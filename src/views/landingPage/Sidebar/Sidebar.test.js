import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './Sidebar';
import renderer from 'react-test-renderer';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';


it('Sidebar renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Sidebar />, div);
});

// Snapshot test
it('Sidebar renders correctly', () => {
    const treeClosed = renderer
        .create(<Sidebar isOpen={false} />)
        .toJSON();
    expect(treeClosed).toMatchSnapshot();

    const div = document.createElement('div');
    ReactDOM.render(<Sidebar isOpen={true} />, div);
    expect(div).toMatchSnapshot();
});

// expect there to be a download button
it('Sidebar has a download button', () => {
    render(<Sidebar />);
    const download = screen.getByText(/Download/i);
    expect(download).not.toBeDisabled();
})