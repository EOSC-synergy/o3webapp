import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createTestStore} from './store/store'
import {Provider} from "react-redux";
import {render} from "@testing-library/react";
import NavBar from "./components/Navbar/NavBar";
import LandingPage from "./views/landingPage/LandingPage";

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