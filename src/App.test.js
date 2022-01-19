import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createTestStore } from './store/store'
import { Provider } from "react-redux";

jest.mock('react-apexcharts', () => {
  return {
    __esModule: true,
    default: () => {
      return <div />
    },
  }
})

let store;
describe('test app component', () => {
  beforeEach(() => {
    store = createTestStore();
  });
  
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}>
      <App />
    </Provider>, div);
  });

});