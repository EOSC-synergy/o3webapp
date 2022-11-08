import React from 'react';
import Sidebar from 'views/landingPage/Sidebar/Sidebar';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { AppStore, createTestStore } from 'store/store';
import { setActivePlotId } from 'store/plotSlice';
import { O3AS_PLOTS } from 'utils/constants';

describe('test sidebar component', () => {
    let store: AppStore;
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <Sidebar
                    isOpen={true}
                    onClose={jest.fn()}
                    reportError={jest.fn()}
                    onOpen={jest.fn()}
                />
            </Provider>
        );
    });

    // Snapshot test
    it('renders closed sidebar correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <Sidebar
                    isOpen={false}
                    onClose={jest.fn()}
                    reportError={jest.fn()}
                    onOpen={jest.fn()}
                />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('renders opened sidebar correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <Sidebar
                    isOpen={true}
                    onClose={jest.fn()}
                    reportError={jest.fn()}
                    onOpen={jest.fn()}
                />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    // expect there to be a download button
    it('renders a download button', () => {
        const { getByText } = render(
            <Provider store={store}>
                <Sidebar
                    isOpen={true}
                    onClose={jest.fn()}
                    reportError={jest.fn()}
                    onOpen={jest.fn()}
                />
            </Provider>
        );
        const download = getByText(/Download/i);
        expect(download).not.toBeDisabled();
    });

    it('renders the sections for the tco3_return plot', () => {
        store.dispatch(setActivePlotId({ plotId: O3AS_PLOTS.tco3_return }));
        const { container } = render(
            <Provider store={store}>
                <Sidebar
                    isOpen={true}
                    onClose={jest.fn()}
                    reportError={jest.fn()}
                    onOpen={jest.fn()}
                />
            </Provider>
        );
        expect(container).toHaveTextContent('Global'); // if it has at least one region this means the tco3_return was rendered
    });

    it('expands and closes the appearence section without crashing', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <Sidebar
                    isOpen={true}
                    onClose={jest.fn()}
                    reportError={jest.fn()}
                    onOpen={jest.fn()}
                />
            </Provider>
        );
        userEvent.click(getByTestId('Section-Summary-Appearance'));
        userEvent.click(getByTestId('Section-Summary-Appearance'));
    });

    it('opens and closes the download modal without crashing', () => {
        const { getByText, getByTestId } = render(
            <Provider store={store}>
                <Sidebar
                    isOpen={true}
                    onClose={jest.fn()}
                    reportError={jest.fn()}
                    onOpen={jest.fn()}
                />
            </Provider>
        );

        act(() => {
            userEvent.click(getByText(/Download/i));
        });
        const downloadModalCloseButton = getByTestId('DownloadModal-close');
        expect(downloadModalCloseButton).toBeInTheDocument();
        act(() => {
            userEvent.click(downloadModalCloseButton);
        });
        expect(downloadModalCloseButton).not.toBeInTheDocument();
    });
});
