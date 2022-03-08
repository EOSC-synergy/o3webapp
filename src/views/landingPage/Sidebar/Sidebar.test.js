import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './Sidebar';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createTestStore } from '../../../store/store';

let store;
describe('test sidebar component', () => {
    beforeEach(() => {
        store = createTestStore();
    });
      

    it('Sidebar renders without crashing', () => {
        render(<Provider store={store}>
            <Sidebar isOpen={true} onClose={jest.fn()} reportError={jest.fn()} onOpen={jest.fn()} />
        </Provider>);
    });

    // Snapshot test
    it('closed Sidebar renders correctly', () => {
        const { container } = render(<Provider store={store}>
            <Sidebar isOpen={false} onClose={jest.fn()} reportError={jest.fn()} onOpen={jest.fn()} />
        </Provider>);
        expect(container).toMatchSnapshot();
    });

    it('opened Sidebar renders correctly', () => {
        const { container } = render(<Provider store={store}>
            <Sidebar isOpen={true} onClose={jest.fn()} reportError={jest.fn()} onOpen={jest.fn()} />
        </Provider>);
        expect(container).toMatchSnapshot();
    });
    
    // expect there to be a download button
    it('Sidebar has a download button', () => {
        render(<Provider store={store}>
            <Sidebar isOpen={true} onClose={jest.fn()} reportError={jest.fn()} onOpen={jest.fn()} />
        </Provider>);
        const download = screen.getByText(/Download/i);
        expect(download).not.toBeDisabled();
    })
});