import React from 'react';
import NavBar from '../../../../src/components/Navbar';
import LandingPage from '../../../../src/views/landingPage/LandingPage';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createTestStore } from '../../../../src/store';

jest.mock('react-apexcharts', () => {
    return {
        __esModule: true,
        default: () => {
            return <div />;
        },
    };
});

let store;
describe('test LandingPage component rendering', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <NavBar />
                <LandingPage
                    reportError={() => {}}
                    isSidebarOpen={true}
                    openSidebar={jest.fn()}
                    closeSidebar={jest.fn()}
                />
            </Provider>
        );
    });

    // Snapshot test
    it('LandingPage renders correctly', () => {
        const { container } = render(
            <Provider store={store}>
                <NavBar />
                <LandingPage
                    reportError={() => {}}
                    isSidebarOpen={true}
                    openSidebar={jest.fn()}
                    closeSidebar={jest.fn()}
                />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('closes sidebar, when clicking outside of sidebar', () => {
        const closeSidebar = jest.fn();
        const { getByTestId } = render(
            <Provider store={store}>
                <NavBar />
                <LandingPage
                    reportError={() => {}}
                    isSidebarOpen={true}
                    openSidebar={jest.fn()}
                    closeSidebar={closeSidebar}
                />
            </Provider>
        );
        userEvent.click(getByTestId(/landingPage-not-sidebar/));
        expect(closeSidebar).toHaveBeenCalled();
    });
});
