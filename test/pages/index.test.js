import React from 'react';
import App from '../../pages';
import {createTestStore} from '../../src/store/store'
import {Provider} from "react-redux";
import {render} from "@testing-library/react";
import NavBar from "../../src/components/Navbar/NavBar";
import LandingPage from "../../src/views/landingPage/LandingPage";

jest.mock('react-apexcharts', () => {
    return {
        __esModule: true,
        default: () => {
            return <div/>
        },
    }
})

let store;
describe('test app component', () => {
    beforeEach(() => {
        store = createTestStore();
    });
  

    it('renders without crashing', () => {
        render(
            <Provider store={store}>
                <NavBar/>
                <LandingPage reportError={() => {
                }} isSidebarOpen={true} openSidebar={jest.fn()} closeSidebar={jest.fn()}/>
                <App/>
            </Provider>
        );
    });

});