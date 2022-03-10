import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './Sidebar';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createTestStore } from '../../../store/store';
import { setActivePlotId } from '../../../store/plotSlice/plotSlice';
import { O3AS_PLOTS } from '../../../utils/constants';

describe('test sidebar component', () => {
    let store;
    beforeEach(() => {
        store = createTestStore();
    });
      

    it('renders without crashing', () => {
        render(<Provider store={store}>
            <Sidebar isOpen={true} onClose={jest.fn()} reportError={jest.fn()} onOpen={jest.fn()} />
        </Provider>);
    });

    // Snapshot test
    it('renders closed sidebar correctly', () => {
        const { container } = render(<Provider store={store}>
            <Sidebar isOpen={false} onClose={jest.fn()} reportError={jest.fn()} onOpen={jest.fn()} />
        </Provider>);
        expect(container).toMatchSnapshot();
    });

    it('renders opened sidebar correctly', () => {
        const { container } = render(<Provider store={store}>
            <Sidebar isOpen={true} onClose={jest.fn()} reportError={jest.fn()} onOpen={jest.fn()} />
        </Provider>);
        expect(container).toMatchSnapshot();
    });
    
    // expect there to be a download button
    it('renders a download button', () => {
        const {getByText} = render(<Provider store={store}>
            <Sidebar isOpen={true} onClose={jest.fn()} reportError={jest.fn()} onOpen={jest.fn()} />
        </Provider>);
        const download = getByText(/Download/i);
        expect(download).not.toBeDisabled();
    })


    it('renders the sections for the tco3_return plot', () => {
        store.dispatch(setActivePlotId({plotId: O3AS_PLOTS.tco3_return}));
        const { container } = render(<Provider store={store}>
            <Sidebar isOpen={true} onClose={jest.fn()} reportError={jest.fn()} onOpen={jest.fn()} />
        </Provider>);
        expect(container).toHaveTextContent("Global"); // if it has at least one region this means the tco3_return was rendered
    })

    


    

});