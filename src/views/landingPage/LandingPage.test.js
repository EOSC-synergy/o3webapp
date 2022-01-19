import React from 'react';
import ReactDOM from 'react-dom';
import LandingPage from './LandingPage';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { queryByTestId } from '@testing-library/dom';
import { Provider } from "react-redux";
import { createTestStore } from '../../store/store';

jest.mock('react-apexcharts', () => {
  return {
    __esModule: true,
    default: () => {
      return <div />
    },
  }
})

let store;
describe('test LandingPage component', () => {
  beforeEach(() => {
    store = createTestStore();
  });

  it('LandingPage renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}>
      <LandingPage reportError={() => {}} />
      </Provider>, div);
  });
  
  // Snapshot test
  it('LandingPage renders correctly', () => {
      const { container } = render(<Provider store={store}>
            <LandingPage reportError={() => {}} />
          </Provider>);
      expect(container).toMatchSnapshot();
  });
});